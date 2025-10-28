import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/authStore";
import type { GetActiveLicensesResponse } from "@/types";

/**
 * Hook to fetch active licenses using React Query
 * @param limit - Optional limit for number of licenses to fetch
 */
export function useActiveLicenses(limit?: number) {
  const { token } = useAuthStore();

  return useQuery<GetActiveLicensesResponse>({
    queryKey: ["licenses", "active", limit],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token available");
      }
      return apiClient.getActiveLicenses<GetActiveLicensesResponse>(
        token,
        limit
      );
    },
    enabled: !!token, // Only run query if token exists
  });
}

/**
 * Hook to fetch all licenses with filters using React Query
 */
export function useLicenses(filters?: {
  status?: string;
  search?: string;
  category?: string;
  licenseTier?: string;
}) {
  const { token } = useAuthStore();

  return useQuery<GetActiveLicensesResponse>({
    queryKey: ["licenses", "all", filters],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token available");
      }
      return apiClient.getLicenses<GetActiveLicensesResponse>(token, filters);
    },
    enabled: !!token, // Only run query if token exists
  });
}
