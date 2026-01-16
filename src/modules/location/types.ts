export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationData {
  coordinates: Coordinates;
  locationName: string | null;
  timestamp: number;
}

export type LocationPermissionStatus =
  | "undetermined"
  | "granted"
  | "denied"
  | "restricted";

export interface LocationState {
  location: LocationData | null;
  permissionStatus: LocationPermissionStatus;
  isLoading: boolean;
  error: string | null;
}
