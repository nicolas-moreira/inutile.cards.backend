import { z } from 'zod';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { Profile } from '../models/Profile.js';
import { UserFinance } from '../models/Finance.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { authenticateToken } from '../middleware/auth.js';
// Validation schemas
const registerSchema = z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    firstName: z.string().min(1, 'Le prénom est requis'),
    lastName: z.string().min(1, 'Le nom est requis'),
    phone: z.string().optional(),
});
const loginSchema = z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(1, 'Le mot de passe est requis'),
});
const forgotPasswordSchema = z.object({
    email: z.string().email('Email invalide'),
});
const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Token requis'),
    password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});
const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
    newPassword: z.string().min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères'),
});
// Helper to generate slug from name
function generateSlug(firstName, lastName) {
    const base = `${firstName}.${lastName}`
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9.]/g, '');
    return base;
}
async function getUniqueSlug(firstName, lastName) {
    let slug = generateSlug(firstName, lastName);
    let counter = 0;
    while (await Profile.findBySlug(slug)) {
        counter++;
        slug = `${generateSlug(firstName, lastName)}${counter}`;
    }
    return slug;
}
export async function authRoutes(fastify) {
    // Register
    fastify.post('/register', async (request, reply) => {
        try {
            const body = registerSchema.parse(request.body);
            // Check if user exists
            const existingUser = await User.findByEmail(body.email);
            if (existingUser) {
                return reply.status(400).send(errorResponse('Cet email est déjà utilisé'));
            }
            // Create user
            const user = new User({
                email: body.email,
                password: body.password,
                firstName: body.firstName,
                lastName: body.lastName,
                phone: body.phone,
            });
            await user.save();
            // Create default profile
            const slug = await getUniqueSlug(body.firstName, body.lastName);
            const profile = new Profile({
                userId: user._id.toString(),
                slug,
                displayName: `${body.firstName} ${body.lastName}`,
            });
            await profile.save();
            // Create finance record
            const finance = new UserFinance({
                userId: user._id.toString(),
            });
            await finance.save();
            // Generate JWT
            const payload = {
                userId: user._id.toString(),
                email: user.email,
                role: user.role,
            };
            const token = fastify.jwt.sign(payload);
            return reply.status(201).send(successResponse({
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                },
                profile: {
                    slug: profile.slug,
                },
                token,
            }, 'Inscription réussie'));
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send(errorResponse(error.errors[0].message));
            }
            fastify.log.error(error);
            return reply.status(500).send(errorResponse('Erreur lors de l\'inscription'));
        }
    });
    // Login
    fastify.post('/login', async (request, reply) => {
        try {
            const body = loginSchema.parse(request.body);
            // Find user
            const user = await User.findByEmail(body.email);
            if (!user) {
                return reply.status(401).send(errorResponse('Email ou mot de passe incorrect'));
            }
            // Check if active
            if (!user.isActive) {
                return reply.status(401).send(errorResponse('Compte désactivé'));
            }
            // Verify password
            const isValid = await user.comparePassword(body.password);
            if (!isValid) {
                return reply.status(401).send(errorResponse('Email ou mot de passe incorrect'));
            }
            // Generate JWT
            const payload = {
                userId: user._id.toString(),
                email: user.email,
                role: user.role,
            };
            const token = fastify.jwt.sign(payload);
            // Get profile
            const profile = await Profile.findByUserId(user._id.toString());
            return reply.send(successResponse({
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    role: user.role,
                },
                profile: profile ? { slug: profile.slug } : null,
                token,
            }, 'Connexion réussie'));
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send(errorResponse(error.errors[0].message));
            }
            fastify.log.error(error);
            return reply.status(500).send(errorResponse('Erreur lors de la connexion'));
        }
    });
    // Forgot password
    fastify.post('/forgot-password', async (request, reply) => {
        try {
            const body = forgotPasswordSchema.parse(request.body);
            const user = await User.findByEmail(body.email);
            if (!user) {
                // Don't reveal if email exists
                return reply.send(successResponse(null, 'Si cet email existe, un lien de réinitialisation a été envoyé'));
            }
            // Generate reset token
            const resetToken = crypto.randomBytes(32).toString('hex');
            user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
            user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
            await user.save();
            // TODO: Send email with reset link
            // For now, log the token (remove in production)
            fastify.log.info(`Reset token for ${user.email}: ${resetToken}`);
            return reply.send(successResponse(null, 'Si cet email existe, un lien de réinitialisation a été envoyé'));
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send(errorResponse(error.errors[0].message));
            }
            fastify.log.error(error);
            return reply.status(500).send(errorResponse('Erreur lors de la demande'));
        }
    });
    // Reset password
    fastify.post('/reset-password', async (request, reply) => {
        try {
            const body = resetPasswordSchema.parse(request.body);
            const hashedToken = crypto.createHash('sha256').update(body.token).digest('hex');
            const user = await User.findOne({
                resetPasswordToken: hashedToken,
                resetPasswordExpires: { $gt: new Date() },
            });
            if (!user) {
                return reply.status(400).send(errorResponse('Token invalide ou expiré'));
            }
            user.password = body.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            return reply.send(successResponse(null, 'Mot de passe réinitialisé avec succès'));
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send(errorResponse(error.errors[0].message));
            }
            fastify.log.error(error);
            return reply.status(500).send(errorResponse('Erreur lors de la réinitialisation'));
        }
    });
    // Change password (authenticated)
    fastify.post('/change-password', { preHandler: [authenticateToken] }, async (request, reply) => {
        try {
            const body = changePasswordSchema.parse(request.body);
            const jwtPayload = request.user;
            const user = await User.findById(jwtPayload.userId);
            if (!user) {
                return reply.status(404).send(errorResponse('Utilisateur non trouvé'));
            }
            const isValid = await user.comparePassword(body.currentPassword);
            if (!isValid) {
                return reply.status(400).send(errorResponse('Mot de passe actuel incorrect'));
            }
            user.password = body.newPassword;
            await user.save();
            return reply.send(successResponse(null, 'Mot de passe modifié avec succès'));
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send(errorResponse(error.errors[0].message));
            }
            fastify.log.error(error);
            return reply.status(500).send(errorResponse('Erreur lors du changement de mot de passe'));
        }
    });
    // Get current user
    fastify.get('/me', { preHandler: [authenticateToken] }, async (request, reply) => {
        try {
            const jwtPayload = request.user;
            const user = await User.findById(jwtPayload.userId).select('-password');
            if (!user) {
                return reply.status(404).send(errorResponse('Utilisateur non trouvé'));
            }
            const profile = await Profile.findByUserId(user._id.toString());
            return reply.send(successResponse({
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    role: user.role,
                },
                profile: profile ? { slug: profile.slug } : null,
            }));
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send(errorResponse('Erreur serveur'));
        }
    });
}
//# sourceMappingURL=auth.js.map