import { Request, Response, NextFunction } from 'express';
import { notificationService } from '../services/notificationService.js';
import { sendSuccess } from '../utils/response.js';

export class NotificationController {
  public async getMyNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = notificationService.getUserNotifications(userId);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  public async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const notifId = parseInt(req.params.id as string, 10);
      notificationService.markAsRead(notifId, userId);
      return sendSuccess(res, null, 'Notification marked as read');
    } catch (err) {
      next(err);
    }
  }

  public async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      notificationService.markAllAsRead(userId);
      return sendSuccess(res, null, 'All notifications marked as read');
    } catch (err) {
      next(err);
    }
  }
}

export const notificationController = new NotificationController();
