import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/src/lib/axios";
import { API_ENDPOINTS, QUERY_KEYS } from "@/src/lib/constants";
import { useLocationStore } from "@/src/modules/location";
import { useProfileStore } from "@/src/modules/profile";
import type { AdvisorData } from "./types";

interface AdvisorApiResponse extends AdvisorData {
  score: {
    score_1_10: number;
    drivers: {
      dominant_driver: string;
      category: string;
    };
  };
  environmental_data: {
    aqi: number;
    temperature: number;
    humidity: number;
    pollen_index: number;
    dominant_allergen?: string;
  };
  timestamp: string;
}

interface UseAdvisorDataOptions {
  enabled?: boolean;
}

/**
 * Hook to fetch personalized health advice using OpenAI
 * Automatically uses user profile and location from stores
 */
export function useAdvisorData(options: UseAdvisorDataOptions = {}) {
  const { enabled = true } = options;
  const getLocationOrDefault = useLocationStore(
    (state) => state.getLocationOrDefault
  );
  const location = useLocationStore((state) => state.location);
  const profile = useProfileStore((state) => state.profile);

  const locationData = getLocationOrDefault();

  return useQuery({
    queryKey: QUERY_KEYS.ADVISOR.DATA(
      locationData.coordinates.latitude,
      locationData.coordinates.longitude
    ),
    queryFn: async (): Promise<AdvisorApiResponse> => {
      const params = new URLSearchParams({
        latitude: locationData.coordinates.latitude.toString(),
        longitude: locationData.coordinates.longitude.toString(),
        condition_type: profile.healthProfile.conditionType,
        risk_tolerance: profile.healthProfile.riskTolerance,
        pollen_sensitivity: profile.healthProfile.sensitivities.pollen.toString(),
        pollution_sensitivity: profile.healthProfile.sensitivities.pollution.toString(),
        pm25_sensitivity: profile.healthProfile.sensitivities.pm25.toString(),
        ozone_sensitivity: profile.healthProfile.sensitivities.ozone.toString(),
      });

      if (locationData.locationName) {
        params.set("location", locationData.locationName);
      }

      // Add pollen allergies if any
      if (profile.pollenAllergies.length > 0) {
        params.set("pollen_allergies", profile.pollenAllergies.join(","));
      }

      // Add asthma triggers if any
      if (profile.asthmaTriggers.length > 0) {
        params.set("asthma_triggers", profile.asthmaTriggers.join(","));
      }

      const response = await apiClient.get<AdvisorApiResponse>(
        `${API_ENDPOINTS.ADVISOR.GET}?${params.toString()}`
      );

      return response.data;
    },
    enabled: enabled && !!location,
    // SMART REFRESH: Advisor uses OpenAI, so we disable auto-refresh
    // Refresh is controlled by the refresh orchestrator based on data changes
    refetchInterval: false, // No automatic refetch - saves OpenAI tokens
    staleTime: Infinity, // Never auto-stale - manual invalidation only
    gcTime: 30 * 60 * 1000, // Keep cached data for 30 minutes
  });
}
