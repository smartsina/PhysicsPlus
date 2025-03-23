import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(50),
});

const registerSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(50),
  name: z.string().min(2).max(100),
  role: z.enum(['STUDENT', 'TEACHER', 'PARENT']),
});

export function validateLogin(req: Request, res: Response, next: NextFunction) {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'داده‌های ورودی نامعتبر هستند',
        errors: error.errors,
      });
    }
    next(error);
  }
}

export function validateRegister(req: Request, res: Response, next: NextFunction) {
  try {
    registerSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'داده‌های ورودی نامعتبر هستند',
        errors: error.errors,
      });
    }
    next(error);
  }
}
