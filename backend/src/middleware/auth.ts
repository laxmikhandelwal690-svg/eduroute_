import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export type AuthenticatedRequest = Request & {
  user?: {
    id: string;
    role: 'student' | 'admin';
    email: string;
    name: string;
  };
};

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as AuthenticatedRequest['user'];
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

export const adminMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Access denied. Admin role required.' });
  }

  return next();
};
