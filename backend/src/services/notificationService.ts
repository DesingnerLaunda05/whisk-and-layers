import { notificationRepository } from '../repositories/notificationRepository.js';

export class NotificationService {
  public getUserNotifications(userId: number) {
    const list = notificationRepository.findByUser(userId);
    const unreadCount = notificationRepository.getUnreadCount(userId);
    return { notifications: list, unreadCount };
  }

  public markAsRead(id: number, userId: number) {
    return notificationRepository.markAsRead(id, userId);
  }

  public markAllAsRead(userId: number) {
    return notificationRepository.markAllAsRead(userId);
  }
}

export const notificationService = new NotificationService();
