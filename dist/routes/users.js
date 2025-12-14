import { z } from 'zod';
import { User } from '../models/User.js';
import { Profile } from '../models/Profile.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
const updateUserSchema = z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    phone: z.string().optional().nullable(),
});
const adminUpdateUserSchema = updateUserSchema.extend({
    email: z.string().email().optional(),
    role: z.enum(['user', 'admin']).optional(),
    isActive: z.boolean().optional(),
});
export async function userRoutes(fastify) {
    // Get current user
    fastify.get('/me', { preHandler: [authenticateToken] }, async (request, reply) => {
        try {
            const jwtPayload = request.user;
            const user = await User.findById(jwtPayload.userId).select('-password');
            if (!user) {
                return reply.status(404).send(errorResponse('Utilisateur non trouvé'));
            }
            return reply.send(successResponse({
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt,
            }));
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send(errorResponse('Erreur serveur'));
        }
    });
    // Update current user
    fastify.put('/me', { preHandler: [authenticateToken] }, async (request, reply) => {
        try {
            const jwtPayload = request.user;
            const body = updateUserSchema.parse(request.body);
            const user = await User.findByIdAndUpdate(jwtPayload.userId, body, { new: true }).select('-password');
            if (!user) {
                return reply.status(404).send(errorResponse('Utilisateur non trouvé'));
            }
            return reply.send(successResponse({
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                role: user.role,
            }, 'Profil mis à jour'));
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send(errorResponse(error.errors[0].message));
            }
            fastify.log.error(error);
            return reply.status(500).send(errorResponse('Erreur lors de la mise à jour'));
        }
    });
    // Delete current user account
    fastify.delete('/me', { preHandler: [authenticateToken] }, async (request, reply) => {
        try {
            const jwtPayload = request.user;
            // Soft delete - deactivate account
            await User.findByIdAndUpdate(jwtPayload.userId, { isActive: false });
            // Optionally hide profile
            await Profile.findOneAndUpdate({ userId: jwtPayload.userId }, { isPublic: false });
            return reply.send(successResponse(null, 'Compte désactivé'));
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send(errorResponse('Erreur lors de la désactivation du compte'));
        }
    });
    // Admin: List all users
    fastify.get('/', { preHandler: [authenticateToken, requireAdmin] }, async (request, reply) => {
        try {
            const page = parseInt(request.query.page || '1', 10);
            const limit = parseInt(request.query.limit || '20', 10);
            const skip = (page - 1) * limit;
            const search = request.query.search;
            const query = {};
            if (search) {
                query.$or = [
                    { email: { $regex: search, $options: 'i' } },
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                ];
            }
            const [users, total] = await Promise.all([
                User.find(query)
                    .select('-password')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                User.countDocuments(query),
            ]);
            return reply.send(paginatedResponse(users, page, limit, total));
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send(errorResponse('Erreur serveur'));
        }
    });
    // Admin: Get user by ID
    fastify.get('/:userId', { preHandler: [authenticateToken, requireAdmin] }, async (request, reply) => {
        try {
            const { userId } = request.params;
            const user = await User.findById(userId).select('-password');
            if (!user) {
                return reply.status(404).send(errorResponse('Utilisateur non trouvé'));
            }
            const profile = await Profile.findByUserId(userId);
            return reply.send(successResponse({
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    role: user.role,
                    isActive: user.isActive,
                    createdAt: user.createdAt,
                },
                profile: profile ? { slug: profile.slug, displayName: profile.displayName } : null,
            }));
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send(errorResponse('Erreur serveur'));
        }
    });
    // Admin: Update user
    fastify.put('/:userId', { preHandler: [authenticateToken, requireAdmin] }, async (request, reply) => {
        try {
            const { userId } = request.params;
            const body = adminUpdateUserSchema.parse(request.body);
            const user = await User.findByIdAndUpdate(userId, body, { new: true }).select('-password');
            if (!user) {
                return reply.status(404).send(errorResponse('Utilisateur non trouvé'));
            }
            return reply.send(successResponse({
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                role: user.role,
                isActive: user.isActive,
            }, 'Utilisateur mis à jour'));
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send(errorResponse(error.errors[0].message));
            }
            fastify.log.error(error);
            return reply.status(500).send(errorResponse('Erreur lors de la mise à jour'));
        }
    });
    // Admin: Delete user (soft delete)
    fastify.delete('/:userId', { preHandler: [authenticateToken, requireAdmin] }, async (request, reply) => {
        try {
            const { userId } = request.params;
            const user = await User.findByIdAndUpdate(userId, { isActive: false }, { new: true });
            if (!user) {
                return reply.status(404).send(errorResponse('Utilisateur non trouvé'));
            }
            // Hide profile
            await Profile.findOneAndUpdate({ userId }, { isPublic: false });
            return reply.send(successResponse(null, 'Utilisateur désactivé'));
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send(errorResponse('Erreur lors de la désactivation'));
        }
    });
}
//# sourceMappingURL=users.js.map