import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService.js';
import { registerSchema, loginSchema, updateProfileSchema } from '../validators/schemas.js';
import { sendSuccess } from '../utils/response.js';

export class AuthController {
  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = registerSchema.parse(req.body);
      const result = await authService.register(validated);
      return sendSuccess(res, result, 'Registration successful! Welcome to Whisk & Layers.', 201);
    } catch (err) {
      next(err);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = loginSchema.parse(req.body);
      const result = await authService.login(validated.email, validated.password);
      return sendSuccess(res, result, 'Signed in successfully!');
    } catch (err) {
      next(err);
    }
  }

  public async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = authService.getMe(userId);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  public async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const validated = updateProfileSchema.parse(req.body);
      const result = authService.updateProfile(userId, validated);
      return sendSuccess(res, result, 'Profile updated successfully!');
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
