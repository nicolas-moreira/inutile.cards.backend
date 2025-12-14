import { FastifyRequest, FastifyReply } from 'fastify';
import { UserRole } from '../types/index.js';

// Extend the @fastify/jwt module to use our custom JWT payload type
declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      userId: string;
      email: string;
      role: UserRole;
      iat?: number;
      exp?: number;
    };
  }
}

export async function authenticateToken(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: 'Token invalide ou expiré' });
  }
}

export function requireRole(...roles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = request.user;
    
    if (!user) {
      reply.status(401).send({ error: 'Non authentifié' });
      return;
    }
    
    if (!roles.includes(user.role)) {
      reply.status(403).send({ error: 'Accès non autorisé' });
      return;
    }
  };
}

export const requireAdmin = requireRole('admin');
export const requireUser = requireRole('user', 'admin');



