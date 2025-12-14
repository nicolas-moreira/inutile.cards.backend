import { FastifyRequest, FastifyReply } from 'fastify';
import { JWTPayload, UserRole } from '../types/index.js';

declare module 'fastify' {
  interface FastifyRequest {
    user?: JWTPayload;
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
    const user = request.user as JWTPayload | undefined;
    
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



