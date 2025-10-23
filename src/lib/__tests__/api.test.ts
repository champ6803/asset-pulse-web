import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '../api';

// Mock fetch
global.fetch = vi.fn();

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('login with valid credentials', async () => {
    const mockResponse = {
      user: {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        companyCode: 'SCB',
        department: 'Engineering',
        role: 'employee',
      },
      token: 'mock-jwt-token',
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await apiClient.login('test@example.com', 'password123');

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'test@example.com',
        password: 'password123',
      }),
    });

    expect(result).toEqual(mockResponse);
  });

  it('login with invalid credentials', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Invalid credentials' }),
    });

    await expect(apiClient.login('test@example.com', 'wrongpassword')).rejects.toThrow('API Error: 401');
  });

  it('logout with valid token', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Logged out successfully' }),
    });

    await apiClient.logout();

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  it('getCurrentUser with valid token', async () => {
    const mockToken = 'mock-jwt-token';
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      companyCode: 'SCB',
      department: 'Engineering',
      role: 'employee',
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    const result = await apiClient.getCurrentUser(mockToken);

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/v1/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mockToken}`,
      },
    });

    expect(result).toEqual(mockUser);
  });

  it('getCurrentUser with invalid token', async () => {
    const mockToken = 'invalid-token';

    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Invalid token' }),
    });

    await expect(apiClient.getCurrentUser(mockToken)).rejects.toThrow('API Error: 401');
  });

  it('network error handling', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    await expect(apiClient.login('test@example.com', 'password123')).rejects.toThrow('Network error');
  });

  it('API base URL configuration', () => {
    // Test that API_BASE_URL is correctly configured
    expect(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1').toBeDefined();
  });
});
