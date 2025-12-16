import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { Company, User, ClientCard, Profile } from '../models/index.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { successResponse, errorResponse } from '../utils/response.js';

export async function companiesRoutes(fastify: FastifyInstance) {
  // Admin only - all routes require authentication and admin role
  fastify.addHook('onRequest', authenticateToken);
  fastify.addHook('onRequest', requireAdmin);

  // Get all companies
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const companies = await Company.find()
        .populate('adminUserId', 'firstName lastName email')
        .sort({ createdAt: -1 });

      // Enrich with employee and card counts
      const enrichedCompanies = await Promise.all(
        companies.map(async (company) => {
          const employeeCount = await User.countDocuments({ 
            companyId: company._id,
            role: 'user' 
          });
          const cardCount = await ClientCard.countDocuments({
            userId: { $in: await User.find({ companyId: company._id }).distinct('_id') }
          });

          return {
            ...company.toObject(),
            employeeCount,
            cardCount,
          };
        })
      );

      return reply.send(successResponse(enrichedCompanies));
    } catch (error) {
      console.error('Error fetching companies:', error);
      return reply.status(500).send(errorResponse('Erreur lors de la récupération des sociétés'));
    }
  });

  // Get company by ID
  fastify.get<{ Params: { id: string } }>(
    '/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const company = await Company.findById(request.params.id)
          .populate('adminUserId', 'firstName lastName email phone');
        
        if (!company) {
          return reply.status(404).send(errorResponse('Société non trouvée'));
        }

        return reply.send(successResponse(company));
      } catch (error) {
        console.error('Error fetching company:', error);
        return reply.status(500).send(errorResponse('Erreur lors de la récupération de la société'));
      }
    }
  );

  // Get company employees
  fastify.get<{ Params: { id: string } }>(
    '/:id/employees',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const employees = await User.find({ 
          companyId: request.params.id 
        })
          .select('-password -resetPasswordToken -resetPasswordExpires')
          .sort({ createdAt: -1 });

        // Enrich with cards and profiles
        const enrichedEmployees = await Promise.all(
          employees.map(async (employee) => {
            const cards = await ClientCard.find({ userId: employee._id });
            const profile = await Profile.findOne({ userId: employee._id });
            
            return {
              ...employee.toObject(),
              cards,
              profile,
              cardCount: cards.length,
              hasProfile: !!profile,
            };
          })
        );

        return reply.send(successResponse(enrichedEmployees));
      } catch (error) {
        console.error('Error fetching employees:', error);
        return reply.status(500).send(errorResponse('Erreur lors de la récupération des employés'));
      }
    }
  );

  // Get company cards
  fastify.get<{ Params: { id: string } }>(
    '/:id/cards',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const employeeIds = await User.find({ 
          companyId: request.params.id 
        }).distinct('_id');

        const cards = await ClientCard.find({
          userId: { $in: employeeIds }
        })
          .populate('userId', 'firstName lastName email')
          .sort({ createdAt: -1 });

        return reply.send(successResponse(cards));
      } catch (error) {
        console.error('Error fetching company cards:', error);
        return reply.status(500).send(errorResponse('Erreur lors de la récupération des cartes'));
      }
    }
  );

  // Create company
  fastify.post<{
    Body: {
      name: string;
      slug: string;
      logo?: string;
      description?: string;
      industry?: string;
      website?: string;
      email: string;
      phone?: string;
      address?: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        postalCode?: string;
      };
      adminUserId: string;
      maxEmployees?: number;
      maxCards?: number;
      status?: 'active' | 'suspended' | 'inactive';
    };
  }>(
    '/',
    async (
      request: FastifyRequest<{
        Body: {
          name: string;
          slug: string;
          logo?: string;
          description?: string;
          industry?: string;
          website?: string;
          email: string;
          phone?: string;
          address?: {
            street?: string;
            city?: string;
            state?: string;
            country?: string;
            postalCode?: string;
          };
          adminUserId: string;
          maxEmployees?: number;
          maxCards?: number;
          status?: 'active' | 'suspended' | 'inactive';
        };
      }>,
      reply: FastifyReply
    ) => {
      try {
        // Check if admin user exists
        const adminUser = await User.findById(request.body.adminUserId);
        if (!adminUser) {
          return reply.status(404).send(errorResponse('Utilisateur administrateur non trouvé'));
        }

        const company = new Company(request.body);
        await company.save();

        // Update admin user with companyId
        adminUser.companyId = company._id;
        await adminUser.save();

        return reply.status(201).send(successResponse(company, 'Société créée avec succès'));
      } catch (error: any) {
        console.error('Error creating company:', error);
        if (error.code === 11000) {
          return reply.status(409).send(errorResponse('Une société avec ce slug existe déjà'));
        }
        return reply.status(500).send(errorResponse('Erreur lors de la création de la société'));
      }
    }
  );

  // Update company
  fastify.put<{
    Params: { id: string };
    Body: Partial<{
      name: string;
      logo: string;
      description: string;
      industry: string;
      website: string;
      email: string;
      phone: string;
      address: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        postalCode?: string;
      };
      maxEmployees: number;
      maxCards: number;
      status: 'active' | 'suspended' | 'inactive';
      notes: string;
    }>;
  }>(
    '/:id',
    async (
      request: FastifyRequest<{
        Params: { id: string };
        Body: Partial<{
          name: string;
          logo: string;
          description: string;
          industry: string;
          website: string;
          email: string;
          phone: string;
          address: {
            street?: string;
            city?: string;
            state?: string;
            country?: string;
            postalCode?: string;
          };
          maxEmployees: number;
          maxCards: number;
          status: 'active' | 'suspended' | 'inactive';
          notes: string;
        }>;
      }>,
      reply: FastifyReply
    ) => {
      try {
        const company = await Company.findByIdAndUpdate(
          request.params.id,
          request.body,
          { new: true, runValidators: true }
        );

        if (!company) {
          return reply.status(404).send(errorResponse('Société non trouvée'));
        }

        return reply.send(successResponse(company, 'Société mise à jour avec succès'));
      } catch (error) {
        console.error('Error updating company:', error);
        return reply.status(500).send(errorResponse('Erreur lors de la mise à jour de la société'));
      }
    }
  );

  // Delete company
  fastify.delete<{ Params: { id: string } }>(
    '/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        // Check if company has employees
        const employeeCount = await User.countDocuments({ companyId: request.params.id });
        if (employeeCount > 0) {
          return reply.status(400).send(
            errorResponse(`Impossible de supprimer cette société. ${employeeCount} employé(s) y sont rattaché(s).`)
          );
        }

        const company = await Company.findByIdAndDelete(request.params.id);
        if (!company) {
          return reply.status(404).send(errorResponse('Société non trouvée'));
        }

        return reply.send(successResponse({ message: 'Société supprimée avec succès' }));
      } catch (error) {
        console.error('Error deleting company:', error);
        return reply.status(500).send(errorResponse('Erreur lors de la suppression de la société'));
      }
    }
  );

  // Add employee to company
  fastify.post<{
    Params: { id: string };
    Body: {
      userId?: string; // Existing user
      // Or create new user
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      password?: string;
    };
  }>(
    '/:id/employees',
    async (
      request: FastifyRequest<{
        Params: { id: string };
        Body: {
          userId?: string;
          firstName?: string;
          lastName?: string;
          email?: string;
          phone?: string;
          password?: string;
        };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const company = await Company.findById(request.params.id);
        if (!company) {
          return reply.status(404).send(errorResponse('Société non trouvée'));
        }

        let user;
        
        if (request.body.userId) {
          // Add existing user to company
          user = await User.findById(request.body.userId);
          if (!user) {
            return reply.status(404).send(errorResponse('Utilisateur non trouvé'));
          }
          
          if (user.companyId) {
            return reply.status(400).send(errorResponse('Cet utilisateur appartient déjà à une société'));
          }

          user.companyId = company._id;
          await user.save();
        } else {
          // Create new employee
          if (!request.body.email || !request.body.firstName || !request.body.lastName) {
            return reply.status(400).send(errorResponse('Email, prénom et nom sont requis'));
          }

          // Check if employee count limit is reached
          const currentEmployeeCount = await User.countDocuments({ companyId: company._id });
          if (company.maxEmployees && currentEmployeeCount >= company.maxEmployees) {
            return reply.status(400).send(
              errorResponse(`Limite d'employés atteinte (${company.maxEmployees})`)
            );
          }

          user = new User({
            ...request.body,
            companyId: company._id,
            role: 'user',
            isActive: true,
          });
          await user.save();
        }

        return reply.status(201).send(
          successResponse(
            { ...user.toObject(), password: undefined },
            'Employé ajouté avec succès'
          )
        );
      } catch (error: any) {
        console.error('Error adding employee:', error);
        if (error.code === 11000) {
          return reply.status(409).send(errorResponse('Un utilisateur avec cet email existe déjà'));
        }
        return reply.status(500).send(errorResponse("Erreur lors de l'ajout de l'employé"));
      }
    }
  );

  // Remove employee from company
  fastify.delete<{ Params: { id: string; userId: string } }>(
    '/:id/employees/:userId',
    async (
      request: FastifyRequest<{ Params: { id: string; userId: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const user = await User.findById(request.params.userId);
        if (!user) {
          return reply.status(404).send(errorResponse('Employé non trouvé'));
        }

        if (user.companyId !== request.params.id) {
          return reply.status(400).send(errorResponse("Cet employé n'appartient pas à cette société"));
        }

        user.companyId = undefined;
        await user.save();

        return reply.send(successResponse({ message: 'Employé retiré de la société avec succès' }));
      } catch (error) {
        console.error('Error removing employee:', error);
        return reply.status(500).send(errorResponse("Erreur lors du retrait de l'employé"));
      }
    }
  );

  // Assign card to employee
  fastify.post<{
    Params: { id: string; userId: string };
    Body: { cardId: string };
  }>(
    '/:id/employees/:userId/assign-card',
    async (
      request: FastifyRequest<{
        Params: { id: string; userId: string };
        Body: { cardId: string };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const card = await ClientCard.findById(request.body.cardId);
        if (!card) {
          return reply.status(404).send(errorResponse('Carte non trouvée'));
        }

        if (card.userId) {
          return reply.status(400).send(errorResponse('Cette carte est déjà attribuée'));
        }

        const user = await User.findById(request.params.userId);
        if (!user || user.companyId !== request.params.id) {
          return reply.status(404).send(errorResponse('Employé non trouvé'));
        }

        card.userId = user._id;
        card.status = 'shipped'; // or 'activated' depending on your workflow
        await card.save();

        return reply.send(successResponse(card, 'Carte attribuée avec succès'));
      } catch (error) {
        console.error('Error assigning card:', error);
        return reply.status(500).send(errorResponse("Erreur lors de l'attribution de la carte"));
      }
    }
  );

  // Unassign card from employee
  fastify.post<{
    Params: { id: string; userId: string; cardId: string };
  }>(
    '/:id/employees/:userId/unassign-card/:cardId',
    async (
      request: FastifyRequest<{
        Params: { id: string; userId: string; cardId: string };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const card = await ClientCard.findById(request.params.cardId);
        if (!card) {
          return reply.status(404).send(errorResponse('Carte non trouvée'));
        }

        if (card.userId !== request.params.userId) {
          return reply.status(400).send(errorResponse("Cette carte n'est pas attribuée à cet employé"));
        }

        card.userId = undefined;
        card.profileId = undefined;
        card.status = 'pending';
        await card.save();

        return reply.send(successResponse(card, 'Carte retirée avec succès'));
      } catch (error) {
        console.error('Error unassigning card:', error);
        return reply.status(500).send(errorResponse('Erreur lors du retrait de la carte'));
      }
    }
  );

  // Get company statistics
  fastify.get<{ Params: { id: string } }>(
    '/:id/stats',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const company = await Company.findById(request.params.id);
        if (!company) {
          return reply.status(404).send(errorResponse('Société non trouvée'));
        }

        const employeeIds = await User.find({ companyId: company._id }).distinct('_id');
        
        const [
          totalEmployees,
          activeEmployees,
          totalCards,
          activeCards,
          totalProfiles,
        ] = await Promise.all([
          User.countDocuments({ companyId: company._id }),
          User.countDocuments({ companyId: company._id, isActive: true }),
          ClientCard.countDocuments({ userId: { $in: employeeIds } }),
          ClientCard.countDocuments({ 
            userId: { $in: employeeIds },
            status: 'activated'
          }),
          Profile.countDocuments({ userId: { $in: employeeIds } }),
        ]);

        const stats = {
          totalEmployees,
          activeEmployees,
          totalCards,
          activeCards,
          totalProfiles,
          availableSlots: {
            employees: company.maxEmployees ? company.maxEmployees - totalEmployees : null,
            cards: company.maxCards ? company.maxCards - totalCards : null,
          },
        };

        return reply.send(successResponse(stats));
      } catch (error) {
        console.error('Error fetching company stats:', error);
        return reply.status(500).send(errorResponse('Erreur lors de la récupération des statistiques'));
      }
    }
  );
}

