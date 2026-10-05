import { ApiClient } from './apiClient';
import { Notification } from '../types';

export const notificationApi = {
  getMyNotifications: () =>
    ApiClient.get<{ notifications: Notification[]; unreadCount: number }>('/notifications'),

  markAsRead: (id: number) =>
    ApiClient.patch(`/notifications/${id}/read`),

  markAllAsRead: () =>
    ApiClient.post('/notifications/read-all'),
};
