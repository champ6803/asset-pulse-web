"use client";

import { create } from 'zustand';
import { AuthState, UserRole } from '@/types';

// Mock user data
const mockUsers: Record<string, { password: string; user: any }> = {
  'employee@scb.com': {
    password: 'password',
    user: {
      id: '1',
      username: 'employee@scb.com',
      email: 'employee@scb.com',
      displayName: 'Sarah Chen',
      companyCode: 'SCB',
      departmentCode: 'Marketing',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
    }
  },
  'manager@scb.com': {
    password: 'password',
    user: {
      id: '2',
      username: 'manager@scb.com',
      email: 'manager@scb.com',
      displayName: 'Michael Torres',
      companyCode: 'SCB',
      departmentCode: 'IT',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
    }
  },
  'cto@scb.com': {
    password: 'password',
    user: {
      id: '3',
      username: 'cto@scb.com',
      email: 'cto@scb.com',
      displayName: 'David Kim',
      companyCode: 'SCBX',
      departmentCode: 'Executive',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
    }
  },
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (username: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockUser = mockUsers[username];
    if (mockUser && mockUser.password === password) {
      set({ user: mockUser.user, isAuthenticated: true });
    } else {
      throw new Error('Invalid credentials');
    }
  },

  selectRole: (role: UserRole) => {
    set((state) => ({
      user: state.user ? { ...state.user, role } : null,
    }));
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));

