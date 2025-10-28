import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/authStore";
import type { AIRecommendation } from "@/types";

/**
 * Hook to fetch AI recommendations using React Query
 * @param limit - Optional limit for number of recommendations to fetch
 */
export function useAIRecommendations(limit?: number) {
  const { token } = useAuthStore();

  return useQuery<AIRecommendation[]>({
    queryKey: ["recommendations", "ai", limit],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token available");
      }
      return apiClient.getAIRecommendations<AIRecommendation[]>(token, limit);
    },
    enabled: !!token, // Only run query if token exists
  });
}
