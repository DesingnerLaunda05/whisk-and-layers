import { ApiClient } from './apiClient';
import { Review } from '../types';

export const reviewApi = {
  create: (data: { orderId: number; rating: number; comment: string }) =>
    ApiClient.post<Review>('/reviews', data),

  reply: (reviewId: number, replyComment: string) =>
    ApiClient.post<Review>(`/reviews/${reviewId}/reply`, { replyComment }),

  getBakeryReviews: (bakeryId: number, page = 1, limit = 10) =>
    ApiClient.get<{ reviews: Review[]; total: number; page: number; limit: number }>(
      `/reviews/bakery/${bakeryId}?page=${page}&limit=${limit}`
    ),
};
