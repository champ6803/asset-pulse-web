"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    // Initialize auth state on mount (page refresh)
    initialize();
  }, [initialize]);

  return <>{children}</>;
}
