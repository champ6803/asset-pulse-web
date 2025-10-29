import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/authStore";

export type NewHireRecommendation = {
  app_name: string;
  category: string;
  tier: string;
  relevance_score: number;
  similarity_score?: number;
  cost: number;
  rationale: string;
  features?: string[];
  alternatives?: string[];
  icon?: string;
  selected?: boolean;
};

export function useNewHireRecommendations(
  step1Data?: {
    jobTitle?: string;
    jobDescription?: string;
    department?: string;
    company?: string;
  },
  appName?: string,
  limit?: number
) {
  const { token } = useAuthStore();

  return useQuery<NewHireRecommendation[]>({
    queryKey: [
      "recommendations",
      "new-hire",
      step1Data?.jobTitle,
      step1Data?.jobDescription,
      step1Data?.department,
      step1Data?.company,
      appName,
      limit,
    ],
    queryFn: async () => {
      if (!token) throw new Error("No authentication token available");
      const data = await apiClient.getNewHireRecommendations<{
        recommendations: NewHireRecommendation[];
        confidence: number;
        processing_time: string;
        total_recommendations: number;
        metadata?: any;
      }>(
        {
          job_title: step1Data?.jobTitle,
          job_description: step1Data?.jobDescription,
          department: step1Data?.department,
          company_code: step1Data?.company,
          app_name: appName,
          limit,
        },
        token
      );

      // API base wrapper already returns data, but spec shows nested shape
      // Normalize: if API returns { recommendations: [...] } return that list
      // If API returns an array directly, handle gracefully
      // @ts-ignore - runtime shape check
      if (Array.isArray(data)) return data as unknown as NewHireRecommendation[];
      // @ts-ignore
      if (data?.recommendations) return data.recommendations as NewHireRecommendation[];
      return [];
    },
    enabled: !!token,
  });
}


