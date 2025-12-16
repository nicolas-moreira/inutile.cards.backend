import { Subscription, UserSubscription } from '../models/index.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { successResponse, errorResponse } from '../utils/response.js';
export async function subscriptionsRoutes(fastify) {
    // Public: Get all active subscription plans
    fastify.get('/plans', async (request, reply) => {
        try {
            const subscriptions = await Subscription.find({ active: true }).sort({ priority: -1 });
            return reply.send(successResponse(subscriptions));
        }
        catch (error) {
            console.error('Error fetching subscription plans:', error);
            return reply.status(500).send(errorResponse('Erreur lors de la récupération des plans'));
        }
    });
    // Admin routes
    fastify.addHook('onRequest', authenticateToken);
    fastify.addHook('onRequest', requireAdmin);
    // Get all subscriptions (admin)
    fastify.get('/', async (request, reply) => {
        try {
            const subscriptions = await Subscription.find().sort({ priority: -1, createdAt: -1 });
            // Get subscriber counts for each subscription
            const subscriptionsWithCounts = await Promise.all(subscriptions.map(async (sub) => {
                const activeCount = await UserSubscription.countDocuments({
                    subscriptionId: sub._id,
                    status: 'active',
                });
                const totalCount = await UserSubscription.countDocuments({
                    subscriptionId: sub._id,
                });
                const monthlyRevenue = sub.interval === 'monthly' ? sub.price * activeCount : 0;
                const yearlyRevenue = sub.interval === 'yearly' ? (sub.price * activeCount) / 12 : 0;
                const lifetimeRevenue = sub.interval === 'lifetime' ? sub.price * totalCount : 0;
                return {
                    ...sub.toObject(),
                    activeSubscribers: activeCount,
                    totalSubscribers: totalCount,
                    monthlyRevenue: monthlyRevenue + yearlyRevenue,
                    totalRevenue: sub.price * totalCount,
                };
            }));
            return reply.send(successResponse(subscriptionsWithCounts));
        }
        catch (error) {
            console.error('Error fetching subscriptions:', error);
            return reply.status(500).send(errorResponse('Erreur lors de la récupération des abonnements'));
        }
    });
    // Get subscription by ID
    fastify.get('/:id', async (request, reply) => {
        try {
            const subscription = await Subscription.findById(request.params.id);
            if (!subscription) {
                return reply.status(404).send(errorResponse('Abonnement non trouvé'));
            }
            return reply.send(successResponse(subscription));
        }
        catch (error) {
            console.error('Error fetching subscription:', error);
            return reply.status(500).send(errorResponse("Erreur lors de la récupération de l'abonnement"));
        }
    });
    // Get subscribers for a subscription
    fastify.get('/:id/subscribers', async (request, reply) => {
        try {
            const userSubscriptions = await UserSubscription.find({
                subscriptionId: request.params.id,
            })
                .populate('userId')
                .sort({ createdAt: -1 });
            const subscribers = userSubscriptions.map((sub) => {
                const user = sub.userId;
                return {
                    subscriptionDetails: {
                        id: sub._id,
                        status: sub.status,
                        startDate: sub.startDate,
                        endDate: sub.endDate,
                        autoRenew: sub.autoRenew,
                        lastPaymentDate: sub.lastPaymentDate,
                        nextPaymentDate: sub.nextPaymentDate,
                    },
                    user: {
                        id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        createdAt: user.createdAt,
                    },
                };
            });
            return reply.send(successResponse(subscribers));
        }
        catch (error) {
            console.error('Error fetching subscribers:', error);
            return reply.status(500).send(errorResponse('Erreur lors de la récupération des abonnés'));
        }
    });
    // Create subscription plan
    fastify.post('/', async (request, reply) => {
        try {
            const subscription = new Subscription(request.body);
            await subscription.save();
            return reply.status(201).send(successResponse(subscription, 'Abonnement créé avec succès'));
        }
        catch (error) {
            console.error('Error creating subscription:', error);
            if (error.code === 11000) {
                return reply.status(409).send(errorResponse('Un abonnement avec ce slug existe déjà'));
            }
            return reply.status(500).send(errorResponse("Erreur lors de la création de l'abonnement"));
        }
    });
    // Update subscription plan
    fastify.put('/:id', async (request, reply) => {
        try {
            const subscription = await Subscription.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true });
            if (!subscription) {
                return reply.status(404).send(errorResponse('Abonnement non trouvé'));
            }
            return reply.send(successResponse(subscription, 'Abonnement mis à jour avec succès'));
        }
        catch (error) {
            console.error('Error updating subscription:', error);
            return reply.status(500).send(errorResponse("Erreur lors de la mise à jour de l'abonnement"));
        }
    });
    // Delete subscription plan
    fastify.delete('/:id', async (request, reply) => {
        try {
            // Check if any active users have this subscription
            const activeCount = await UserSubscription.countDocuments({
                subscriptionId: request.params.id,
                status: 'active',
            });
            if (activeCount > 0) {
                return reply.status(400).send(errorResponse(`Impossible de supprimer cet abonnement. ${activeCount} utilisateur(s) actif(s) l'utilisent.`));
            }
            const subscription = await Subscription.findByIdAndDelete(request.params.id);
            if (!subscription) {
                return reply.status(404).send(errorResponse('Abonnement non trouvé'));
            }
            return reply.send(successResponse({ message: 'Abonnement supprimé avec succès' }));
        }
        catch (error) {
            console.error('Error deleting subscription:', error);
            return reply.status(500).send(errorResponse("Erreur lors de la suppression de l'abonnement"));
        }
    });
    // Get all user subscriptions
    fastify.get('/users/all', async (request, reply) => {
        try {
            const userSubscriptions = await UserSubscription.find()
                .populate('userId')
                .populate('subscriptionId')
                .sort({ createdAt: -1 });
            return reply.send(successResponse(userSubscriptions));
        }
        catch (error) {
            console.error('Error fetching user subscriptions:', error);
            return reply.status(500).send(errorResponse('Erreur lors de la récupération des abonnements utilisateurs'));
        }
    });
    // Update user subscription status
    fastify.put('/users/:id', async (request, reply) => {
        try {
            const updateData = { ...request.body };
            if (request.body.status === 'cancelled') {
                updateData.cancelledAt = new Date();
            }
            const userSubscription = await UserSubscription.findByIdAndUpdate(request.params.id, updateData, { new: true }).populate('userId').populate('subscriptionId');
            if (!userSubscription) {
                return reply.status(404).send(errorResponse('Abonnement utilisateur non trouvé'));
            }
            return reply.send(successResponse(userSubscription, 'Abonnement mis à jour avec succès'));
        }
        catch (error) {
            console.error('Error updating user subscription:', error);
            return reply.status(500).send(errorResponse("Erreur lors de la mise à jour de l'abonnement"));
        }
    });
    // Get subscription statistics
    fastify.get('/stats/overview', async (request, reply) => {
        try {
            const totalSubscriptions = await Subscription.countDocuments();
            const activeSubscriptions = await Subscription.countDocuments({ active: true });
            const totalSubscribers = await UserSubscription.countDocuments({ status: 'active' });
            // Calculate MRR (Monthly Recurring Revenue)
            const activeUserSubs = await UserSubscription.find({ status: 'active' }).populate('subscriptionId');
            let mrr = 0;
            let arr = 0;
            activeUserSubs.forEach((userSub) => {
                const sub = userSub.subscriptionId;
                if (sub.interval === 'monthly') {
                    mrr += sub.price;
                }
                else if (sub.interval === 'yearly') {
                    mrr += sub.price / 12;
                }
            });
            arr = mrr * 12;
            // Get subscriptions by plan
            const subscriptionsByPlan = await UserSubscription.aggregate([
                { $match: { status: 'active' } },
                { $group: { _id: '$subscriptionId', count: { $sum: 1 } } },
            ]);
            const stats = {
                totalPlans: totalSubscriptions,
                activePlans: activeSubscriptions,
                totalSubscribers,
                mrr: Math.round(mrr),
                arr: Math.round(arr),
                subscriptionsByPlan,
            };
            return reply.send(successResponse(stats));
        }
        catch (error) {
            console.error('Error fetching subscription stats:', error);
            return reply.status(500).send(errorResponse('Erreur lors de la récupération des statistiques'));
        }
    });
}
//# sourceMappingURL=subscriptions.js.map