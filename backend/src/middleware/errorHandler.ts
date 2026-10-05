import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { sendError } from '../utils/response.js';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(`[Error] ${req.method} ${req.url}:`, err);

  // Handle Zod Schema Validation Errors
  if (err instanceof ZodError) {
    const errorMessages = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    return sendError(res, `Validation error: ${errorMessages}`, 422, err.format());
  }

  // Handle Multer upload errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return sendError(res, 'File size too large. Maximum allowed size is 5MB.', 400);
    }
    return sendError(res, `Upload error: ${err.message}`, 400);
  }

  // Handle Syntax / JSON parse error
  if (err instanceof SyntaxError && 'body' in err) {
    return sendError(res, 'Malformed JSON payload.', 400);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected server error occurred. Please try again later.';

  return sendError(res, message, statusCode);
}

export function notFoundHandler(req: Request, res: Response) {
  return sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
}
