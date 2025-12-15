import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ClientCard, Profile, CardScan } from '../models/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { AuthenticatedRequest } from '../types/index.js';

export async function cardsRoutes(fastify: FastifyInstance) {
  // ============================================
  // PUBLIC ROUTES - No authentication required
  // ============================================

  // Get card info by serial number (for setup page)
  fastify.get<{ Params: { serialNumber: string } }>(
    '/setup/:serialNumber',
    async (request: FastifyRequest<{ Params: { serialNumber: string } }>, reply: FastifyReply) => {
      try {
        const card = await ClientCard.findBySerialNumber(request.params.serialNumber);

        if (!card) {
          return reply.status(404).send(errorResponse('Carte non trouvée'));
        }

        // Return only safe information
        const safeCardInfo = {
          serialNumber: card.serialNumber,
          cardType: card.cardType,
          design: card.design,
          status: card.status,
          isActivated: card.status === 'activated',
          activatedAt: card.activatedAt,
          profileId: card.profileId,
        };

        return reply.send(successResponse(safeCardInfo));
      } catch (error) {
        console.error('Erreur get card setup:', error);
        return reply.status(500).send(errorResponse('Erreur lors de la récupération de la carte'));
      }
    }
  );

  // Get card redirect info (returns profile slug or setup status)
  fastify.get<{ Params: { serialNumber: string } }>(
    '/redirect/:serialNumber',
    async (request: FastifyRequest<{ Params: { serialNumber: string } }>, reply: FastifyReply) => {
      try {
        const card = await ClientCard.findBySerialNumber(request.params.serialNumber);

        if (!card) {
          return reply.status(404).send(errorResponse('Carte non trouvée'));
        }

        // If card is activated and has a profile, return profile slug
        if (card.status === 'activated' && card.profileId) {
          const profile = await Profile.findById(card.profileId);
          if (profile) {
            return reply.send(
              successResponse({
                isActivated: true,
                profileSlug: profile.slug,
              })
            );
          }
        }

        // Otherwise, return that card needs setup
        return reply.send(
          successResponse({
            isActivated: false,
            serialNumber: card.serialNumber,
          })
        );
      } catch (error) {
        console.error('Erreur redirect card:', error);
        return reply.status(500).send(errorResponse('Erreur serveur'));
      }
    }
  );

  // ============================================
  // AUTHENTICATED ROUTES
  // ============================================

  // Activate card and link to user profile
  fastify.post<{
    Body: {
      serialNumber: string;
      profileId?: string; // Optional: if user wants to link to specific profile
    };
  }>(
    '/activate',
    {
      onRequest: authenticateToken,
    },
    async (
      request: FastifyRequest<{
        Body: {
          serialNumber: string;
          profileId?: string;
        };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const authRequest = request as AuthenticatedRequest;
        const { serialNumber, profileId } = request.body;

        if (!serialNumber) {
          return reply.status(400).send(errorResponse('Le numéro de série est requis'));
        }

        const card = await ClientCard.findBySerialNumber(serialNumber);

        if (!card) {
          return reply.status(404).send(errorResponse('Carte non trouvée'));
        }

        // Check if card is already activated
        if (card.status === 'activated' && card.userId) {
          return reply
            .status(400)
            .send(errorResponse('Cette carte est déjà activée par un autre utilisateur'));
        }

        // If profileId is provided, verify it belongs to the user
        let targetProfileId = profileId;
        if (profileId) {
          const profile = await Profile.findById(profileId);
          if (!profile || profile.userId !== authRequest.user.userId) {
            return reply
              .status(403)
              .send(errorResponse("Ce profil ne vous appartient pas"));
          }
        } else {
          // Find user's default profile
          const profile = await Profile.findByUserId(authRequest.user.userId);
          if (profile) {
            targetProfileId = profile._id.toString();
          }
        }

        // Update card
        card.userId = authRequest.user.userId;
        card.profileId = targetProfileId;
        card.status = 'activated';
        card.activatedAt = new Date();
        await card.save();

        return reply.send(
          successResponse(
            {
              card: {
                serialNumber: card.serialNumber,
                cardType: card.cardType,
                design: card.design,
                status: card.status,
                activatedAt: card.activatedAt,
                profileId: card.profileId,
              },
            },
            'Carte activée avec succès'
          )
        );
      } catch (error) {
        console.error('Erreur activate card:', error);
        return reply.status(500).send(errorResponse("Erreur lors de l'activation de la carte"));
      }
    }
  );

  // Get user's cards
  fastify.get(
    '/my-cards',
    {
      onRequest: authenticateToken,
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const authRequest = request as AuthenticatedRequest;
        const cards = await ClientCard.findByUserId(authRequest.user.userId);

        return reply.send(successResponse(cards));
      } catch (error) {
        console.error('Erreur get my cards:', error);
        return reply.status(500).send(errorResponse('Erreur lors de la récupération des cartes'));
      }
    }
  );

  // ============================================
  // ANALYTICS ROUTES
  // ============================================

  // Record a card scan (PUBLIC - no auth required)
  fastify.post<{
    Body: {
      serialNumber: string;
      userAgent?: string;
      referer?: string;
    };
  }>(
    '/scan',
    async (
      request: FastifyRequest<{
        Body: {
          serialNumber: string;
          userAgent?: string;
          referer?: string;
        };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const { serialNumber, userAgent, referer } = request.body;

        if (!serialNumber) {
          return reply.status(400).send(errorResponse('Le numéro de série est requis'));
        }

        // Find the card
        const card = await ClientCard.findBySerialNumber(serialNumber);

        if (!card) {
          return reply.status(404).send(errorResponse('Carte non trouvée'));
        }

        // Detect device type from user agent
        let device: 'mobile' | 'tablet' | 'desktop' | 'unknown' = 'unknown';
        if (userAgent) {
          if (/mobile/i.test(userAgent)) {
            device = 'mobile';
          } else if (/tablet|ipad/i.test(userAgent)) {
            device = 'tablet';
          } else if (/mozilla/i.test(userAgent)) {
            device = 'desktop';
          }
        }

        // Detect browser
        let browser = 'unknown';
        if (userAgent) {
          if (/chrome/i.test(userAgent)) browser = 'Chrome';
          else if (/safari/i.test(userAgent)) browser = 'Safari';
          else if (/firefox/i.test(userAgent)) browser = 'Firefox';
          else if (/edge/i.test(userAgent)) browser = 'Edge';
        }

        // Get IP address
        const ipAddress = request.headers['x-forwarded-for'] || request.ip;

        // Create scan record
        const scan = new CardScan({
          cardId: card._id.toString(),
          serialNumber: card.serialNumber,
          userId: card.userId,
          scanDate: new Date(),
          ipAddress: typeof ipAddress === 'string' ? ipAddress : ipAddress?.[0],
          userAgent,
          referer,
          device,
          browser,
        });

        await scan.save();

        return reply.send(successResponse({ recorded: true }, 'Scan enregistré'));
      } catch (error) {
        console.error('Erreur record scan:', error);
        return reply.status(500).send(errorResponse('Erreur lors de l\'enregistrement du scan'));
      }
    }
  );

  // Get user's analytics
  fastify.get(
    '/analytics',
    {
      onRequest: authenticateToken,
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const authRequest = request as AuthenticatedRequest;
        const stats = await CardScan.getUserStats(authRequest.user.userId);

        return reply.send(successResponse(stats));
      } catch (error) {
        console.error('Erreur get analytics:', error);
        return reply.status(500).send(errorResponse('Erreur lors de la récupération des analytics'));
      }
    }
  );

  // Get specific card analytics
  fastify.get<{ Params: { cardId: string } }>(
    '/analytics/:cardId',
    {
      onRequest: authenticateToken,
    },
    async (request: FastifyRequest<{ Params: { cardId: string } }>, reply: FastifyReply) => {
      try {
        const authRequest = request as AuthenticatedRequest;
        const card = await ClientCard.findById(request.params.cardId);

        if (!card) {
          return reply.status(404).send(errorResponse('Carte non trouvée'));
        }

        // Verify ownership
        if (card.userId !== authRequest.user.userId) {
          return reply.status(403).send(errorResponse('Accès non autorisé'));
        }

        const stats = await CardScan.getCardStats(request.params.cardId);

        return reply.send(successResponse(stats));
      } catch (error) {
        console.error('Erreur get card analytics:', error);
        return reply.status(500).send(errorResponse('Erreur lors de la récupération des analytics'));
      }
    }
  );
}

