import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { prisma, redis } from '../index';
import { logger } from '../utils/logger';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  designSystemId?: string;
}

export function setupWebSocketHandlers(io: Server) {
  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      socket.userId = decoded.userId;
      
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    logger.info(`User ${socket.userId} connected`);

    // Join design system room
    socket.on('join-design-system', async ({ designSystemId }) => {
      try {
        // Verify user has access to this design system
        const member = await prisma.teamMember.findFirst({
          where: {
            userId: socket.userId!,
            team: {
              designSystems: {
                some: { id: designSystemId }
              }
            }
          }
        });

        if (!member) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        socket.designSystemId = designSystemId;
        socket.join(`design-system:${designSystemId}`);

        // Update presence
        await updateUserPresence(socket.userId!, designSystemId, 'active');
        
        // Notify others
        socket.to(`design-system:${designSystemId}`).emit('user-joined', {
          userId: socket.userId,
          designSystemId
        });

        // Send current presence data
        const activeUsers = await getActiveUsers(designSystemId);
        socket.emit('presence-update', { users: activeUsers });

        logger.info(`User ${socket.userId} joined design system ${designSystemId}`);
      } catch (error) {
        logger.error('Error joining design system:', error);
        socket.emit('error', { message: 'Failed to join design system' });
      }
    });

    // Leave design system room
    socket.on('leave-design-system', async ({ designSystemId }) => {
      socket.leave(`design-system:${designSystemId}`);
      await updateUserPresence(socket.userId!, designSystemId, 'offline');
      
      socket.to(`design-system:${designSystemId}`).emit('user-left', {
        userId: socket.userId,
        designSystemId
      });
    });

    // Cursor movement
    socket.on('cursor-move', async ({ x, y, elementId }) => {
      if (!socket.designSystemId) return;

      // Update cursor position in Redis
      await redis.setex(
        `cursor:${socket.userId}:${socket.designSystemId}`,
        30, // Expire after 30 seconds
        JSON.stringify({ x, y, elementId })
      );

      // Broadcast to others in the room
      socket.to(`design-system:${socket.designSystemId}`).emit('cursor-update', {
        userId: socket.userId,
        cursor: { x, y, elementId }
      });
    });

    // Selection change
    socket.on('selection-change', ({ componentId, selection }) => {
      if (!socket.designSystemId) return;

      socket.to(`design-system:${socket.designSystemId}`).emit('selection-update', {
        userId: socket.userId,
        componentId,
        selection
      });
    });

    // User status update
    socket.on('user-status', async ({ status }) => {
      if (!socket.designSystemId) return;

      await updateUserPresence(socket.userId!, socket.designSystemId, status);
      
      socket.to(`design-system:${socket.designSystemId}`).emit('presence-update', {
        userId: socket.userId,
        status
      });
    });

    // Component editing
    socket.on('component-edit-start', async ({ componentId }) => {
      const lockKey = `lock:component:${componentId}`;
      const locked = await redis.set(lockKey, socket.userId!, 'NX', 'EX', 300); // 5 min lock

      if (locked) {
        io.to(`design-system:${socket.designSystemId}`).emit('component-locked', {
          componentId,
          userId: socket.userId
        });
      } else {
        const lockedBy = await redis.get(lockKey);
        socket.emit('component-already-locked', { componentId, userId: lockedBy });
      }
    });

    socket.on('component-edit-end', async ({ componentId }) => {
      const lockKey = `lock:component:${componentId}`;
      const lockedBy = await redis.get(lockKey);

      if (lockedBy === socket.userId) {
        await redis.del(lockKey);
        io.to(`design-system:${socket.designSystemId}`).emit('component-unlocked', {
          componentId
        });
      }
    });

    // Real-time component updates
    socket.on('component-update', async ({ componentId, changes }) => {
      if (!socket.designSystemId) return;

      // Validate and save changes
      try {
        const component = await prisma.component.update({
          where: { id: componentId },
          data: changes
        });

        // Broadcast to others
        socket.to(`design-system:${socket.designSystemId}`).emit('component-changed', {
          componentId,
          changes,
          userId: socket.userId
        });

        // Log activity
        await logActivity(socket.userId!, 'component.updated', componentId);
      } catch (error) {
        socket.emit('error', { message: 'Failed to update component' });
      }
    });

    // Token updates
    socket.on('token-update', async ({ tokenId, changes }) => {
      if (!socket.designSystemId) return;

      try {
        const token = await prisma.designToken.update({
          where: { id: tokenId },
          data: changes
        });

        socket.to(`design-system:${socket.designSystemId}`).emit('token-changed', {
          tokenId,
          changes,
          userId: socket.userId
        });

        await logActivity(socket.userId!, 'token.updated', tokenId);
      } catch (error) {
        socket.emit('error', { message: 'Failed to update token' });
      }
    });

    // Comments
    socket.on('comment-create', async ({ resourceType, resourceId, content, parentId }) => {
      try {
        const comment = await prisma.comment.create({
          data: {
            resourceType,
            resourceId,
            content,
            parentId,
            userId: socket.userId!
          },
          include: {
            user: true,
            reactions: true
          }
        });

        io.to(`design-system:${socket.designSystemId}`).emit('comment-added', {
          comment
        });

        await logActivity(socket.userId!, 'comment.created', comment.id);
      } catch (error) {
        socket.emit('error', { message: 'Failed to create comment' });
      }
    });

    // Reactions
    socket.on('reaction-add', async ({ commentId, emoji }) => {
      try {
        const reaction = await prisma.reaction.create({
          data: {
            commentId,
            emoji,
            userId: socket.userId!
          }
        });

        io.to(`design-system:${socket.designSystemId}`).emit('reaction-added', {
          commentId,
          emoji,
          userId: socket.userId
        });
      } catch (error) {
        socket.emit('error', { message: 'Failed to add reaction' });
      }
    });

    // Typing indicators
    socket.on('typing-start', ({ resourceId, resourceType }) => {
      socket.to(`design-system:${socket.designSystemId}`).emit('typing-users', {
        resourceId,
        resourceType,
        userId: socket.userId,
        typing: true
      });
    });

    socket.on('typing-stop', ({ resourceId, resourceType }) => {
      socket.to(`design-system:${socket.designSystemId}`).emit('typing-users', {
        resourceId,
        resourceType,
        userId: socket.userId,
        typing: false
      });
    });

    // Disconnect
    socket.on('disconnect', async () => {
      logger.info(`User ${socket.userId} disconnected`);

      if (socket.designSystemId) {
        await updateUserPresence(socket.userId!, socket.designSystemId, 'offline');
        
        socket.to(`design-system:${socket.designSystemId}`).emit('user-left', {
          userId: socket.userId,
          designSystemId: socket.designSystemId
        });

        // Clean up any locks
        const keys = await redis.keys(`lock:*:${socket.userId}`);
        if (keys.length > 0) {
          await redis.del(...keys);
        }
      }
    });
  });
}

// Helper functions
async function updateUserPresence(userId: string, designSystemId: string, status: string) {
  await prisma.userPresence.upsert({
    where: {
      userId_designSystemId: {
        userId,
        designSystemId
      }
    },
    update: {
      status,
      lastSeen: new Date()
    },
    create: {
      userId,
      designSystemId,
      status
    }
  });
}

async function getActiveUsers(designSystemId: string) {
  return prisma.userPresence.findMany({
    where: {
      designSystemId,
      status: { not: 'offline' },
      lastSeen: {
        gte: new Date(Date.now() - 5 * 60 * 1000) // Active in last 5 minutes
      }
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true
        }
      }
    }
  });
}

async function logActivity(userId: string, action: string, resourceId?: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      teamMembers: {
        include: { team: true }
      }
    }
  });

  if (user?.teamMembers[0]) {
    await prisma.activityLog.create({
      data: {
        teamId: user.teamMembers[0].teamId,
        userId,
        action,
        resourceId,
        resourceType: action.split('.')[0]
      }
    });
  }
}