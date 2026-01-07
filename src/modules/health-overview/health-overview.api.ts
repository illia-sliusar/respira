import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/src/lib/axios";
import { API_ENDPOINTS, QUERY_KEYS } from "@/src/lib/constants";
import type { HealthMetrics } from "@/src/types";
import { MOCK_HEALTH_METRICS, MOCK_HEALTH_HISTORY } from "./mock-health-overview";

// Query: Get current health metrics
export function useCurrentHealth() {
  return useQuery({
    queryKey: QUERY_KEYS.HEALTH.CURRENT,
    queryFn: async () => {
      try {
        const response = await apiClient.get<HealthMetrics>(API_ENDPOINTS.HEALTH.CURRENT);
        return response.data;
      } catch (error) {
        // Fallback to mock data if API fails
        console.warn("Using mock health data:", error);
        return MOCK_HEALTH_METRICS;
      }
    },
    // Refetch every 5 minutes for fresh air quality data
    refetchInterval: 5 * 60 * 1000,
    // Keep data fresh
    staleTime: 2 * 60 * 1000,
  });
}

// Query: Get health history
export function useHealthHistory() {
  return useQuery({
    queryKey: QUERY_KEYS.HEALTH.HISTORY,
    queryFn: async () => {
      try {
        const response = await apiClient.get<HealthMetrics[]>(API_ENDPOINTS.HEALTH.HISTORY);
        return response.data;
      } catch (error) {
        console.warn("Using mock health history:", error);
        return MOCK_HEALTH_HISTORY;
      }
    },
  });
}

// Query: Get health by location
export function useHealthByLocation(location: string) {
  return useQuery({
    queryKey: QUERY_KEYS.HEALTH.BY_LOCATION(location),
    queryFn: async () => {
      try {
        const response = await apiClient.get<HealthMetrics>(
          API_ENDPOINTS.HEALTH.BY_LOCATION(location)
        );
        return response.data;
      } catch (error) {
        console.warn("Using mock health data for location:", error);
        return { ...MOCK_HEALTH_METRICS, location };
      }
    },
    enabled: !!location,
  });
}
