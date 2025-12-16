import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { Template } from '../models/Template.js';
import { Profile } from '../models/Profile.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { JWTPayload } from '../types/index.js';

const themeSchema = z.object({
  backgroundColor: z.string().default('#0a0a0a'),
  textColor: z.string().default('#ffffff'),
  buttonColor: z.string().default('#d4af37'),
  buttonTextColor: z.string().default('#0a0a0a'),
  buttonStyle: z.enum(['rounded', 'square', 'pill']).default('rounded'),
  fontFamily: z.string().default('Inter'),
});

const createTemplateSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  thumbnailUrl: z.string().url().optional(),
  theme: themeSchema,
  isPremium: z.boolean().default(false),
});

const updateTemplateSchema = createTemplateSchema.partial();

export async function templateRoutes(fastify: FastifyInstance): Promise<void> {
  // Get all active templates (public)
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const templates = await Template.findActiveTemplates();
      
      return reply.send(successResponse(templates));
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send(errorResponse('Erreur serveur'));
    }
  });

  // Admin: Get all templates (active and inactive)
  fastify.get('/admin/all', { preHandler: [authenticateToken, requireAdmin] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const templates = await Template.find().sort({ createdAt: -1 });
      
      return reply.send(successResponse(templates));
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send(errorResponse('Erreur serveur'));
    }
  });

  // Get template by ID
  fastify.get('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;
      
      const template = await Template.findById(id);
      if (!template) {
        return reply.status(404).send(errorResponse('Template non trouvé'));
      }
      
      return reply.send(successResponse(template));
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send(errorResponse('Erreur serveur'));
    }
  });

  // Apply template to profile
  fastify.post<{ Params: { id: string } }>('/:id/apply', { preHandler: [authenticateToken] }, async (request, reply) => {
    try {
      const { id } = request.params;
      const jwtPayload = request.user as JWTPayload;
      
      const template = await Template.findById(id);
      if (!template || !template.isActive) {
        return reply.status(404).send(errorResponse('Template non trouvé'));
      }
      
      const profile = await Profile.findByUserId(jwtPayload.userId);
      if (!profile) {
        return reply.status(404).send(errorResponse('Profil non trouvé'));
      }
      
      // TODO: Check if user has premium access for premium templates
      
      profile.theme = template.theme;
      profile.templateId = template._id.toString();
      await profile.save();
      
      return reply.send(successResponse(profile, 'Template appliqué'));
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send(errorResponse('Erreur lors de l\'application du template'));
    }
  });

  // Admin: Create template
  fastify.post('/', { preHandler: [authenticateToken, requireAdmin] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = createTemplateSchema.parse(request.body);
      
      const template = new Template(body);
      await template.save();
      
      return reply.status(201).send(successResponse(template, 'Template créé'));
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send(errorResponse(error.errors[0].message));
      }
      fastify.log.error(error);
      return reply.status(500).send(errorResponse('Erreur lors de la création du template'));
    }
  });

  // Admin: Create template
  fastify.post('/', { preHandler: [authenticateToken, requireAdmin] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = createTemplateSchema.parse(request.body);
      
      const template = new Template({ ...body, isActive: true });
      await template.save();
      
      return reply.status(201).send(successResponse(template, 'Template créé'));
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send(errorResponse(error.errors[0].message));
      }
      fastify.log.error(error);
      return reply.status(500).send(errorResponse('Erreur lors de la création du template'));
    }
  });

  // Admin: Update template
  fastify.put<{ Params: { id: string } }>('/:id', { preHandler: [authenticateToken, requireAdmin] }, async (request, reply) => {
    try {
      const { id } = request.params;
      const body = updateTemplateSchema.parse(request.body);
      
      const template = await Template.findByIdAndUpdate(id, body, { new: true });
      if (!template) {
        return reply.status(404).send(errorResponse('Template non trouvé'));
      }
      
      return reply.send(successResponse(template, 'Template mis à jour'));
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send(errorResponse(error.errors[0].message));
      }
      fastify.log.error(error);
      return reply.status(500).send(errorResponse('Erreur lors de la mise à jour du template'));
    }
  });

  // Admin: Delete template (soft delete)
  fastify.delete<{ Params: { id: string } }>('/:id', { preHandler: [authenticateToken, requireAdmin] }, async (request, reply) => {
    try {
      const { id } = request.params;
      
      const template = await Template.findByIdAndUpdate(id, { isActive: false }, { new: true });
      if (!template) {
        return reply.status(404).send(errorResponse('Template non trouvé'));
      }
      
      return reply.send(successResponse(null, 'Template supprimé'));
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send(errorResponse('Erreur lors de la suppression du template'));
    }
  });
}



