import { Request, Response, NextFunction } from 'express';
import { cakeService } from '../services/cakeService.js';
import { cakeSchema } from '../validators/schemas.js';
import { sendSuccess } from '../utils/response.js';

export class CakeController {
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const bakeryId = req.query.bakeryId ? parseInt(req.query.bakeryId as string, 10) : undefined;
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string, 10) : undefined;
      const search = req.query.search as string;
      const customizableOnly = req.query.customizable === 'true';
      const availableOnly = req.query.available !== 'false';
      const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
      const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;
      const sortBy = req.query.sortBy as any;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 12;

      const result = cakeService.getAllCakes({
        bakeryId,
        categoryId,
        search,
        customizableOnly,
        availableOnly,
        minPrice,
        maxPrice,
        sortBy,
        page,
        limit,
      });

      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  public async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const identifier = req.params.idOrSlug as string;
      const cake = cakeService.getCakeByIdOrSlug(identifier);
      return sendSuccess(res, cake);
    } catch (err) {
      next(err);
    }
  }

  public async getCategories(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = cakeService.getCategories();
      return sendSuccess(res, categories);
    } catch (err) {
      next(err);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const validated = cakeSchema.parse(req.body);
      const created = cakeService.createCake(userId, validated);
      return sendSuccess(res, created, 'Cake listing created successfully!', 201);
    } catch (err) {
      next(err);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const cakeId = parseInt(req.params.id as string, 10);
      const validated = cakeSchema.partial().parse(req.body);
      const updated = cakeService.updateCake(userId, cakeId, validated);
      return sendSuccess(res, updated, 'Cake updated successfully!');
    } catch (err) {
      next(err);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const cakeId = parseInt(req.params.id as string, 10);
      cakeService.deleteCake(userId, cakeId);
      return sendSuccess(res, null, 'Cake listing deactivated.');
    } catch (err) {
      next(err);
    }
  }
}

export const cakeController = new CakeController();
