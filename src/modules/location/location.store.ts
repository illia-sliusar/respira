import { create } from "zustand";
import * as Location from "expo-location";
import type {
  LocationData,
  LocationPermissionStatus,
  Coordinates,
} from "./types";

// Default location (San Francisco) - used when location is not available
const DEFAULT_COORDINATES: Coordinates = {
  latitude: 37.7749,
  longitude: -122.4194,
};

const DEFAULT_LOCATION: LocationData = {
  coordinates: DEFAULT_COORDINATES,
  locationName: "San Francisco",
  timestamp: Date.now(),
};

// Cache TTL for location (5 minutes)
const LOCATION_CACHE_TTL = 5 * 60 * 1000;

interface LocationStoreState {
  location: LocationData | null;
  permissionStatus: LocationPermissionStatus;
  isLoading: boolean;
  error: string | null;

  // Actions
  requestPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<LocationData>;
  getLocationOrDefault: () => LocationData;
  clearError: () => void;
}

export const useLocationStore = create<LocationStoreState>((set, get) => ({
  location: null,
  permissionStatus: "undetermined",
  isLoading: false,
  error: null,

  requestPermission: async () => {
    set({ isLoading: true, error: null });

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      const permissionStatus: LocationPermissionStatus =
        status === Location.PermissionStatus.GRANTED
          ? "granted"
          : status === Location.PermissionStatus.DENIED
            ? "denied"
            : "undetermined";

      set({ permissionStatus, isLoading: false });
      return permissionStatus === "granted";
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to request permission";
      set({ error: message, isLoading: false });
      return false;
    }
  },

  getCurrentLocation: async () => {
    const state = get();

    // Return cached location if still fresh
    if (
      state.location &&
      Date.now() - state.location.timestamp < LOCATION_CACHE_TTL
    ) {
      return state.location;
    }

    set({ isLoading: true, error: null });

    try {
      // Check permission status first
      let { status } = await Location.getForegroundPermissionsAsync();

      if (status !== Location.PermissionStatus.GRANTED) {
        // Try to request permission
        const result = await Location.requestForegroundPermissionsAsync();
        status = result.status;
      }

      if (status !== Location.PermissionStatus.GRANTED) {
        set({
          permissionStatus: "denied",
          isLoading: false,
          error: "Location permission not granted",
        });
        return DEFAULT_LOCATION;
      }

      set({ permissionStatus: "granted" });

      // Get current position
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coordinates: Coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      // Try to get location name via reverse geocoding
      let locationName: string | null = null;
      try {
        const [address] = await Location.reverseGeocodeAsync(coordinates);
        if (address) {
          locationName = address.city || address.region || address.country;
        }
      } catch {
        // Reverse geocoding failed, continue without name
      }

      const locationData: LocationData = {
        coordinates,
        locationName,
        timestamp: Date.now(),
      };

      set({ location: locationData, isLoading: false });
      return locationData;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to get location";
      set({ error: message, isLoading: false });
      return DEFAULT_LOCATION;
    }
  },

  getLocationOrDefault: () => {
    const state = get();
    return state.location || DEFAULT_LOCATION;
  },

  clearError: () => {
    set({ error: null });
  },
}));
