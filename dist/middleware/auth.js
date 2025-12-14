export async function authenticateToken(request, reply) {
    try {
        await request.jwtVerify();
    }
    catch (err) {
        reply.status(401).send({ error: 'Token invalide ou expiré' });
    }
}
export function requireRole(...roles) {
    return async (request, reply) => {
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
//# sourceMappingURL=auth.js.map