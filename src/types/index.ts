// App-specific types

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteDto {
  title: string;
  content?: string;
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface SignupDto {
  email: string;
  password: string;
  name: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// Health Overview Types
export type HealthRiskLevel = "Low Risk" | "Medium Risk" | "Moderate Risk" | "High Risk" | "Very High Risk";

export type HealthCondition = "Excellent" | "Good Conditions" | "Moderate Conditions" | "Fair" | "Poor" | "Hazardous";

// Pollen level: 0 = None, 1 = Low, 2 = Moderate, 3 = High, 4 = Very High
export type PollenLevel = 0 | 1 | 2 | 3 | 4;

export interface PollenData {
  tree: {
    level: PollenLevel;
    types: {
      birch?: PollenLevel;
      oak?: PollenLevel;
      pine?: PollenLevel;
      cedar?: PollenLevel;
      maple?: PollenLevel;
      elm?: PollenLevel;
      alder?: PollenLevel;
      hazel?: PollenLevel;
    };
  };
  grass: {
    level: PollenLevel;
    types: {
      timothy?: PollenLevel;
      bermuda?: PollenLevel;
      ryegrass?: PollenLevel;
      bluegrass?: PollenLevel;
    };
  };
  weed: {
    level: PollenLevel;
    types: {
      ragweed?: PollenLevel;
      mugwort?: PollenLevel;
      plantain?: PollenLevel;
      nettle?: PollenLevel;
      sorrel?: PollenLevel;
    };
  };
  mold?: {
    level: PollenLevel;
    types: {
      alternaria?: PollenLevel;
      cladosporium?: PollenLevel;
      aspergillus?: PollenLevel;
    };
  };
  overallIndex: number; // 0-10
  season: "spring" | "summer" | "fall" | "winter";
  dominantAllergen?: string;
}

export interface HealthMetrics {
  id: string;
  score: number; // 0-10
  riskLevel: HealthRiskLevel;
  condition: HealthCondition;
  description: string;
  location: string;
  timestamp: string;
  aqi?: number; // Air Quality Index
  temperature?: number;
  humidity?: number;
  pollutants?: {
    pm25?: number;
    pm10?: number;
    o3?: number;
    no2?: number;
    so2?: number;
    co?: number;
  };
  pollen?: PollenData;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  dataSource?: {
    airQuality: "ads" | "simulated";
    pollen: "ads" | "simulated";
    weather?: "open-meteo" | "simulated";
  };
}

export interface HealthOverviewResponse {
  current: HealthMetrics;
  history?: HealthMetrics[];
}
