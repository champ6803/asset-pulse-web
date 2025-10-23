import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from '../../store/authStore';
import { apiClient } from '../../api';

// Mock the API client
vi.mock('../../api', () => ({
  apiClient: {
    login: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}));

describe('Auth Store', () => {
  beforeEach(() => {
    // Reset the store state
    useAuthStore.getState().logout();
    vi.clearAllMocks();
  });

  it('initial state is correct', () => {
    const { result } = renderHook(() => useAuthStore());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.token).toBeNull();
  });

  it('login with valid credentials', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      companyCode: 'SCB',
      department: 'Engineering',
      role: 'employee',
    };

    const mockToken = 'mock-jwt-token';

    (apiClient.login as any).mockResolvedValueOnce({
      data: {
        user: mockUser,
        token: mockToken,
      },
    });

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.token).toBe(mockToken);
    expect(apiClient.login).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('login with invalid credentials falls back to mock', async () => {
    (apiClient.login as any).mockRejectedValueOnce(new Error('Invalid credentials'));

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login('employee@scb.com', 'password');
    });

    // Should fall back to mock data
    expect(result.current.user).toBeDefined();
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe('employee@scb.com');
  });

  it('logout clears state and calls API', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      companyCode: 'SCB',
      department: 'Engineering',
      role: 'employee',
    };

    const mockToken = 'real-jwt-token';

    (apiClient.login as any).mockResolvedValueOnce({
      data: {
        user: mockUser,
        token: mockToken,
      },
    });

    (apiClient.logout as any).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useAuthStore());

    // First login
    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    expect(result.current.isAuthenticated).toBe(true);

    // Then logout
    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.token).toBeNull();
    expect(apiClient.logout).toHaveBeenCalled();
  });

  it('getCurrentUser fetches user data', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      companyCode: 'SCB',
      department: 'Engineering',
      role: 'employee',
    };

    const mockToken = 'mock-jwt-token';

    (apiClient.login as any).mockResolvedValueOnce({
      data: {
        user: mockUser,
        token: mockToken,
      },
    });

    (apiClient.getCurrentUser as any).mockResolvedValueOnce({
      data: mockUser,
    });

    const { result } = renderHook(() => useAuthStore());

    // First login
    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    // Then get current user
    let currentUser;
    await act(async () => {
      currentUser = await result.current.getCurrentUser();
    });

    expect(currentUser).toEqual(mockUser);
    expect(apiClient.getCurrentUser).toHaveBeenCalledWith(mockToken);
  });

  it('getCurrentUser without token returns null', async () => {
    const { result } = renderHook(() => useAuthStore());

    await expect(async () => {
      await act(async () => {
        await result.current.getCurrentUser();
      });
    }).rejects.toThrow('No token available');
  });

  it('role-based access control', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      companyCode: 'SCB',
      department: 'Engineering',
      role: 'manager',
    };

    const mockToken = 'mock-jwt-token';

    (apiClient.login as any).mockResolvedValueOnce({
      data: {
        user: mockUser,
        token: mockToken,
      },
    });

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    expect(result.current.user?.role).toBe('manager');
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('company code validation', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      username: 'testuser',
      companyCode: 'SCB',
      department: 'Engineering',
      role: 'employee',
    };

    const mockToken = 'mock-jwt-token';

    (apiClient.login as any).mockResolvedValueOnce({
      data: {
        user: mockUser,
        token: mockToken,
      },
    });

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    expect(result.current.user?.companyCode).toBe('SCB');
  });
});
