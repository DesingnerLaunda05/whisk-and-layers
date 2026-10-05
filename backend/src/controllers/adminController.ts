import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/adminService.js';
import { sendSuccess } from '../utils/response.js';

export class AdminController {
  public async getMetrics(_req: Request, res: Response, next: NextFunction) {
    try {
      const metrics = adminService.getDashboardMetrics();
      return sendSuccess(res, metrics);
    } catch (err) {
      next(err);
    }
  }

  public async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string;
      const role = req.query.role as string;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

      const result = adminService.getUsers({ search, role, page, limit });
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  public async getBakeries(req: Request, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

      const result = adminService.getBakeries({ search, page, limit });
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  public async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as any;
      const search = req.query.search as string;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

      const result = adminService.getOrders({ status, search, page, limit });
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  public async toggleBakeryApproval(req: Request, res: Response, next: NextFunction) {
    try {
      const bakeryId = parseInt(req.params.id as string, 10);
      const { isApproved } = req.body;
      const updated = adminService.toggleBakeryApproval(bakeryId, !!isApproved);
      return sendSuccess(
        res,
        updated,
        `Bakery ${isApproved ? 'approved' : 'disapproved'} successfully.`
      );
    } catch (err) {
      next(err);
    }
  }

  public async toggleUserStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.id as string, 10);
      const { isActive } = req.body;
      const updated = adminService.toggleUserStatus(userId, !!isActive);
      return sendSuccess(
        res,
        updated,
        `User account ${isActive ? 'activated' : 'deactivated'} successfully.`
      );
    } catch (err) {
      next(err);
    }
  }
}

export const adminController = new AdminController();
