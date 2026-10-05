import { ApiClient } from './apiClient';
import { User, Bakery } from '../types';

export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    ApiClient.post<{ user: User; token: string; bakeryId?: number | null }>('/auth/login', credentials),

  register: (data: any) =>
    ApiClient.post<{ user: User; token: string; bakeryId?: number | null }>('/auth/register', data),

  getMe: () =>
    ApiClient.get<{ user: User; bakery?: Bakery | null }>('/auth/me'),

  updateProfile: (data: { fullName?: string; phone?: string | null; avatarUrl?: string | null }) =>
    ApiClient.put<User>('/auth/profile', data),
};
