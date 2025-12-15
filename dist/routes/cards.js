import { ClientCard, Profile } from '../models/index.js';
import { authenticateToken } from '../middleware/auth.js';
import { successResponse, errorResponse } from '../utils/response.js';
export async function cardsRoutes(fastify) {
    // ============================================
    // PUBLIC ROUTES - No authentication required
    // ============================================
    // Get card info by serial number (for setup page)
    fastify.get('/setup/:serialNumber', async (request, reply) => {
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
        }
        catch (error) {
            console.error('Erreur get card setup:', error);
            return reply.status(500).send(errorResponse('Erreur lors de la récupération de la carte'));
        }
    });
    // Get card redirect info (returns profile slug or setup status)
    fastify.get('/redirect/:serialNumber', async (request, reply) => {
        try {
            const card = await ClientCard.findBySerialNumber(request.params.serialNumber);
            if (!card) {
                return reply.status(404).send(errorResponse('Carte non trouvée'));
            }
            // If card is activated and has a profile, return profile slug
            if (card.status === 'activated' && card.profileId) {
                const profile = await Profile.findById(card.profileId);
                if (profile) {
                    return reply.send(successResponse({
                        isActivated: true,
                        profileSlug: profile.slug,
                    }));
                }
            }
            // Otherwise, return that card needs setup
            return reply.send(successResponse({
                isActivated: false,
                serialNumber: card.serialNumber,
            }));
        }
        catch (error) {
            console.error('Erreur redirect card:', error);
            return reply.status(500).send(errorResponse('Erreur serveur'));
        }
    });
    // ============================================
    // AUTHENTICATED ROUTES
    // ============================================
    // Activate card and link to user profile
    fastify.post('/activate', {
        onRequest: authenticateToken,
    }, async (request, reply) => {
        try {
            const authRequest = request;
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
            }
            else {
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
            return reply.send(successResponse({
                card: {
                    serialNumber: card.serialNumber,
                    cardType: card.cardType,
                    design: card.design,
                    status: card.status,
                    activatedAt: card.activatedAt,
                    profileId: card.profileId,
                },
            }, 'Carte activée avec succès'));
        }
        catch (error) {
            console.error('Erreur activate card:', error);
            return reply.status(500).send(errorResponse("Erreur lors de l'activation de la carte"));
        }
    });
    // Get user's cards
    fastify.get('/my-cards', {
        onRequest: authenticateToken,
    }, async (request, reply) => {
        try {
            const authRequest = request;
            const cards = await ClientCard.findByUserId(authRequest.user.userId);
            return reply.send(successResponse(cards));
        }
        catch (error) {
            console.error('Erreur get my cards:', error);
            return reply.status(500).send(errorResponse('Erreur lors de la récupération des cartes'));
        }
    });
}
//# sourceMappingURL=cards.js.map