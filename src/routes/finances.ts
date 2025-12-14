import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { UserFinance, Bill, PhysicalCard } from '../models/Finance.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { JWTPayload } from '../types/index.js';

const addPaymentCardSchema = z.object({
  last4: z.string().length(4, 'Les 4 derniers chiffres sont requis'),
  brand: z.string().min(1, 'La marque est requise'),
  expiryMonth: z.number().min(1).max(12),
  expiryYear: z.number().min(2024),
  isDefault: z.boolean().default(false),
});

const orderPhysicalCardSchema = z.object({
  type: z.enum(['classic', 'premium', 'metal']),
});

const updatePhysicalCardSchema = z.object({
  status: z.enum(['ordered', 'processing', 'shipped', 'delivered']),
  trackingNumber: z.string().optional(),
});

export async function financeRoutes(fastify: FastifyInstance): Promise<void> {
  // Get user finance overview
  fastify.get('/overview', { preHandler: [authenticateToken] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const jwtPayload = request.user as JWTPayload;
      
      const [finance, bills, cards] = await Promise.all([
        UserFinance.findOne({ userId: jwtPayload.userId }),
        Bill.find({ userId: jwtPayload.userId }).sort({ createdAt: -1 }).limit(5),
        PhysicalCard.find({ userId: jwtPayload.userId }).sort({ orderedAt: -1 }),
      ]);
      
      return reply.send(successResponse({
        paymentCards: finance?.paymentCards || [],
        subscription: finance?.subscription || null,
        recentBills: bills,
        physicalCards: cards,
      }));
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send(errorResponse('Erreur serveur'));
    }
  });

  // Get payment cards
  fastify.get('/payment-cards', { preHandler: [authenticateToken] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const jwtPayload = request.user as JWTPayload;
      
      const finance = await UserFinance.findOne({ userId: jwtPayload.userId });
      
      return reply.send(successResponse(finance?.paymentCards || []));
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send(errorResponse('Erreur serveur'));
    }
  });

  // Add payment card
  fastify.post('/payment-cards', { preHandler: [authenticateToken] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const jwtPayload = request.user as JWTPayload;
      const body = addPaymentCardSchema.parse(request.body);
      
      let finance = await UserFinance.findOne({ userId: jwtPayload.userId });
      
      if (!finance) {
        finance = new UserFinance({ userId: jwtPayload.userId });
      }
      
      const newCard = {
        id: nanoid(),
        ...body,
      };
      
      // If this is the first card or marked as default, set as default
      if (body.isDefault || finance.paymentCards.length === 0) {
        finance.paymentCards.forEach(card => {
          card.isDefault = false;
        });
        newCard.isDefault = true;
      }
      
      finance.paymentCards.push(newCard);
      await finance.save();
      
      return reply.status(201).send(successResponse(newCard, 'Carte ajoutée'));
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send(errorResponse(error.errors[0].message));
      }
      fastify.log.error(error);
      return reply.status(500).send(errorResponse('Erreur lors de l\'ajout de la carte'));
    }
  });

  // Remove payment card
  fastify.delete('/payment-cards/:cardId', { preHandler: [authenticateToken] }, async (request: FastifyRequest<{ Params: { cardId: string } }>, reply: FastifyReply) => {
    try {
      const jwtPayload = request.user as JWTPayload;
      const { cardId } = request.params;
      
      const finance = await UserFinance.findOne({ userId: jwtPayload.userId });
      if (!finance) {
        return reply.status(404).send(errorResponse('Aucune carte trouvée'));
      }
      
      const cardIndex = finance.paymentCards.findIndex(c => c.id === cardId);
      if (cardIndex === -1) {
        return reply.status(404).send(errorResponse('Carte non trouvée'));
      }
      
      const wasDefault = finance.paymentCards[cardIndex].isDefault;
      finance.paymentCards.splice(cardIndex, 1);
      
      // If removed card was default, set first remaining as default
      if (wasDefault && finance.paymentCards.length > 0) {
        finance.paymentCards[0].isDefault = true;
      }
      
      await finance.save();
      
      return reply.send(successResponse(null, 'Carte supprimée'));
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send(errorResponse('Erreur lors de la suppression de la carte'));
    }
  });

  // Set default payment card
  fastify.put('/payment-cards/:cardId/default', { preHandler: [authenticateToken] }, async (request: FastifyRequest<{ Params: { cardId: string } }>, reply: FastifyReply) => {
    try {
      const jwtPayload = request.user as JWTPayload;
      const { cardId } = request.params;
      
      const finance = await UserFinance.findOne({ userId: jwtPayload.userId });
      if (!finance) {
        return reply.status(404).send(errorResponse('Aucune carte trouvée'));
      }
      
      const cardIndex = finance.paymentCards.findIndex(c => c.id === cardId);
      if (cardIndex === -1) {
        return reply.status(404).send(errorResponse('Carte non trouvée'));
      }
      
      finance.paymentCards.forEach((card, index) => {
        card.isDefault = index === cardIndex;
      });
      
      await finance.save();
      
      return reply.send(successResponse(finance.paymentCards[cardIndex], 'Carte par défaut mise à jour'));
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send(errorResponse('Erreur lors de la mise à jour'));
    }
  });

  // Get subscription
  fastify.get('/subscription', { preHandler: [authenticateToken] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const jwtPayload = request.user as JWTPayload;
      
      const finance = await UserFinance.findOne({ userId: jwtPayload.userId });
      
      return reply.send(successResponse(finance?.subscription || null));
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send(errorResponse('Erreur serveur'));
    }
  });

  // Get bills
  fastify.get('/bills', { preHandler: [authenticateToken] }, async (request: FastifyRequest<{ Querystring: { page?: string; limit?: string } }>, reply: FastifyReply) => {
    try {
      const jwtPayload = request.user as JWTPayload;
      const page = parseInt(request.query.page || '1', 10);
      const limit = parseInt(request.query.limit || '10', 10);
      const skip = (page - 1) * limit;
      
      const [bills, total] = await Promise.all([
        Bill.find({ userId: jwtPayload.userId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Bill.countDocuments({ userId: jwtPayload.userId }),
      ]);
      
      return reply.send(paginatedResponse(bills, page, limit, total));
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send(errorResponse('Erreur serveur'));
    }
  });

  // Get physical cards
  fastify.get('/physical-cards', { preHandler: [authenticateToken] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const jwtPayload = request.user as JWTPayload;
      
      const cards = await PhysicalCard.find({ userId: jwtPayload.userId }).sort({ orderedAt: -1 });
      
      return reply.send(successResponse(cards));
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send(errorResponse('Erreur serveur'));
    }
  });

  // Order physical card
  fastify.post('/physical-cards', { preHandler: [authenticateToken] }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const jwtPayload = request.user as JWTPayload;
      const body = orderPhysicalCardSchema.parse(request.body);
      
      const card = new PhysicalCard({
        userId: jwtPayload.userId,
        type: body.type,
        status: 'ordered',
        orderedAt: new Date(),
      });
      
      await card.save();
      
      // TODO: Create bill for the card order
      
      return reply.status(201).send(successResponse(card, 'Carte commandée'));
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send(errorResponse(error.errors[0].message));
      }
      fastify.log.error(error);
      return reply.status(500).send(errorResponse('Erreur lors de la commande'));
    }
  });

  // Admin: Update physical card status
  fastify.put('/physical-cards/:cardId', { preHandler: [authenticateToken, requireAdmin] }, async (request: FastifyRequest<{ Params: { cardId: string } }>, reply: FastifyReply) => {
    try {
      const { cardId } = request.params;
      const body = updatePhysicalCardSchema.parse(request.body);
      
      const updateData: Record<string, unknown> = { status: body.status };
      
      if (body.trackingNumber) {
        updateData.trackingNumber = body.trackingNumber;
      }
      
      if (body.status === 'shipped') {
        updateData.shippedAt = new Date();
      } else if (body.status === 'delivered') {
        updateData.deliveredAt = new Date();
      }
      
      const card = await PhysicalCard.findByIdAndUpdate(cardId, updateData, { new: true });
      if (!card) {
        return reply.status(404).send(errorResponse('Carte non trouvée'));
      }
      
      return reply.send(successResponse(card, 'Statut mis à jour'));
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send(errorResponse(error.errors[0].message));
      }
      fastify.log.error(error);
      return reply.status(500).send(errorResponse('Erreur lors de la mise à jour'));
    }
  });
}



