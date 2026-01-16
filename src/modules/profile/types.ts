// Profile types

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface AsthmaConfiguration {
  exerciseInduced: boolean;
  coldAirSensitivity: boolean;
  thunderstormAsthma: boolean;
}

// Health condition type for score calculation
export type ConditionType = "asthma" | "allergy" | "both" | "unsure";

// Risk tolerance level
export type RiskTolerance = "low" | "medium" | "high";

// Sensitivity settings for score personalization (0-1 scale)
export interface SensitivitySettings {
  pollen: number;
  pollution: number;
  pm25: number;
  ozone: number;
}

// Health profile for score calculation
export interface HealthProfile {
  conditionType: ConditionType;
  riskTolerance: RiskTolerance;
  sensitivities: SensitivitySettings;
}

export interface ProfileData {
  user: UserProfile;
  allergies: string[];
  asthmaConfig: AsthmaConfiguration;
  dietaryRestrictions: string[];
  healthProfile: HealthProfile;
}

export interface UpdateProfileDto {
  allergies?: string[];
  asthmaConfig?: AsthmaConfiguration;
  dietaryRestrictions?: string[];
  healthProfile?: Partial<HealthProfile>;
}
