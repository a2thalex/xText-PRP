import { Router } from 'express';
import Joi from 'joi';
import { prisma } from '../index';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { checkDesignSystemAccess } from '../middleware/checkAccess';

const router = Router({ mergeParams: true });

// Apply authentication to all routes
router.use(authenticate);
router.use(checkDesignSystemAccess);

// Validation schemas
const createComponentSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  category: Joi.string().min(1).max(50).required(),
  props: Joi.object().required(),
  code: Joi.string().required(),
  documentation: Joi.string().allow('').optional()
});

const updateComponentSchema = Joi.object({
  name: Joi.string().min(1).max(100).optional(),
  category: Joi.string().min(1).max(50).optional(),
  props: Joi.object().optional(),
  code: Joi.string().optional(),
  documentation: Joi.string().allow('').optional()
});

// Get all components
router.get('/', async (req, res, next) => {
  try {
    const { designSystemId } = req.params;
    const { category, search } = req.query;

    const where: any = { designSystemId };
    
    if (category) {
      where.category = category as string;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { documentation: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const components = await prisma.component.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({ components });
  } catch (error) {
    next(error);
  }
});

// Get single component
router.get('/:componentId', async (req, res, next) => {
  try {
    const { designSystemId, componentId } = req.params;

    const component = await prisma.component.findFirst({
      where: {
        id: componentId,
        designSystemId
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true
          }
        },
        versions: {
          orderBy: { version: 'desc' },
          take: 10,
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true
              }
            }
          }
        }
      }
    });

    if (!component) {
      return res.status(404).json({ error: 'Component not found' });
    }

    res.json({ component });
  } catch (error) {
    next(error);
  }
});

// Create component
router.post('/', validate(createComponentSchema), async (req, res, next) => {
  try {
    const { designSystemId } = req.params;
    const { name, category, props, code, documentation } = req.body;

    // Check if component with same name exists
    const existing = await prisma.component.findFirst({
      where: {
        designSystemId,
        name
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'Component with this name already exists' });
    }

    const component = await prisma.component.create({
      data: {
        designSystemId,
        name,
        category,
        props,
        code,
        documentation,
        createdBy: req.userId!
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true
          }
        }
      }
    });

    // Create initial version
    await prisma.componentVersion.create({
      data: {
        componentId: component.id,
        version: 1,
        props,
        code,
        documentation,
        changedBy: req.userId!,
        changeMessage: 'Initial version'
      }
    });

    // Log activity
    await logComponentActivity(req.userId!, designSystemId, 'component.created', component.id);

    res.status(201).json({ component });
  } catch (error) {
    next(error);
  }
});

// Update component
router.put('/:componentId', validate(updateComponentSchema), async (req, res, next) => {
  try {
    const { designSystemId, componentId } = req.params;
    const updates = req.body;

    // Get current component
    const current = await prisma.component.findFirst({
      where: {
        id: componentId,
        designSystemId
      }
    });

    if (!current) {
      return res.status(404).json({ error: 'Component not found' });
    }

    // Update component
    const component = await prisma.component.update({
      where: { id: componentId },
      data: {
        ...updates,
        version: { increment: 1 }
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true
          }
        }
      }
    });

    // Create version record
    await prisma.componentVersion.create({
      data: {
        componentId: component.id,
        version: component.version,
        props: updates.props || current.props,
        code: updates.code || current.code,
        documentation: updates.documentation || current.documentation,
        changedBy: req.userId!,
        changeMessage: req.body.changeMessage || 'Updated component'
      }
    });

    // Log activity
    await logComponentActivity(req.userId!, designSystemId, 'component.updated', component.id);

    res.json({ component });
  } catch (error) {
    next(error);
  }
});

// Delete component
router.delete('/:componentId', async (req, res, next) => {
  try {
    const { designSystemId, componentId } = req.params;

    const component = await prisma.component.findFirst({
      where: {
        id: componentId,
        designSystemId
      }
    });

    if (!component) {
      return res.status(404).json({ error: 'Component not found' });
    }

    await prisma.component.delete({
      where: { id: componentId }
    });

    // Log activity
    await logComponentActivity(req.userId!, designSystemId, 'component.deleted', componentId);

    res.json({ message: 'Component deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Get component versions
router.get('/:componentId/versions', async (req, res, next) => {
  try {
    const { componentId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const versions = await prisma.componentVersion.findMany({
      where: { componentId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true
          }
        }
      },
      orderBy: { version: 'desc' },
      take: Number(limit),
      skip: Number(offset)
    });

    const total = await prisma.componentVersion.count({
      where: { componentId }
    });

    res.json({ versions, total });
  } catch (error) {
    next(error);
  }
});

// Revert to specific version
router.post('/:componentId/revert/:version', async (req, res, next) => {
  try {
    const { designSystemId, componentId, version } = req.params;

    const targetVersion = await prisma.componentVersion.findFirst({
      where: {
        componentId,
        version: Number(version)
      }
    });

    if (!targetVersion) {
      return res.status(404).json({ error: 'Version not found' });
    }

    // Update component with version data
    const component = await prisma.component.update({
      where: { id: componentId },
      data: {
        props: targetVersion.props,
        code: targetVersion.code,
        documentation: targetVersion.documentation,
        version: { increment: 1 }
      }
    });

    // Create new version record
    await prisma.componentVersion.create({
      data: {
        componentId: component.id,
        version: component.version,
        props: targetVersion.props,
        code: targetVersion.code,
        documentation: targetVersion.documentation,
        changedBy: req.userId!,
        changeMessage: `Reverted to version ${version}`
      }
    });

    // Log activity
    await logComponentActivity(
      req.userId!,
      designSystemId,
      'component.reverted',
      componentId,
      { toVersion: version }
    );

    res.json({ component });
  } catch (error) {
    next(error);
  }
});

// Helper function to log activity
async function logComponentActivity(
  userId: string,
  designSystemId: string,
  action: string,
  componentId: string,
  metadata?: any
) {
  const designSystem = await prisma.designSystem.findUnique({
    where: { id: designSystemId },
    select: { teamId: true }
  });

  if (designSystem) {
    await prisma.activityLog.create({
      data: {
        teamId: designSystem.teamId,
        userId,
        action,
        resourceType: 'component',
        resourceId: componentId,
        metadata
      }
    });
  }
}

export default router;