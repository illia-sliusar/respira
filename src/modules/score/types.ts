// Score API types

export type ConditionType = "asthma" | "allergy" | "both" | "unsure";
export type RiskTolerance = "low" | "medium" | "high";
export type DominantDriver = "pollen" | "pollution" | "weather" | "mixed";
export type RiskCategory = "low" | "moderate" | "high";

export interface UserSensitivities {
  pollen_sensitivity: number; // 0-1
  pollution_sensitivity: number; // 0-1
  pm25_sensitivity: number; // 0-1
  ozone_sensitivity: number; // 0-1
}

export interface ScoreUserProfile {
  condition_type: ConditionType;
  risk_tolerance: RiskTolerance;
  sensitivities: UserSensitivities;
}

export interface ScoreDrivers {
  dominant_driver: DominantDriver;
  category: RiskCategory;
}

export interface ScoreFactor {
  name: string;
  impact_0_1: number;
}

export interface ScoreWeights {
  wP: number;
  wA: number;
  wW: number;
}

export interface RawComponents {
  pollenRisk_0_1: number;
  pollutionRisk_0_1: number;
  weatherRisk_0_1: number;
  symAdj_0_1: number;
  raw_0_1: number;
  weights: ScoreWeights;
}

export interface ScoreResult {
  score_1_10: number;
  confidence_0_1: number;
  drivers: ScoreDrivers;
  top_factors: ScoreFactor[];
  raw_components: RawComponents;
  data_issues?: string[];
}

export interface LocationInfo {
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface EnvironmentalData {
  aqi: number;
  temperature: number;
  humidity: number;
  pollen_index: number;
  dominant_allergen?: string;
  data_source?: {
    airQuality: "ads" | "simulated";
    pollen: "ads" | "simulated";
  };
}

export interface PersonalizedScoreResponse {
  score: ScoreResult;
  location: LocationInfo;
  environmental_data: EnvironmentalData;
  timestamp: string;
}
