import { ApiClient } from './apiClient';
import { User, Bakery, Order } from '../types';

export const adminApi = {
  getMetrics: () =>
    ApiClient.get<{
      totalUsers: number;
      totalBakeries: number;
      pendingBakeries: number;
      totalCakes: number;
      totalOrders: number;
      completedOrders: number;
      totalGrossRevenue: number;
      recentActivity: Array<{ id: number; type: string; title: string; created_at: string }>;
    }>('/admin/metrics'),

  getUsers: (params: { search?: string; role?: string; page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.role) query.set('role', params.role);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    return ApiClient.get<{ users: User[]; total: number; page: number; limit: number }>(`/admin/users?${query.toString()}`);
  },

  getBakeries: (params: { search?: string; page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    return ApiClient.get<{ bakeries: Bakery[]; total: number; page: number; limit: number }>(`/admin/bakeries?${query.toString()}`);
  },

  getOrders: (params: { status?: string; search?: string; page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.search) query.set('search', params.search);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    return ApiClient.get<{ orders: Order[]; total: number; page: number; limit: number }>(`/admin/orders?${query.toString()}`);
  },

  toggleBakeryApproval: (id: number, isApproved: boolean) =>
    ApiClient.patch<Bakery>(`/admin/bakeries/${id}/approval`, { isApproved }),

  toggleUserStatus: (id: number, isActive: boolean) =>
    ApiClient.patch<User>(`/admin/users/${id}/status`, { isActive }),
};
