import { Request, Response, NextFunction } from 'express';
import { prisma } from '../index';

interface AuthRequest extends Request {
  userId?: string;
  teamMember?: any;
}

export async function checkDesignSystemAccess(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { designSystemId } = req.params;
    const userId = req.userId;

    if (!designSystemId || !userId) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    // Check if user has access to this design system through team membership
    const member = await prisma.teamMember.findFirst({
      where: {
        userId,
        team: {
          designSystems: {
            some: { id: designSystemId }
          }
        }
      },
      include: {
        team: {
          include: {
            designSystems: {
              where: { id: designSystemId }
            }
          }
        }
      }
    });

    if (!member) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Attach member info to request for role checking
    req.teamMember = member;
    next();
  } catch (error) {
    next(error);
  }
}

export function requireRole(roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.teamMember) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!roles.includes(req.teamMember.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: roles,
        current: req.teamMember.role
      });
    }

    next();
  };
}