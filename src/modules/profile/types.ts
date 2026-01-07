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

export interface ProfileData {
  user: UserProfile;
  allergies: string[];
  asthmaConfig: AsthmaConfiguration;
  dietaryRestrictions: string[];
}

export interface UpdateProfileDto {
  allergies?: string[];
  asthmaConfig?: AsthmaConfiguration;
  dietaryRestrictions?: string[];
}
