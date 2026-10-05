import { ApiResponse } from '../types';
import { handleMockFallback } from './mockAdapter';

const API_BASE = ((import.meta as any).env?.VITE_API_URL as string) || '/api';

export class ApiClient {
  private static getToken(): string | null {
    return localStorage.getItem('wl_token');
  }

  public static async request<T = any>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
      body?: any;
      headers?: Record<string, string>;
      isFormData?: boolean;
    } = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      ...(options.headers || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let bodyData: any = options.body;
    if (options.body && !options.isFormData) {
      headers['Content-Type'] = 'application/json';
      bodyData = JSON.stringify(options.body);
    }

    // Attempt real API call first
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: options.method || 'GET',
        headers,
        body: bodyData,
      });

      if (res.ok) {
        const json: ApiResponse<T> = await res.json();
        if (json.success) {
          return json.data;
        }
      }
      // If 404/500 and on a static host without custom backend, try mock fallback
      console.warn(`[ApiClient] Live API returned ${res.status} for ${endpoint}, falling back to mock adapter.`);
      return handleMockFallback<T>(endpoint, options);
    } catch (networkError) {
      // Offline, static hosting (GitHub Pages), or backend unavailable -> use rich mock adapter
      return handleMockFallback<T>(endpoint, options);
    }
  }

  public static get<T>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  public static post<T>(endpoint: string, body?: any, isFormData = false) {
    return this.request<T>(endpoint, { method: 'POST', body, isFormData });
  }

  public static put<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, { method: 'PUT', body });
  }

  public static patch<T>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, { method: 'PATCH', body });
  }

  public static delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}
