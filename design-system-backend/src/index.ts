import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

// Load environment variables
dotenv.config();

// Import routers
import authRouter from './api/auth';
import teamsRouter from './api/teams';
import designSystemsRouter from './api/design-systems';
import componentsRouter from './api/components';
import tokensRouter from './api/tokens';
import commentsRouter from './api/comments';
import activityRouter from './api/activity';

// Import WebSocket handlers
import { setupWebSocketHandlers } from './websocket';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { logger } from './utils/logger';

// Initialize services
export const prisma = new PrismaClient();
export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Create Express app
const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:6006',
    credentials: true
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:6006',
  credentials: true
}));
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/design-systems', designSystemsRouter);
app.use('/api/design-systems/:designSystemId/components', componentsRouter);
app.use('/api/design-systems/:designSystemId/tokens', tokensRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/activity', activityRouter);

// Error handling
app.use(errorHandler);

// Setup WebSocket handlers
setupWebSocketHandlers(io);

// Start server
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'localhost';

httpServer.listen(PORT, () => {
  logger.info(`Server running at http://${HOST}:${PORT}`);
  logger.info(`WebSocket server ready for connections`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    logger.info('HTTP server closed');
  });
  
  await prisma.$disconnect();
  redis.disconnect();
  
  process.exit(0);
});

export { app, io };