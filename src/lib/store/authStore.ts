"use client";

import { create } from "zustand";
import { AuthState, UserRole } from "@/types";
import { apiClient } from "@/lib/api";

// Mock user data for fallback
const mockUsers: Record<string, { password: string; user: any }> = {
  "employee@scb.com": {
    password: "password",
    user: {
      id: "1",
      username: "employee@scb.com",
      email: "employee@scb.com",
      displayName: "Sarah Chen",
      companyCode: "SCB",
      departmentCode: "Marketing",
      avatar:
        "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg",
    },
  },
  "manager@scb.com": {
    password: "password",
    user: {
      id: "2",
      username: "manager@scb.com",
      email: "manager@scb.com",
      displayName: "Michael Torres",
      companyCode: "SCB",
      departmentCode: "IT",
      avatar:
        "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
    },
  },
  "cto@scb.com": {
    password: "password",
    user: {
      id: "3",
      username: "cto@scb.com",
      email: "cto@scb.com",
      displayName: "David Kim",
      companyCode: "SCBX",
      departmentCode: "Executive",
      avatar:
        "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg",
    },
  },
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  token: null,

  initialize: async () => {
    // Check if there's a token in localStorage
    const storedToken =
      typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

    if (!storedToken) {
      return;
    }

    try {
      // Call /me endpoint to get current user
      const response = await apiClient.getCurrentUser(storedToken);
      if (response && response.data) {
        set({
          user: response.data,
          isAuthenticated: true,
          token: storedToken,
        });
      }
    } catch (error) {
      console.log("Failed to restore session:", error);
      // Clear invalid token
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
      }
      set({ user: null, isAuthenticated: false, token: null });
    }
  },

  login: async (username: string, password: string) => {
    try {
      // Try real API first
      const response = await apiClient.login(username, password);

      if (response && response.data) {
        const { token, user } = response.data;
        // Store token in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", token);
        }

        set({
          user: user,
          isAuthenticated: true,
          token: token,
        });
        return user.role as UserRole; // Return role for immediate redirect
      }
    } catch (error) {
      console.log("API login failed, falling back to mock:", error);
    }

    // Fallback to mock authentication
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockUser = mockUsers[username];
    if (mockUser && mockUser.password === password) {
      // Determine role based on username for mock users
      let role: UserRole = "employee";
      if (username.includes("manager")) {
        role = "manager";
      } else if (username.includes("cto")) {
        role = "subsidiary-cto";
      }

      const userWithRole = { ...mockUser.user, role };
      set({
        user: userWithRole,
        isAuthenticated: true,
        token: "mock-token-" + Date.now(),
      });
      return role;
    }

    throw new Error("Invalid credentials");
  },

  selectRole: (role: UserRole) => {
    const { user } = get();
    if (user) {
      set({ user: { ...user, role } });
    }
  },

  logout: async () => {
    const { token } = get();

    try {
      if (token && !token.startsWith("mock-token-")) {
        await apiClient.logout();
      }
    } catch (error) {
      console.log("Logout API call failed:", error);
    }

    // Clear token from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }

    set({ user: null, isAuthenticated: false, token: null });
  },

  getCurrentUser: async () => {
    const { token } = get();

    if (!token) {
      throw new Error("No token available");
    }

    const response = await apiClient.getCurrentUser(token);
    if (response && response.data) {
      set({ user: response.data });
      return response.data;
    }

    throw new Error("Failed to get current user");
  },
}));
