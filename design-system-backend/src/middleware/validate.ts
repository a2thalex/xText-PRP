import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export function validate(schema: Joi.Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({ errors });
    }

    next();
  };
}