import { Request, Response, NextFunction } from 'express';
import { customizationService } from '../services/customizationService.js';
import { sendSuccess } from '../utils/response.js';

export class CustomizationController {
  public async getOptions(_req: Request, res: Response, next: NextFunction) {
    try {
      const grouped = customizationService.getGroupedOptions();
      const all = customizationService.getAllOptions();
      return sendSuccess(res, { grouped, all });
    } catch (err) {
      next(err);
    }
  }

  public async calculatePrice(req: Request, res: Response, next: NextFunction) {
    try {
      const { basePrice, optionIds } = req.body;
      const total = customizationService.calculateCustomPrice(
        Number(basePrice) || 0,
        Array.isArray(optionIds) ? optionIds.map(Number) : []
      );
      return sendSuccess(res, { total });
    } catch (err) {
      next(err);
    }
  }
}

export const customizationController = new CustomizationController();
