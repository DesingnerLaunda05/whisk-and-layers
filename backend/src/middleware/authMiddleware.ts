import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth.js';
import { sendError } from '../utils/response.js';
import { UserRole, AuthTokenPayload } from '../types/index.js';
import { db } from '../database/db.js';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Authentication required. Please sign in.', 401);
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);

  if (!payload) {
    return sendError(res, 'Invalid or expired session. Please sign in again.', 401);
  }

  // Verify user is still active in database
  const user = db.queryOne<{ id: number; is_active: number; role: UserRole }>(
    'SELECT id, is_active, role FROM users WHERE id = ?',
    [payload.userId]
  );

  if (!user || user.is_active !== 1) {
    return sendError(res, 'User account is deactivated or no longer exists.', 401);
  }

  // If role is bakery, ensure bakeryId is attached
  if (user.role === 'BAKERY' && !payload.bakeryId) {
    const bakery = db.queryOne<{ id: number }>('SELECT id FROM bakeries WHERE user_id = ?', [user.id]);
    payload.bakeryId = bakery?.id || null;
  }

  req.user = payload;
  next();
}

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Authentication required.', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, 'Access denied. You do not have permission to perform this action.', 403);
    }

    next();
  };
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (payload) {
      req.user = payload;
    }
  }
  next();
}
