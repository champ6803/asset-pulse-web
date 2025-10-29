// API Client for backend communication
// This is a mock implementation - replace with real API calls when backend is ready

import axios, { AxiosInstance } from "axios";
import type { BaseResponse } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

interface RequestOptions extends RequestInit {
  token?: string;
}

class ApiClient {
  private baseUrl: string;

  private axiosInstance: AxiosInstance;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { token, ...fetchOptions } = options;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers as Record<string, string>),
    };

    const response = await this.axiosInstance.request<BaseResponse<T>>({
      url: endpoint,
      method: (fetchOptions.method as string) || "GET",
      headers,
      data: fetchOptions.body,
    });

    // Return just the data from the BaseResponse wrapper
    return response.data.data;
  }

  // Authentication
  async login(username: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  }

  async logout(token: string) {
    return this.request("/auth/logout", {
      method: "POST",
      token,
    });
  }

  async getCurrentUser(token: string) {
    return this.request("/auth/me", { token });
  }

  // Recommendations
  async generateJDRecommendations(
    data: {
      job_title: string;
      job_description: string;
      department: string;
      company_code: string;
    },
    token: string
  ) {
    return this.request("/recommendations/jd-match", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    });
  }

  async getNewHireRecommendations<
    T = any
  >(
    data: {
      job_title?: string;
      job_description?: string;
      department?: string;
      company_code?: string;
      app_name?: string;
      limit?: number;
      experience?: string;
      skills?: string[];
    },
    token: string
  ) {
    return this.request<T>("/ai/recommendations/new-hire", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    });
  }

  async getSeatOptimization(token: string, filters?: any) {
    const params = new URLSearchParams(filters);
    return this.request(`/recommendations/seat-optimization?${params}`, {
      token,
    });
  }

  async getCrossSub(token: string) {
    return this.request("/recommendations/cross-sub-match", { token });
  }

  async getConsolidation(token: string) {
    return this.request("/recommendations/consolidation", { token });
  }

  // Templates
  async getTemplates(token: string) {
    return this.request("/templates", { token });
  }

  async createTemplate(data: any, token: string) {
    return this.request("/templates", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    });
  }

  // Requests
  async getRequests(token: string) {
    return this.request("/requests", { token });
  }

  async getPendingRequests<T>(token: string, limit?: number) {
    const params = limit ? `?limit=${limit}` : "";
    return this.request<T>(`/requests/pending${params}`, { token });
  }

  async getAIRecommendations<T>(token: string, limit?: number) {
    const params = limit ? `?limit=${limit}` : "";
    return this.request<T>(`/ai/recommendations${params}`, { token });
  }

  async createRequest(data: any, token: string) {
    return this.request("/requests", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    });
  }

  async approveRequest(requestId: string, token: string) {
    return this.request(`/requests/${requestId}/approve`, {
      method: "POST",
      token,
    });
  }

  async rejectRequest(requestId: string, token: string) {
    return this.request(`/requests/${requestId}/reject`, {
      method: "POST",
      token,
    });
  }

  // Licenses
  async getUserLicenses(userId: string, token: string) {
    return this.request(`/licenses/users/${userId}`, { token });
  }

  async getActiveLicenses<T>(token: string, limit?: number) {
    const params = limit ? `?limit=${limit}` : "";
    return this.request<T>(`/licenses/active${params}`, { token });
  }

  async getLicenses<T>(
    token: string,
    filters?: {
      status?: string;
      search?: string;
      category?: string;
      licenseTier?: string;
    }
  ) {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.category) params.append("category", filters.category);
    if (filters?.licenseTier)
      params.append("license_tier", filters.licenseTier);

    const queryString = params.toString();
    return this.request<T>(`/licenses${queryString ? `?${queryString}` : ""}`, {
      token,
    });
  }

  // Analytics
  async getDashboardMetrics(token: string) {
    return this.request("/analytics/dashboard", { token });
  }

  // Similar Software / Consolidation
  async getSimilarSoftwareClusters(token: string, filters?: {
    company_code?: string;
    subsidiaries?: string[];
    min_similarity?: number;
    category?: string;
    app_name?: string;
  }) {
    const params = new URLSearchParams();
    if (filters?.company_code) params.append("company_code", filters.company_code);
    if (filters?.subsidiaries) {
      filters.subsidiaries.forEach(code => params.append("subsidiaries", code));
    }
    if (filters?.min_similarity) params.append("min_similarity", filters.min_similarity.toString());
    if (filters?.category) params.append("category", filters.category);
    if (filters?.app_name) params.append("app_name", filters.app_name);
    
    const queryString = params.toString();
    const endpoint = queryString 
      ? `/similar-software/clusters?${queryString}`
      : "/similar-software/clusters";
    return this.request(endpoint, { token });
  }

  async getCompanies(token: string) {
    const response = await this.request<{companies: Array<{id: number; code: string; name: string}>}>(
      "/companies",
      { token }
    );
    return response.companies;
  }

  async getVendorPricingTiers(token: string, clusterKey?: string, vendorId?: string) {
    const params = new URLSearchParams();
    if (clusterKey) params.append("cluster_key", clusterKey);
    if (vendorId) params.append("vendor_id", vendorId);
    
    const queryString = params.toString();
    const endpoint = queryString
      ? `/vendors/pricing-tiers?${queryString}`
      : "/vendors/pricing-tiers";
    return this.request(endpoint, { token });
  }

  async simulateSavings(
    token: string,
    data: {
      cluster_key: string;
      target_vendor_id: string;
      training_cost_per_user?: number;
      migration_flat_cost?: number;
      early_termination_penalty_rate?: number;
    }
  ) {
    return this.request("/similar-software/saving-simulation", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
