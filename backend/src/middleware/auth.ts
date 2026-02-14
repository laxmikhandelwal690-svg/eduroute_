import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'Unauthorized' });

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ success: false, error: 'Server misconfiguration: JWT secret missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

export const adminMiddleware = (req: any, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Access denied' });
  }
  next();
};
