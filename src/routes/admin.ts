import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
  Order,
  ProductCard,
  ClientCard,
  User,
  Profile,
} from '../models/index.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { OrderStatus, ClientCardStatus, IAdminStats } from '../types/index.js';

export async function adminRoutes(fastify: FastifyInstance) {
  // Apply authentication and admin check to all routes
  fastify.addHook('onRequest', authenticateToken);
  fastify.addHook('onRequest', requireAdmin);

  // ============================================
  // DASHBOARD STATS
  // ============================================
  fastify.get('/stats', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const [pendingOrders, completedOrders, verifiedUsers, lowStockCards] = await Promise.all([
        Order.countDocuments({ status: 'pending' }),
        Order.find({ status: 'completed' }),
        User.countDocuments({ isActive: true }),
        ProductCard.findLowStock(20),
      ]);

      const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);

      const stats: IAdminStats = {
        pendingOrders,
        totalRevenue,
        activeUsers: verifiedUsers,
        lowStock: lowStockCards.length,
      };

      return successResponse(reply, stats);
    } catch (error) {
      return errorResponse(reply, 'Erreur lors de la récupération des statistiques', error);
    }
  });

  // ============================================
  // ORDERS MANAGEMENT
  // ============================================

  // Get all orders
  fastify.get('/orders', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const orders = await Order.find().sort({ createdAt: -1 });
      return successResponse(reply, orders);
    } catch (error) {
      return errorResponse(reply, 'Erreur lors de la récupération des commandes', error);
    }
  });

  // Get order by ID
  fastify.get<{ Params: { id: string } }>(
    '/orders/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const order = await Order.findById(request.params.id);
        if (!order) {
          return errorResponse(reply, 'Commande non trouvée', null, 404);
        }
        return successResponse(reply, order);
      } catch (error) {
        return errorResponse(reply, 'Erreur lors de la récupération de la commande', error);
      }
    }
  );

  // Update order status
  fastify.put<{ Params: { id: string }; Body: { status: OrderStatus } }>(
    '/orders/:id/status',
    async (
      request: FastifyRequest<{ Params: { id: string }; Body: { status: OrderStatus } }>,
      reply: FastifyReply
    ) => {
      try {
        const { status } = request.body;
        const order = await Order.findByIdAndUpdate(
          request.params.id,
          { status },
          { new: true, runValidators: true }
        );

        if (!order) {
          return errorResponse(reply, 'Commande non trouvée', null, 404);
        }

        return successResponse(reply, order);
      } catch (error) {
        return errorResponse(reply, 'Erreur lors de la mise à jour de la commande', error);
      }
    }
  );

  // Delete order
  fastify.delete<{ Params: { id: string } }>(
    '/orders/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const order = await Order.findByIdAndDelete(request.params.id);
        if (!order) {
          return errorResponse(reply, 'Commande non trouvée', null, 404);
        }
        return successResponse(reply, { message: 'Commande supprimée avec succès' });
      } catch (error) {
        return errorResponse(reply, 'Erreur lors de la suppression de la commande', error);
      }
    }
  );

  // ============================================
  // PRODUCT CARDS MANAGEMENT
  // ============================================

  // Get all product cards
  fastify.get('/cards', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const cards = await ProductCard.find().sort({ createdAt: -1 });
      return successResponse(reply, cards);
    } catch (error) {
      return errorResponse(reply, 'Erreur lors de la récupération des cartes', error);
    }
  });

  // Create product card
  fastify.post<{
    Body: {
      name: string;
      type: string;
      price: number;
      stock: number;
      image?: string;
      description?: string;
      active?: boolean;
    };
  }>(
    '/cards',
    async (
      request: FastifyRequest<{
        Body: {
          name: string;
          type: string;
          price: number;
          stock: number;
          image?: string;
          description?: string;
          active?: boolean;
        };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const card = new ProductCard(request.body);
        await card.save();
        return successResponse(reply, card, 'Carte créée avec succès', 201);
      } catch (error) {
        return errorResponse(reply, 'Erreur lors de la création de la carte', error);
      }
    }
  );

  // Update product card
  fastify.put<{
    Params: { id: string };
    Body: Partial<{
      name: string;
      type: string;
      price: number;
      stock: number;
      image: string;
      description: string;
      active: boolean;
    }>;
  }>(
    '/cards/:id',
    async (
      request: FastifyRequest<{
        Params: { id: string };
        Body: Partial<{
          name: string;
          type: string;
          price: number;
          stock: number;
          image: string;
          description: string;
          active: boolean;
        }>;
      }>,
      reply: FastifyReply
    ) => {
      try {
        const card = await ProductCard.findByIdAndUpdate(request.params.id, request.body, {
          new: true,
          runValidators: true,
        });

        if (!card) {
          return errorResponse(reply, 'Carte non trouvée', null, 404);
        }

        return successResponse(reply, card);
      } catch (error) {
        return errorResponse(reply, 'Erreur lors de la mise à jour de la carte', error);
      }
    }
  );

  // Toggle card active status
  fastify.put<{ Params: { id: string } }>(
    '/cards/:id/toggle-active',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const card = await ProductCard.findById(request.params.id);
        if (!card) {
          return errorResponse(reply, 'Carte non trouvée', null, 404);
        }

        card.active = !card.active;
        await card.save();

        return successResponse(reply, card);
      } catch (error) {
        return errorResponse(reply, 'Erreur lors de la mise à jour de la carte', error);
      }
    }
  );

  // Delete product card
  fastify.delete<{ Params: { id: string } }>(
    '/cards/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const card = await ProductCard.findByIdAndDelete(request.params.id);
        if (!card) {
          return errorResponse(reply, 'Carte non trouvée', null, 404);
        }
        return successResponse(reply, { message: 'Carte supprimée avec succès' });
      } catch (error) {
        return errorResponse(reply, 'Erreur lors de la suppression de la carte', error);
      }
    }
  );

  // ============================================
  // USERS MANAGEMENT
  // ============================================

  // Get all users
  fastify.get('/users', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const users = await User.find()
        .select('-password -resetPasswordToken -resetPasswordExpires')
        .sort({ createdAt: -1 });
      return successResponse(reply, users);
    } catch (error) {
      return errorResponse(reply, 'Erreur lors de la récupération des utilisateurs', error);
    }
  });

  // Update user role
  fastify.put<{ Params: { id: string }; Body: { role: 'user' | 'admin' } }>(
    '/users/:id/role',
    async (
      request: FastifyRequest<{ Params: { id: string }; Body: { role: 'user' | 'admin' } }>,
      reply: FastifyReply
    ) => {
      try {
        const { role } = request.body;
        const user = await User.findByIdAndUpdate(
          request.params.id,
          { role },
          { new: true, select: '-password' }
        );

        if (!user) {
          return errorResponse(reply, 'Utilisateur non trouvé', null, 404);
        }

        return successResponse(reply, user);
      } catch (error) {
        return errorResponse(reply, 'Erreur lors de la mise à jour du rôle', error);
      }
    }
  );

  // Update user
  fastify.put<{
    Params: { id: string };
    Body: Partial<{
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      isActive: boolean;
    }>;
  }>(
    '/users/:id',
    async (
      request: FastifyRequest<{
        Params: { id: string };
        Body: Partial<{
          firstName: string;
          lastName: string;
          email: string;
          phone: string;
          isActive: boolean;
        }>;
      }>,
      reply: FastifyReply
    ) => {
      try {
        const user = await User.findByIdAndUpdate(request.params.id, request.body, {
          new: true,
          runValidators: true,
          select: '-password',
        });

        if (!user) {
          return errorResponse(reply, 'Utilisateur non trouvé', null, 404);
        }

        return successResponse(reply, user);
      } catch (error) {
        return errorResponse(reply, "Erreur lors de la mise à jour de l'utilisateur", error);
      }
    }
  );

  // Delete user
  fastify.delete<{ Params: { id: string } }>(
    '/users/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const user = await User.findByIdAndDelete(request.params.id);
        if (!user) {
          return errorResponse(reply, 'Utilisateur non trouvé', null, 404);
        }

        // Also delete user's profile if exists
        await Profile.deleteOne({ userId: request.params.id });

        return successResponse(reply, { message: 'Utilisateur supprimé avec succès' });
      } catch (error) {
        return errorResponse(reply, "Erreur lors de la suppression de l'utilisateur", error);
      }
    }
  );

  // ============================================
  // PROFILES MANAGEMENT
  // ============================================

  // Get all profiles with analytics
  fastify.get('/profiles', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const profiles = await Profile.find().sort({ createdAt: -1 });

      // Enrichir avec des métriques (pour l'instant mockées car pas de système d'analytics)
      const enrichedProfiles = profiles.map((profile) => ({
        ...profile.toObject(),
        linksCount: profile.links.length,
        views: Math.floor(Math.random() * 2000), // À remplacer par vraies stats
        clicks: Math.floor(Math.random() * 1000), // À remplacer par vraies stats
      }));

      return successResponse(reply, enrichedProfiles);
    } catch (error) {
      return errorResponse(reply, 'Erreur lors de la récupération des profils', error);
    }
  });

  // Toggle profile public status
  fastify.put<{ Params: { id: string } }>(
    '/profiles/:id/toggle-public',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const profile = await Profile.findById(request.params.id);
        if (!profile) {
          return errorResponse(reply, 'Profil non trouvé', null, 404);
        }

        profile.isPublic = !profile.isPublic;
        await profile.save();

        return successResponse(reply, profile);
      } catch (error) {
        return errorResponse(reply, 'Erreur lors de la mise à jour du profil', error);
      }
    }
  );

  // Update profile
  fastify.put<{
    Params: { id: string };
    Body: Partial<{
      displayName: string;
      bio: string;
      avatarUrl: string;
      isPublic: boolean;
    }>;
  }>(
    '/profiles/:id',
    async (
      request: FastifyRequest<{
        Params: { id: string };
        Body: Partial<{
          displayName: string;
          bio: string;
          avatarUrl: string;
          isPublic: boolean;
        }>;
      }>,
      reply: FastifyReply
    ) => {
      try {
        const profile = await Profile.findByIdAndUpdate(request.params.id, request.body, {
          new: true,
          runValidators: true,
        });

        if (!profile) {
          return errorResponse(reply, 'Profil non trouvé', null, 404);
        }

        return successResponse(reply, profile);
      } catch (error) {
        return errorResponse(reply, 'Erreur lors de la mise à jour du profil', error);
      }
    }
  );

  // Delete profile
  fastify.delete<{ Params: { id: string } }>(
    '/profiles/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const profile = await Profile.findByIdAndDelete(request.params.id);
        if (!profile) {
          return errorResponse(reply, 'Profil non trouvé', null, 404);
        }
        return successResponse(reply, { message: 'Profil supprimé avec succès' });
      } catch (error) {
        return errorResponse(reply, 'Erreur lors de la suppression du profil', error);
      }
    }
  );

  // ============================================
  // CLIENT CARDS MANAGEMENT
  // ============================================

  // Get all client cards
  fastify.get('/client-cards', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const clientCards = await ClientCard.find().sort({ createdAt: -1 });
      return successResponse(reply, clientCards);
    } catch (error) {
      return errorResponse(reply, 'Erreur lors de la récupération des cartes clients', error);
    }
  });

  // Get client card by ID
  fastify.get<{ Params: { id: string } }>(
    '/client-cards/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const card = await ClientCard.findById(request.params.id);
        if (!card) {
          return errorResponse(reply, 'Carte client non trouvée', null, 404);
        }
        return successResponse(reply, card);
      } catch (error) {
        return errorResponse(reply, 'Erreur lors de la récupération de la carte client', error);
      }
    }
  );

  // Get client cards by order ID
  fastify.get<{ Params: { orderId: string } }>(
    '/client-cards/order/:orderId',
    async (request: FastifyRequest<{ Params: { orderId: string } }>, reply: FastifyReply) => {
      try {
        const cards = await ClientCard.findByOrderId(request.params.orderId);
        return successResponse(reply, cards);
      } catch (error) {
        return errorResponse(reply, 'Erreur lors de la récupération des cartes', error);
      }
    }
  );

  // Update client card status
  fastify.put<{ Params: { id: string }; Body: { status: ClientCardStatus } }>(
    '/client-cards/:id/status',
    async (
      request: FastifyRequest<{ Params: { id: string }; Body: { status: ClientCardStatus } }>,
      reply: FastifyReply
    ) => {
      try {
        const { status } = request.body;
        const updateData: any = { status };

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
          return errorResponse(reply, 'Carte client non trouvée', null, 404);
        }

        return successResponse(reply, card);
      } catch (error) {
        return errorResponse(reply, 'Erreur lors de la mise à jour de la carte client', error);
      }
    }
  );

  // Update client card
  fastify.put<{
    Params: { id: string };
    Body: Partial<{
      trackingNumber: string;
      shippingAddress: string;
      status: ClientCardStatus;
    }>;
  }>(
    '/client-cards/:id',
    async (
      request: FastifyRequest<{
        Params: { id: string };
        Body: Partial<{
          trackingNumber: string;
          shippingAddress: string;
          status: ClientCardStatus;
        }>;
      }>,
      reply: FastifyReply
    ) => {
      try {
        const card = await ClientCard.findByIdAndUpdate(request.params.id, request.body, {
          new: true,
          runValidators: true,
        });

        if (!card) {
          return errorResponse(reply, 'Carte client non trouvée', null, 404);
        }

        return successResponse(reply, card);
      } catch (error) {
        return errorResponse(reply, 'Erreur lors de la mise à jour de la carte client', error);
      }
    }
  );

  // Create client card
  fastify.post<{
    Body: {
      serialNumber: string;
      orderId: string;
      customerName: string;
      email: string;
      cardType: string;
      design: string;
      shippingAddress?: string;
      orderDate: Date;
    };
  }>(
    '/client-cards',
    async (
      request: FastifyRequest<{
        Body: {
          serialNumber: string;
          orderId: string;
          customerName: string;
          email: string;
          cardType: string;
          design: string;
          shippingAddress?: string;
          orderDate: Date;
        };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const card = new ClientCard(request.body);
        await card.save();
        return successResponse(reply, card, 'Carte client créée avec succès', 201);
      } catch (error) {
        return errorResponse(reply, 'Erreur lors de la création de la carte client', error);
      }
    }
  );

  // Delete client card
  fastify.delete<{ Params: { id: string } }>(
    '/client-cards/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const card = await ClientCard.findByIdAndDelete(request.params.id);
        if (!card) {
          return errorResponse(reply, 'Carte client non trouvée', null, 404);
        }
        return successResponse(reply, { message: 'Carte client supprimée avec succès' });
      } catch (error) {
        return errorResponse(reply, 'Erreur lors de la suppression de la carte client', error);
      }
    }
  );
}





