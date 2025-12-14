import { Order, ProductCard, ClientCard, User, Profile, } from '../models/index.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { successResponse, errorResponse } from '../utils/response.js';
export async function adminRoutes(fastify) {
    // Apply authentication and admin check to all routes
    fastify.addHook('onRequest', authenticateToken);
    fastify.addHook('onRequest', requireAdmin);
    // ============================================
    // DASHBOARD STATS
    // ============================================
    fastify.get('/stats', async (request, reply) => {
        try {
            const [pendingOrders, completedOrders, verifiedUsers, lowStockCards] = await Promise.all([
                Order.countDocuments({ status: 'pending' }),
                Order.find({ status: 'completed' }),
                User.countDocuments({ isActive: true }),
                ProductCard.findLowStock(20),
            ]);
            const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
            const stats = {
                pendingOrders,
                totalRevenue,
                activeUsers: verifiedUsers,
                lowStock: lowStockCards.length,
            };
            return reply.send(successResponse(stats));
        }
        catch (error) {
            console.error('Erreur stats:', error);
            return reply.status(500).send(errorResponse('Erreur lors de la récupération des statistiques'));
        }
    });
    // ============================================
    // ORDERS MANAGEMENT
    // ============================================
    // Get all orders
    fastify.get('/orders', async (request, reply) => {
        try {
            const orders = await Order.find().sort({ createdAt: -1 });
            return reply.send(successResponse(orders));
        }
        catch (error) {
            console.error('Erreur orders:', error);
            return reply.status(500).send(errorResponse('Erreur lors de la récupération des commandes'));
        }
    });
    // Get order by ID
    fastify.get('/orders/:id', async (request, reply) => {
        try {
            const order = await Order.findById(request.params.id);
            if (!order) {
                return reply.status(404).send(errorResponse('Commande non trouvée'));
            }
            return reply.send(successResponse(order));
        }
        catch (error) {
            console.error('Erreur order:', error);
            return reply.status(500).send(errorResponse('Erreur lors de la récupération de la commande'));
        }
    });
    // Update order status
    fastify.put('/orders/:id/status', async (request, reply) => {
        try {
            const { status } = request.body;
            const order = await Order.findByIdAndUpdate(request.params.id, { status }, { new: true, runValidators: true });
            if (!order) {
                return reply.status(404).send(errorResponse('Commande non trouvée'));
            }
            return reply.send(successResponse(order));
        }
        catch (error) {
            console.error('Erreur update order:', error);
            return reply.status(500).send(errorResponse('Erreur lors de la mise à jour de la commande'));
        }
    });
    // Delete order
    fastify.delete('/orders/:id', async (request, reply) => {
        try {
            const order = await Order.findByIdAndDelete(request.params.id);
            if (!order) {
                return reply.status(404).send(errorResponse('Commande non trouvée'));
            }
            return reply.send(successResponse({ message: 'Commande supprimée avec succès' }));
        }
        catch (error) {
            console.error('Erreur delete order:', error);
            return reply.status(500).send(errorResponse('Erreur lors de la suppression de la commande'));
        }
    });
    // ============================================
    // PRODUCT CARDS MANAGEMENT
    // ============================================
    // Get all product cards
    fastify.get('/cards', async (request, reply) => {
        try {
            const cards = await ProductCard.find().sort({ createdAt: -1 });
            return reply.send(successResponse(cards));
        }
        catch (error) {
            console.error('Erreur cards:', error);
            return reply.status(500).send(errorResponse('Erreur lors de la récupération des cartes'));
        }
    });
    // Create product card
    fastify.post('/cards', async (request, reply) => {
        try {
            const card = new ProductCard(request.body);
            await card.save();
            return reply.status(201).send(successResponse(card, 'Carte créée avec succès'));
        }
        catch (error) {
            console.error('Erreur create card:', error);
            return reply.status(500).send(errorResponse('Erreur lors de la création de la carte'));
        }
    });
    // Update product card
    fastify.put('/cards/:id', async (request, reply) => {
        try {
            const card = await ProductCard.findByIdAndUpdate(request.params.id, request.body, {
                new: true,
                runValidators: true,
            });
            if (!card) {
                return reply.status(404).send(errorResponse('Carte non trouvée'));
            }
            return reply.send(successResponse(card));
        }
        catch (error) {
            console.error('Erreur update card:', error);
            return reply.status(500).send(errorResponse('Erreur lors de la mise à jour de la carte'));
        }
    });
    // Toggle card active status
    fastify.put('/cards/:id/toggle-active', async (request, reply) => {
        try {
            const card = await ProductCard.findById(request.params.id);
            if (!card) {
                return reply.status(404).send(errorResponse('Carte non trouvée'));
            }
            card.active = !card.active;
            await card.save();
            return reply.send(successResponse(card));
        }
        catch (error) {
            console.error('Erreur toggle card:', error);
            return reply.status(500).send(errorResponse('Erreur lors de la mise à jour de la carte'));
        }
    });
    // Delete product card
    fastify.delete('/cards/:id', async (request, reply) => {
        try {
            const card = await ProductCard.findByIdAndDelete(request.params.id);
            if (!card) {
                return reply.status(404).send(errorResponse('Carte non trouvée'));
            }
            return reply.send(successResponse({ message: 'Carte supprimée avec succès' }));
        }
        catch (error) {
            console.error('Erreur delete card:', error);
            return reply.status(500).send(errorResponse('Erreur lors de la suppression de la carte'));
        }
    });
    // ============================================
    // USERS MANAGEMENT
    // ============================================
    // Get all users
    fastify.get('/users', async (request, reply) => {
        try {
            const users = await User.find()
                .select('-password -resetPasswordToken -resetPasswordExpires')
                .sort({ createdAt: -1 });
            return reply.send(successResponse(users));
        }
        catch (error) {
            console.error('Erreur users:', error);
            return reply.status(500).send(errorResponse('Erreur lors de la récupération des utilisateurs'));
        }
    });
    // Update user role
    fastify.put('/users/:id/role', async (request, reply) => {
        try {
            const { role } = request.body;
            const user = await User.findByIdAndUpdate(request.params.id, { role }, { new: true, select: '-password' });
            if (!user) {
                return reply.status(404).send(errorResponse('Utilisateur non trouvé'));
            }
            return reply.send(successResponse(user));
        }
        catch (error) {
            console.error('Erreur update user role:', error);
            return reply.status(500).send(errorResponse('Erreur lors de la mise à jour du rôle'));
        }
    });
    // Update user
    fastify.put('/users/:id', async (request, reply) => {
        try {
            const user = await User.findByIdAndUpdate(request.params.id, request.body, {
                new: true,
                runValidators: true,
                select: '-password',
            });
            if (!user) {
                return reply.status(404).send(errorResponse('Utilisateur non trouvé'));
            }
            return reply.send(successResponse(user));
        }
        catch (error) {
            console.error('Erreur update user:', error);
            return reply.status(500).send(errorResponse("Erreur lors de la mise à jour de l'utilisateur"));
        }
    });
    // Delete user
    fastify.delete('/users/:id', async (request, reply) => {
        try {
            const user = await User.findByIdAndDelete(request.params.id);
            if (!user) {
                return reply.status(404).send(errorResponse('Utilisateur non trouvé'));
            }
            // Also delete user's profile if exists
            await Profile.deleteOne({ userId: request.params.id });
            return reply.send(successResponse({ message: 'Utilisateur supprimé avec succès' }));
        }
        catch (error) {
            console.error('Erreur delete user:', error);
            return reply.status(500).send(errorResponse("Erreur lors de la suppression de l'utilisateur"));
        }
    });
    // ============================================
    // PROFILES MANAGEMENT
    // ============================================
    // Get all profiles with analytics
    fastify.get('/profiles', async (request, reply) => {
        try {
            const profiles = await Profile.find().sort({ createdAt: -1 });
            // Enrichir avec des métriques (pour l'instant mockées car pas de système d'analytics)
            const enrichedProfiles = profiles.map((profile) => ({
                ...profile.toObject(),
                linksCount: profile.links.length,
                views: Math.floor(Math.random() * 2000), // À remplacer par vraies stats
                clicks: Math.floor(Math.random() * 1000), // À remplacer par vraies stats
            }));
            return reply.send(successResponse(enrichedProfiles));
        }
        catch (error) {
            console.error('Erreur profiles:', error);
            return reply.status(500).send(errorResponse('Erreur lors de la récupération des profils'));
        }
    });
    // Toggle profile public status
    fastify.put('/profiles/:id/toggle-public', async (request, reply) => {
        try {
            const profile = await Profile.findById(request.params.id);
            if (!profile) {
                return reply.status(404).send(errorResponse('Profil non trouvé'));
            }
            profile.isPublic = !profile.isPublic;
            await profile.save();
            return reply.send(successResponse(profile));
        }
        catch (error) {
            console.error('Erreur toggle profile:', error);
            return reply.status(500).send(errorResponse('Erreur lors de la mise à jour du profil'));
        }
    });
    // Update profile
    fastify.put('/profiles/:id', async (request, reply) => {
        try {
            const profile = await Profile.findByIdAndUpdate(request.params.id, request.body, {
                new: true,
                runValidators: true,
            });
            if (!profile) {
                return reply.status(404).send(errorResponse('Profil non trouvé'));
            }
            return reply.send(successResponse(profile));
        }
        catch (error) {
            console.error('Erreur update profile:', error);
            return reply.status(500).send(errorResponse('Erreur lors de la mise à jour du profil'));
        }
    });
    // Delete profile
    fastify.delete('/profiles/:id', async (request, reply) => {
        try {
            const profile = await Profile.findByIdAndDelete(request.params.id);
            if (!profile) {
                return reply.status(404).send(errorResponse('Profil non trouvé'));
            }
            return reply.send(successResponse({ message: 'Profil supprimé avec succès' }));
        }
        catch (error) {
            console.error('Erreur delete profile:', error);
            return reply.status(500).send(errorResponse('Erreur lors de la suppression du profil'));
        }
    });
    // ============================================
    // CLIENT CARDS MANAGEMENT
    // ============================================
    // Get all client cards
    fastify.get('/client-cards', async (request, reply) => {
        try {
            const clientCards = await ClientCard.find().sort({ createdAt: -1 });
            return reply.send(successResponse(clientCards));
        }
        catch (error) {
            console.error('Erreur client cards:', error);
            return reply.status(500).send(errorResponse('Erreur lors de la récupération des cartes clients'));
        }
    });
    // Get client card by ID
    fastify.get('/client-cards/:id', async (request, reply) => {
        try {
            const card = await ClientCard.findById(request.params.id);
            if (!card) {
                return reply.status(404).send(errorResponse('Carte client non trouvée'));
            }
            return reply.send(successResponse(card));
        }
        catch (error) {
            console.error('Erreur get client card:', error);
            return reply.status(500).send(errorResponse('Erreur lors de la récupération de la carte client'));
        }
    });
    // Get client cards by order ID
    fastify.get('/client-cards/order/:orderId', async (request, reply) => {
        try {
            const cards = await ClientCard.findByOrderId(request.params.orderId);
            return reply.send(successResponse(cards));
        }
        catch (error) {
            console.error('Erreur get cards by order:', error);
            return reply.status(500).send(errorResponse('Erreur lors de la récupération des cartes'));
        }
    });
    // Update client card status
    fastify.put('/client-cards/:id/status', async (request, reply) => {
        try {
            const { status } = request.body;
            const updateData = { status };
            // Auto-update dates based on status
            if (status === 'delivered' && request.body.status !== 'delivered') {
                updateData.deliveryDate = new Date();
            }
            if (status === 'activated' && request.body.status !== 'activated') {
                updateData.activatedAt = new Date();
            }
            const card = await ClientCard.findByIdAndUpdate(request.params.id, updateData, {
                new: true,
                runValidators: true,
            });
            if (!card) {
                return reply.status(404).send(errorResponse('Carte client non trouvée'));
            }
            return reply.send(successResponse(card));
        }
        catch (error) {
            console.error('Erreur update client card status:', error);
            return reply.status(500).send(errorResponse('Erreur lors de la mise à jour de la carte client'));
        }
    });
    // Update client card
    fastify.put('/client-cards/:id', async (request, reply) => {
        try {
            const card = await ClientCard.findByIdAndUpdate(request.params.id, request.body, {
                new: true,
                runValidators: true,
            });
            if (!card) {
                return reply.status(404).send(errorResponse('Carte client non trouvée'));
            }
            return reply.send(successResponse(card));
        }
        catch (error) {
            console.error('Erreur update client card:', error);
            return reply.status(500).send(errorResponse('Erreur lors de la mise à jour de la carte client'));
        }
    });
    // Create client card
    fastify.post('/client-cards', async (request, reply) => {
        try {
            const card = new ClientCard(request.body);
            await card.save();
            return reply.status(201).send(successResponse(card, 'Carte client créée avec succès'));
        }
        catch (error) {
            console.error('Erreur create client card:', error);
            return reply.status(500).send(errorResponse('Erreur lors de la création de la carte client'));
        }
    });
    // Delete client card
    fastify.delete('/client-cards/:id', async (request, reply) => {
        try {
            const card = await ClientCard.findByIdAndDelete(request.params.id);
            if (!card) {
                return reply.status(404).send(errorResponse('Carte client non trouvée'));
            }
            return reply.send(successResponse({ message: 'Carte client supprimée avec succès' }));
        }
        catch (error) {
            console.error('Erreur delete client card:', error);
            return reply.status(500).send(errorResponse('Erreur lors de la suppression de la carte client'));
        }
    });
}
//# sourceMappingURL=admin.js.map