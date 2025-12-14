import { FastifyRequest, FastifyReply } from 'fastify';
import { UserRole } from '../types/index.js';
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
export declare function authenticateToken(request: FastifyRequest, reply: FastifyReply): Promise<void>;
export declare function requireRole(...roles: UserRole[]): (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
export declare const requireAdmin: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
export declare const requireUser: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map