import { ApiClient } from './apiClient';
import { Bakery, Cake, Review } from '../types';

export const bakeryApi = {
  getAll: (params: { search?: string; city?: string; specialty?: string; sortBy?: string; page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.city) query.set('city', params.city);
    if (params.specialty) query.set('specialty', params.specialty);
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    return ApiClient.get<{ bakeries: Bakery[]; total: number; page: number; limit: number }>(`/bakeries?${query.toString()}`);
  },

  getOne: (idOrSlug: string | number) =>
    ApiClient.get<{ bakery: Bakery; cakes: Cake[]; reviews: Review[] }>(`/bakeries/${idOrSlug}`),

  getMyBakery: () =>
    ApiClient.get<Bakery>('/bakeries/my-bakery'),

  updateMyBakery: (data: Partial<Bakery>) =>
    ApiClient.put<Bakery>('/bakeries/my-bakery', data),
};
