import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/src/lib/axios";
import { API_ENDPOINTS, QUERY_KEYS } from "@/src/lib/constants";
import { useLocationStore } from "@/src/modules/location";
import { useProfileStore } from "@/src/modules/profile";
import type { PersonalizedScoreResponse, ScoreUserProfile } from "./types";

interface UsePersonalizedScoreOptions {
  enabled?: boolean;
}

/**
 * Hook to fetch personalized health risk score
 * Automatically uses user profile from profile store
 *
 * @param options.enabled - Whether the query should run
 */
export function usePersonalizedScore(options: UsePersonalizedScoreOptions = {}) {
  const { enabled = true } = options;
  const getLocationOrDefault = useLocationStore(
    (state) => state.getLocationOrDefault
  );
  const location = useLocationStore((state) => state.location);
  const getScoreUserProfile = useProfileStore(
    (state) => state.getScoreUserProfile
  );

  // Get profile from store
  const profile: ScoreUserProfile = getScoreUserProfile();

  const locationData = getLocationOrDefault();

  return useQuery({
    queryKey: QUERY_KEYS.SCORE.PERSONALIZED(
      locationData.coordinates.latitude,
      locationData.coordinates.longitude
    ),
    queryFn: async (): Promise<PersonalizedScoreResponse> => {
      const params = new URLSearchParams({
        latitude: locationData.coordinates.latitude.toString(),
        longitude: locationData.coordinates.longitude.toString(),
        condition_type: profile.condition_type,
        risk_tolerance: profile.risk_tolerance,
        pollen_sensitivity: profile.sensitivities.pollen_sensitivity.toString(),
        pollution_sensitivity:
          profile.sensitivities.pollution_sensitivity.toString(),
        pm25_sensitivity: profile.sensitivities.pm25_sensitivity.toString(),
        ozone_sensitivity: profile.sensitivities.ozone_sensitivity.toString(),
      });

      if (locationData.locationName) {
        params.set("location", locationData.locationName);
      }

      const response = await apiClient.get<PersonalizedScoreResponse>(
        `${API_ENDPOINTS.SCORE.PERSONALIZED}?${params.toString()}`
      );

      return response.data;
    },
    enabled: enabled && !!location,
    // Refetch every 10 minutes
    refetchInterval: 10 * 60 * 1000,
    // Keep data fresh for 5 minutes
    staleTime: 5 * 60 * 1000,
  });
}

// Helper functions moved to ./score.utils.ts
// Import from @/src/modules/score instead
