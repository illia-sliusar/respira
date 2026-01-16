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

/**
 * Get risk level text from score
 */
export function getScoreRiskLevel(score: number): string {
  if (score <= 3) return "Low Risk";
  if (score <= 6) return "Moderate Risk";
  return "High Risk";
}

/**
 * Get risk level color class from score
 */
export function getScoreColor(score: number): string {
  if (score <= 3) return "text-green-500";
  if (score <= 6) return "text-yellow-500";
  return "text-red-500";
}

/**
 * Get recommendation based on score
 */
export function getScoreRecommendation(
  score: number,
  dominantDriver: string
): string {
  if (score <= 3) {
    return "Great conditions for outdoor activities!";
  }

  if (score <= 6) {
    switch (dominantDriver) {
      case "pollen":
        return "Consider morning or evening walks when pollen is lower.";
      case "pollution":
        return "Limit prolonged outdoor exercise, especially near traffic.";
      case "weather":
        return "Check the forecast and dress appropriately.";
      default:
        return "Take precautions if you have respiratory sensitivities.";
    }
  }

  switch (dominantDriver) {
    case "pollen":
      return "High pollen levels. Consider staying indoors or wearing a mask.";
    case "pollution":
      return "Poor air quality. Avoid outdoor exercise and keep windows closed.";
    case "weather":
      return "Weather conditions may trigger symptoms. Stay prepared.";
    default:
      return "Unfavorable conditions. Minimize outdoor exposure if possible.";
  }
}
