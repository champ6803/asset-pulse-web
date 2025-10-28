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
  async login(username: string, password: string): Promise<{ data: { token: string; user: any } }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async logout(): Promise<void> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(token: string): Promise<{ data: any }> {
    return this.request('/me', {
      method: 'GET',
      token,
    });
  }

  // AI Recommendations
  async generateJDRecommendations(jobData: any, token: string) {
    return this.request('/ai/recommendations/jd-match', {
      method: 'POST',
      body: JSON.stringify(jobData),
      token,
    });
  }

  async generateConsolidationMemo(consolidationData: any, token: string) {
    return this.request('/ai/consolidation/memo', {
      method: 'POST',
      body: JSON.stringify(consolidationData),
      token,
    });
  }

  async calculateSoftwareSimilarity(similarityData: any, token: string) {
    return this.request('/ai/similarity', {
      method: 'POST',
      body: JSON.stringify(similarityData),
      token,
    });
  }

  // Dashboard endpoints
  async getEmployeeDashboard(token: string) {
    return this.request('/employee/dashboard', {
      method: 'GET',
      token,
    });
  }

  async getManagerDashboard(token: string) {
    return this.request('/manager/dashboard', {
      method: 'GET',
      token,
    });
  }

  async getCTODashboard(token: string) {
    return this.request('/cto/dashboard', {
      method: 'GET',
      token,
    });
  }

  async getGroupCTODashboard(token: string) {
    return this.request('/group-cto/dashboard', {
      method: 'GET',
      token,
    });
  }

  // Seat Optimization
  async getSeatOptimization(token: string) {
    return this.request('/cto/optimization', {
      method: 'GET',
      token,
    });
  }

  // Consolidation
  async getConsolidationOpportunities(token: string) {
    return this.request('/group-cto/consolidation', {
      method: 'GET',
      token,
    });
  }

  // Approvals
  async getPendingApprovals(token: string) {
    return this.request('/manager/approvals', {
      method: 'GET',
      token,
    });
  }

  // Users
  async getUsers(token: string, params?: any) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = queryParams ? `/users?${queryParams}` : '/users';
    return this.request(endpoint, {
      method: 'GET',
      token,
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
