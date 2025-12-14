import dotenv from 'dotenv';
dotenv.config();
export const config = {
    server: {
        port: parseInt(process.env.PORT || '8080', 10),
        host: process.env.HOST || '0.0.0.0',
        nodeEnv: process.env.NODE_ENV || 'development',
    },
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/inutilecards',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'dev-secret-change-in-production-inutilecards-2024',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    cors: {
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    },
    email: {
        smtpHost: process.env.SMTP_HOST || '',
        smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
        smtpUser: process.env.SMTP_USER || '',
        smtpPass: process.env.SMTP_PASS || '',
        from: process.env.EMAIL_FROM || 'noreply@inutile.cards',
    },
};
//# sourceMappingURL=env.js.map