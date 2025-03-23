import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error('Error:', error);

  if (error.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      message: 'خطای پایگاه داده',
    });
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'توکن نامعتبر است',
    });
  }

  res.status(500).json({
    message: 'خطای سرور',
  });
}
