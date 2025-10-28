import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/authStore";
import type { GetPendingRequestsResponse } from "@/types";

/**
 * Hook to fetch pending requests using React Query
 * @param limit - Optional limit for number of requests to fetch
 */
export function usePendingRequests(limit?: number) {
  const { token } = useAuthStore();

  return useQuery<GetPendingRequestsResponse>({
    queryKey: ["requests", "pending", limit],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token available");
      }
      return apiClient.getPendingRequests<GetPendingRequestsResponse>(
        token,
        limit
      );
    },
    enabled: !!token, // Only run query if token exists
  });
}
