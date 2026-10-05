import { ApiClient } from './apiClient';
import { Order, OrderStatus } from '../types';

export const orderApi = {
  create: (data: any) =>
    ApiClient.post<Order>('/orders', data),

  getOne: (id: number) =>
    ApiClient.get<Order>(`/orders/${id}`),

  getMyOrders: (params: { status?: OrderStatus; page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    return ApiClient.get<{ orders: Order[]; total: number; page: number; limit: number }>(`/orders/my-orders?${query.toString()}`);
  },

  getBakeryOrders: (params: { status?: OrderStatus; page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    return ApiClient.get<{ orders: Order[]; total: number; page: number; limit: number }>(`/orders/bakery/orders?${query.toString()}`);
  },

  getBakeryDashboard: () =>
    ApiClient.get<{
      pendingOrders: number;
      activeOrders: number;
      completedOrders: number;
      totalRevenue: number;
      urgentOrders: Order[];
    }>('/orders/bakery/dashboard'),

  updateStatus: (id: number, status: OrderStatus, rejectionReason?: string | null) =>
    ApiClient.patch<Order>(`/orders/${id}/status`, { status, rejectionReason }),
};
