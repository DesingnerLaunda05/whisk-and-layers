import { ApiResponse } from '../types';

const API_BASE = '/api';

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

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: options.method || 'GET',
      headers,
      body: bodyData,
    });

    let json: ApiResponse<T>;
    try {
      json = await res.json();
    } catch (e) {
      throw new Error(`Server returned status ${res.status}`);
    }

    if (!res.ok || !json.success) {
      throw new Error(json.message || json.error || 'An error occurred with this request.');
    }

    return json.data;
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
