// Profile types

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

// Pollen allergy types based on ADS data
export type PollenAllergyType =
  | "grass"
  | "tree"
  | "weed"
  | "birch"
  | "olive"
  | "alder"
  | "ragweed"
  | "mugwort";

// Asthma trigger types based on ADS data and environmental factors
export type AsthmaTriggerType =
  | "exercise"
  | "cold_air"
  | "thunderstorm"
  | "pm25"
  | "pm10"
  | "ozone"
  | "no2"
  | "so2"
  | "co";

// Allergy/trigger option with label for display
export interface SelectOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

// Available pollen allergy options from ADS data
export const POLLEN_ALLERGY_OPTIONS: SelectOption<PollenAllergyType>[] = [
  { value: "grass", label: "Grass Pollen", description: "Common grass allergens" },
  { value: "tree", label: "Tree Pollen", description: "Combined tree pollen" },
  { value: "weed", label: "Weed Pollen", description: "Combined weed pollen" },
  { value: "birch", label: "Birch Pollen", description: "Birch tree allergen" },
  { value: "olive", label: "Olive Pollen", description: "Olive tree allergen" },
  { value: "alder", label: "Alder Pollen", description: "Alder tree allergen" },
  { value: "ragweed", label: "Ragweed Pollen", description: "Common fall allergen" },
  { value: "mugwort", label: "Mugwort Pollen", description: "Late summer allergen" },
];

// Available asthma trigger options from ADS data and environmental factors
export const ASTHMA_TRIGGER_OPTIONS: SelectOption<AsthmaTriggerType>[] = [
  { value: "exercise", label: "Exercise Induced", description: "Physical activity triggers" },
  { value: "cold_air", label: "Cold Air", description: "Cold temperature sensitivity" },
  { value: "thunderstorm", label: "Thunderstorm", description: "Storm-related asthma" },
  { value: "pm25", label: "PM2.5", description: "Fine particulate matter" },
  { value: "pm10", label: "PM10", description: "Coarse particulate matter" },
  { value: "ozone", label: "Ozone (O₃)", description: "Ground-level ozone" },
  { value: "no2", label: "Nitrogen Dioxide", description: "NO₂ from traffic/combustion" },
  { value: "so2", label: "Sulphur Dioxide", description: "SO₂ from industrial sources" },
  { value: "co", label: "Carbon Monoxide", description: "CO from combustion" },
];

// Legacy AsthmaConfiguration for backward compatibility
export interface AsthmaConfiguration {
  exerciseInduced: boolean;
  coldAirSensitivity: boolean;
  thunderstormAsthma: boolean;
}

// New trigger-based configuration
export interface TriggerConfiguration {
  pollenAllergies: PollenAllergyType[];
  asthmaTriggers: AsthmaTriggerType[];
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
  pollenAllergies: PollenAllergyType[];
  asthmaTriggers: AsthmaTriggerType[];
  dietaryRestrictions: string[];
  healthProfile: HealthProfile;
}

export interface UpdateProfileDto {
  pollenAllergies?: PollenAllergyType[];
  asthmaTriggers?: AsthmaTriggerType[];
  dietaryRestrictions?: string[];
  healthProfile?: Partial<HealthProfile>;
}

export interface UpdateUserDetailsDto {
  name?: string;
  email?: string;
  avatarUrl?: string;
}

