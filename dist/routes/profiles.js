import { z } from 'zod';
import { nanoid } from 'nanoid';
import { Profile } from '../models/Profile.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { authenticateToken } from '../middleware/auth.js';
// Validation schemas
const linkSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, 'Le titre est requis'),
    url: z.string().url('URL invalide'),
    icon: z.string().optional(),
    isActive: z.boolean().default(true),
    order: z.number().default(0),
});
const socialLinkSchema = z.object({
    platform: z.string().min(1, 'La plateforme est requise'),
    url: z.string().url('URL invalide'),
    isActive: z.boolean().default(true),
});
const themeSchema = z.object({
    backgroundColor: z.string().default('#0a0a0a'),
    textColor: z.string().default('#ffffff'),
    buttonColor: z.string().default('#d4af37'),
    linkBlockColor: z.string().optional(),
    buttonTextColor: z.string().default('#0a0a0a'),
    buttonStyle: z.enum(['rounded', 'square', 'pill']).default('rounded'),
    fontFamily: z.string().default('Inter'),
    nameFontSize: z.number().optional(),
    bioFontSize: z.number().optional(),
    linkFontSize: z.number().optional(),
});
const updateProfileSchema = z.object({
    displayName: z.string().min(1).optional(),
    bio: z.string().max(500).optional(),
    avatarUrl: z.string().url().optional().nullable(),
    email: z.string().email().optional().nullable(),
    phone: z.string().optional().nullable(),
    links: z.array(linkSchema).optional(),
    socialLinks: z.array(socialLinkSchema).optional(),
    theme: themeSchema.optional(),
    isPublic: z.boolean().optional(),
    templateId: z.string().optional().nullable(),
});
const updateSlugSchema = z.object({
    slug: z.string()
        .min(3, 'Le slug doit contenir au moins 3 caractères')
        .max(50, 'Le slug ne peut pas dépasser 50 caractères')
        .regex(/^[a-z0-9._-]+$/, 'Le slug ne peut contenir que des lettres minuscules, chiffres, points, tirets et underscores'),
});
export async function profileRoutes(fastify) {
    // Get public profile by slug (no auth required)
    fastify.get('/public/:slug', async (request, reply) => {
        try {
            const { slug } = request.params;
            const profile = await Profile.findBySlug(slug);
            if (!profile) {
                return reply.status(404).send(errorResponse('Profil non trouvé'));
            }
            if (!profile.isPublic) {
                return reply.status(403).send(errorResponse('Ce profil est privé'));
            }
            // Filter inactive links
            const activeLinks = profile.links.filter(link => link.isActive);
            const activeSocialLinks = profile.socialLinks.filter(link => link.isActive);
            // Get user to check if admin
            const { User } = await import('../models/index.js');
            const user = await User.findById(profile.userId);
            const isAdmin = user?.role === 'admin';
            return reply.send(successResponse({
                slug: profile.slug,
                displayName: profile.displayName,
                bio: profile.bio,
                avatarUrl: profile.avatarUrl,
                email: profile.email,
                phone: profile.phone,
                isAdmin,
                links: activeLinks,
                socialLinks: activeSocialLinks,
                theme: profile.theme,
            }));
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send(errorResponse('Erreur serveur'));
        }
    });
    // Get current user's profile
    fastify.get('/me', { preHandler: [authenticateToken] }, async (request, reply) => {
        try {
            const jwtPayload = request.user;
            const profile = await Profile.findByUserId(jwtPayload.userId);
            if (!profile) {
                return reply.status(404).send(errorResponse('Profil non trouvé'));
            }
            // Get user to check if admin
            const { User } = await import('../models/index.js');
            const user = await User.findById(jwtPayload.userId);
            const isAdmin = user?.role === 'admin';
            return reply.send(successResponse({
                ...profile.toObject(),
                isAdmin,
            }));
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send(errorResponse('Erreur serveur'));
        }
    });
    // Update profile
    fastify.put('/me', { preHandler: [authenticateToken] }, async (request, reply) => {
        try {
            const jwtPayload = request.user;
            const body = updateProfileSchema.parse(request.body);
            const profile = await Profile.findByUserId(jwtPayload.userId);
            if (!profile) {
                return reply.status(404).send(errorResponse('Profil non trouvé'));
            }
            // Process links to ensure they have IDs
            if (body.links) {
                body.links = body.links.map(link => ({
                    ...link,
                    id: link.id || nanoid(),
                }));
            }
            // Update profile
            Object.assign(profile, body);
            await profile.save();
            return reply.send(successResponse(profile, 'Profil mis à jour'));
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send(errorResponse(error.errors[0].message));
            }
            fastify.log.error(error);
            return reply.status(500).send(errorResponse('Erreur lors de la mise à jour'));
        }
    });
    // Update slug
    fastify.put('/me/slug', { preHandler: [authenticateToken] }, async (request, reply) => {
        try {
            const jwtPayload = request.user;
            const body = updateSlugSchema.parse(request.body);
            const profile = await Profile.findByUserId(jwtPayload.userId);
            if (!profile) {
                return reply.status(404).send(errorResponse('Profil non trouvé'));
            }
            // Check if slug is already taken
            const existingProfile = await Profile.findBySlug(body.slug);
            if (existingProfile && existingProfile._id.toString() !== profile._id.toString()) {
                return reply.status(400).send(errorResponse('Ce slug est déjà utilisé'));
            }
            profile.slug = body.slug;
            await profile.save();
            return reply.send(successResponse({ slug: profile.slug }, 'Slug mis à jour'));
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send(errorResponse(error.errors[0].message));
            }
            fastify.log.error(error);
            return reply.status(500).send(errorResponse('Erreur lors de la mise à jour du slug'));
        }
    });
    // Add link
    fastify.post('/me/links', { preHandler: [authenticateToken] }, async (request, reply) => {
        try {
            const jwtPayload = request.user;
            const body = linkSchema.parse(request.body);
            const profile = await Profile.findByUserId(jwtPayload.userId);
            if (!profile) {
                return reply.status(404).send(errorResponse('Profil non trouvé'));
            }
            const newLink = {
                id: nanoid(),
                title: body.title,
                url: body.url,
                icon: body.icon,
                isActive: body.isActive,
                order: body.order ?? profile.links.length,
            };
            profile.links.push(newLink);
            await profile.save();
            return reply.status(201).send(successResponse(newLink, 'Lien ajouté'));
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send(errorResponse(error.errors[0].message));
            }
            fastify.log.error(error);
            return reply.status(500).send(errorResponse('Erreur lors de l\'ajout du lien'));
        }
    });
    // Update link
    fastify.put('/me/links/:linkId', { preHandler: [authenticateToken] }, async (request, reply) => {
        try {
            const jwtPayload = request.user;
            const { linkId } = request.params;
            const body = linkSchema.partial().parse(request.body);
            const profile = await Profile.findByUserId(jwtPayload.userId);
            if (!profile) {
                return reply.status(404).send(errorResponse('Profil non trouvé'));
            }
            const linkIndex = profile.links.findIndex(l => l.id === linkId);
            if (linkIndex === -1) {
                return reply.status(404).send(errorResponse('Lien non trouvé'));
            }
            profile.links[linkIndex] = { ...profile.links[linkIndex], ...body };
            await profile.save();
            return reply.send(successResponse(profile.links[linkIndex], 'Lien mis à jour'));
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send(errorResponse(error.errors[0].message));
            }
            fastify.log.error(error);
            return reply.status(500).send(errorResponse('Erreur lors de la mise à jour du lien'));
        }
    });
    // Delete link
    fastify.delete('/me/links/:linkId', { preHandler: [authenticateToken] }, async (request, reply) => {
        try {
            const jwtPayload = request.user;
            const { linkId } = request.params;
            const profile = await Profile.findByUserId(jwtPayload.userId);
            if (!profile) {
                return reply.status(404).send(errorResponse('Profil non trouvé'));
            }
            const linkIndex = profile.links.findIndex(l => l.id === linkId);
            if (linkIndex === -1) {
                return reply.status(404).send(errorResponse('Lien non trouvé'));
            }
            profile.links.splice(linkIndex, 1);
            await profile.save();
            return reply.send(successResponse(null, 'Lien supprimé'));
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send(errorResponse('Erreur lors de la suppression du lien'));
        }
    });
    // Reorder links
    fastify.put('/me/links/reorder', { preHandler: [authenticateToken] }, async (request, reply) => {
        try {
            const jwtPayload = request.user;
            const body = z.object({
                linkIds: z.array(z.string()),
            }).parse(request.body);
            const profile = await Profile.findByUserId(jwtPayload.userId);
            if (!profile) {
                return reply.status(404).send(errorResponse('Profil non trouvé'));
            }
            // Reorder links based on the provided order
            const reorderedLinks = body.linkIds.map((id, index) => {
                const link = profile.links.find(l => l.id === id);
                if (link) {
                    return { ...link, order: index };
                }
                return null;
            }).filter(Boolean);
            profile.links = reorderedLinks;
            await profile.save();
            return reply.send(successResponse(profile.links, 'Liens réordonnés'));
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send(errorResponse(error.errors[0].message));
            }
            fastify.log.error(error);
            return reply.status(500).send(errorResponse('Erreur lors du réordonnancement'));
        }
    });
    // Check slug availability
    fastify.get('/check-slug/:slug', async (request, reply) => {
        try {
            const { slug } = request.params;
            const existingProfile = await Profile.findBySlug(slug);
            return reply.send(successResponse({
                available: !existingProfile,
                slug,
            }));
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send(errorResponse('Erreur serveur'));
        }
    });
}
//# sourceMappingURL=profiles.js.map