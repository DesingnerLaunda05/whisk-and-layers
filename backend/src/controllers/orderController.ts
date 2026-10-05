import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/orderService.js';
import { createOrderSchema, updateOrderStatusSchema } from '../validators/schemas.js';
import { sendSuccess } from '../utils/response.js';

export class OrderController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = req.user!.userId;
      const validated = createOrderSchema.parse(req.body);
      const order = await orderService.createOrder(customerId, validated);
      return sendSuccess(res, order, 'Order placed successfully! The bakery has been notified.', 201);
    } catch (err) {
      next(err);
    }
  }

  public async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = parseInt(req.params.id as string, 10);
      const userId = req.user!.userId;
      const role = req.user!.role;
      const order = orderService.getOrderById(orderId, userId, role);
      return sendSuccess(res, order);
    } catch (err) {
      next(err);
    }
  }

  public async getMyOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = req.user!.userId;
      const status = req.query.status as any;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

      const result = orderService.getCustomerOrders(customerId, { status, page, limit });
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  public async getBakeryOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const status = req.query.status as any;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 15;

      const result = orderService.getBakeryOrders(userId, { status, page, limit });
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  public async getBakeryDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const stats = orderService.getBakeryDashboard(userId);
      return sendSuccess(res, stats);
    } catch (err) {
      next(err);
    }
  }

  public async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = parseInt(req.params.id as string, 10);
      const userId = req.user!.userId;
      const role = req.user!.role;
      const validated = updateOrderStatusSchema.parse(req.body);

      const updated = orderService.updateStatus(
        orderId,
        userId,
        role,
        validated.status,
        validated.rejectionReason
      );

      const statusMsg =
        validated.status === 'ACCEPTED'
          ? 'Order accepted successfully!'
          : validated.status === 'REJECTED'
          ? 'Order rejected with provided reason.'
          : `Order status updated to ${validated.status}.`;

      return sendSuccess(res, updated, statusMsg);
    } catch (err) {
      next(err);
    }
  }
}

export const orderController = new OrderController();
