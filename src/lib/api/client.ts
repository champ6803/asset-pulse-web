// API Client for backend communication
// This is a mock implementation - replace with real API calls when backend is ready

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

interface RequestOptions extends RequestInit {
  token?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { token, ...fetchOptions } = options;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Authentication
  async login(username: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async logout(token: string) {
    return this.request('/auth/logout', {
      method: 'POST',
      token,
    });
  }

  async getCurrentUser(token: string) {
    return this.request('/auth/me', { token });
  }

  // Recommendations
  async generateJDRecommendations(data: {
    job_title: string;
    job_description: string;
    department: string;
    company_code: string;
  }, token: string) {
    return this.request('/recommendations/jd-match', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  async getSeatOptimization(token: string, filters?: any) {
    const params = new URLSearchParams(filters);
    return this.request(`/recommendations/seat-optimization?${params}`, { token });
  }

  async getCrossSub(token: string) {
    return this.request('/recommendations/cross-sub-match', { token });
  }

  async getConsolidation(token: string) {
    return this.request('/recommendations/consolidation', { token });
  }

  // Templates
  async getTemplates(token: string) {
    return this.request('/templates', { token });
  }

  async createTemplate(data: any, token: string) {
    return this.request('/templates', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  // Requests
  async getRequests(token: string) {
    return this.request('/requests', { token });
  }

  async createRequest(data: any, token: string) {
    return this.request('/requests', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  async approveRequest(requestId: string, token: string) {
    return this.request(`/requests/${requestId}/approve`, {
      method: 'POST',
      token,
    });
  }

  async rejectRequest(requestId: string, token: string) {
    return this.request(`/requests/${requestId}/reject`, {
      method: 'POST',
      token,
    });
  }

  // Licenses
  async getUserLicenses(userId: string, token: string) {
    return this.request(`/licenses/users/${userId}`, { token });
  }

  // Analytics
  async getDashboardMetrics(token: string) {
    return this.request('/analytics/dashboard', { token });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

