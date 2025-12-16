import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { config } from './config/env.js';
import { connectDatabase } from './config/database.js';
import {
  authRoutes,
  profileRoutes,
  templateRoutes,
  financeRoutes,
  userRoutes,
  adminRoutes,
  cardsRoutes,
  analyticsRoutes,
  subscriptionsRoutes,
  companiesRoutes,
} from './routes/index.js';

const fastify = Fastify({
  logger: {
    level: config.server.nodeEnv === 'development' ? 'info' : 'warn',
  },
});

// Register plugins
async function registerPlugins() {
  // CORS - permissif en dev
  await fastify.register(cors, {
    origin: true, // Autorise toutes les origines en dev
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // JWT
  await fastify.register(jwt, {
    secret: config.jwt.secret,
    sign: {
      expiresIn: config.jwt.expiresIn,
    },
  });

  // Swagger documentation
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'Inutile Cards API',
        description: 'API pour la gestion des profils et cartes Inutile Cards',
        version: '1.0.0',
      },
      servers: [
        {
          url: `http://localhost:${config.server.port}`,
          description: 'Development server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
  });
}

// Register routes
async function registerRoutes() {
  // Health check
  fastify.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }));

  // API routes
  await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(profileRoutes, { prefix: '/api/profiles' });
  await fastify.register(templateRoutes, { prefix: '/api/templates' });
  await fastify.register(financeRoutes, { prefix: '/api/finances' });
  await fastify.register(userRoutes, { prefix: '/api/users' });
  await fastify.register(adminRoutes, { prefix: '/api/admin' });
  await fastify.register(cardsRoutes, { prefix: '/api/cards' });
  await fastify.register(analyticsRoutes, { prefix: '/api/analytics' });
  await fastify.register(subscriptionsRoutes, { prefix: '/api/subscriptions' });
  await fastify.register(companiesRoutes, { prefix: '/api/companies' });
}

// Start server
async function start() {
  try {
    // Connect to database
    await connectDatabase();

    // Register plugins and routes
    await registerPlugins();
    await registerRoutes();

    // Start listening
    await fastify.listen({
      port: config.server.port,
      host: config.server.host,
    });

    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🚀 Inutile Cards API is running!                          ║
║                                                              ║
║   API:  http://localhost:${config.server.port}                              ║
║   Docs: http://localhost:${config.server.port}/docs                         ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    `);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

// Handle graceful shutdown
const signals = ['SIGINT', 'SIGTERM'];
signals.forEach((signal) => {
  process.on(signal, async () => {
    console.log(`\n${signal} received, shutting down gracefully...`);
    await fastify.close();
    process.exit(0);
  });
});

start();

