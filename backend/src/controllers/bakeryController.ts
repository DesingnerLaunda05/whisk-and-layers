import { Request, Response, NextFunction } from 'express';
import { bakeryService } from '../services/bakeryService.js';
import { updateBakerySchema } from '../validators/schemas.js';
import { sendSuccess } from '../utils/response.js';

export class BakeryController {
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string;
      const city = req.query.city as string;
      const specialty = req.query.specialty as string;
      const sortBy = req.query.sortBy as any;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 12;

      const result = bakeryService.getAllBakeries({ search, city, specialty, sortBy, page, limit });
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  public async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const identifier = req.params.idOrSlug as string;
      const result = bakeryService.getBakeryByIdOrSlug(identifier);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  public async getMyBakery(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const bakery = bakeryService.getBakeryProfile(userId);
      return sendSuccess(res, bakery);
    } catch (err) {
      next(err);
    }
  }

  public async updateMyBakery(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const validated = updateBakerySchema.parse(req.body);
      const updated = bakeryService.updateBakeryProfile(userId, validated);
      return sendSuccess(res, updated, 'Bakery storefront updated successfully!');
    } catch (err) {
      next(err);
    }
  }
}

export const bakeryController = new BakeryController();
