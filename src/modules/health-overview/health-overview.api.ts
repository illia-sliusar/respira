import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/src/lib/axios";
import { API_ENDPOINTS, QUERY_KEYS } from "@/src/lib/constants";
import type { HealthMetrics } from "@/src/types";
import { MOCK_HEALTH_HISTORY } from "./mock-health-overview";
import { useLocationStore } from "@/src/modules/location";

interface LocationParams {
  latitude: number;
  longitude: number;
  location?: string;
}

// Query: Get current health metrics with location
export function useCurrentHealth() {
  const getLocationOrDefault = useLocationStore(
    (state) => state.getLocationOrDefault
  );
  const location = useLocationStore((state) => state.location);

  const locationData = getLocationOrDefault();

  return useQuery({
    queryKey: QUERY_KEYS.HEALTH.CURRENT(
      locationData.coordinates.latitude,
      locationData.coordinates.longitude
    ),
    queryFn: async () => {
      const params: LocationParams = {
        latitude: locationData.coordinates.latitude,
        longitude: locationData.coordinates.longitude,
      };
      if (locationData.locationName) {
        params.location = locationData.locationName;
      }

      const response = await apiClient.get<HealthMetrics>(
        API_ENDPOINTS.HEALTH.CURRENT,
        { params }
      );
      return response.data;
    },
    enabled: !!location,
    // Refetch every 5 minutes for fresh air quality data
    refetchInterval: 5 * 60 * 1000,
    // Keep data fresh
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Check if health data has real (non-simulated) data available
 */
export function hasRealData(data: HealthMetrics | undefined): boolean {
  if (!data?.dataSource) return false;
  return data.dataSource.airQuality === "ads" || data.dataSource.pollen === "ads";
}

/**
 * Check if all data is simulated (no real data available)
 */
export function isAllSimulated(data: HealthMetrics | undefined): boolean {
  if (!data?.dataSource) return true;
  return data.dataSource.airQuality === "simulated" && data.dataSource.pollen === "simulated";
}

// Query: Get health history with location
export function useHealthHistory() {
  const getLocationOrDefault = useLocationStore(
    (state) => state.getLocationOrDefault
  );
  const location = useLocationStore((state) => state.location);

  const locationData = getLocationOrDefault();

  return useQuery({
    queryKey: QUERY_KEYS.HEALTH.HISTORY(
      locationData.coordinates.latitude,
      locationData.coordinates.longitude
    ),
    queryFn: async () => {
      const params: LocationParams = {
        latitude: locationData.coordinates.latitude,
        longitude: locationData.coordinates.longitude,
      };
      if (locationData.locationName) {
        params.location = locationData.locationName;
      }

      const response = await apiClient.get<HealthMetrics[]>(
        API_ENDPOINTS.HEALTH.HISTORY,
        { params }
      );
      return response.data;
    },
    enabled: !!location,
  });
}

// Query: Get health by location
export function useHealthByLocation(location: string) {
  return useQuery({
    queryKey: QUERY_KEYS.HEALTH.BY_LOCATION(location),
    queryFn: async () => {
      const response = await apiClient.get<HealthMetrics>(
        API_ENDPOINTS.HEALTH.BY_LOCATION(location)
      );
      return response.data;
    },
    enabled: !!location,
  });
}
