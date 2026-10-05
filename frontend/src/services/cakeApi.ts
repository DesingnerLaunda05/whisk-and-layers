import { ApiClient } from './apiClient';
import { Cake, CakeCategory } from '../types';

export const cakeApi = {
  getAll: (params: {
    bakeryId?: number;
    categoryId?: number;
    search?: string;
    customizable?: boolean;
    available?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    page?: number;
    limit?: number;
  } = {}) => {
    const query = new URLSearchParams();
    if (params.bakeryId) query.set('bakeryId', String(params.bakeryId));
    if (params.categoryId) query.set('categoryId', String(params.categoryId));
    if (params.search) query.set('search', params.search);
    if (params.customizable !== undefined) query.set('customizable', String(params.customizable));
    if (params.available !== undefined) query.set('available', String(params.available));
    if (params.minPrice) query.set('minPrice', String(params.minPrice));
    if (params.maxPrice) query.set('maxPrice', String(params.maxPrice));
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));

    return ApiClient.get<{ cakes: Cake[]; total: number; page: number; limit: number }>(`/cakes?${query.toString()}`);
  },

  getOne: (idOrSlug: string | number) =>
    ApiClient.get<Cake>(`/cakes/${idOrSlug}`),

  getCategories: () =>
    ApiClient.get<CakeCategory[]>('/cakes/categories'),

  create: (data: any) =>
    ApiClient.post<Cake>('/cakes', data),

  update: (id: number, data: any) =>
    ApiClient.put<Cake>(`/cakes/${id}`, data),

  delete: (id: number) =>
    ApiClient.delete(`/cakes/${id}`),
};
