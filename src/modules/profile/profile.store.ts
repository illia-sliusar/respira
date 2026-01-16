import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  ProfileData,
  UpdateProfileDto,
  AsthmaConfiguration,
  HealthProfile,
  ConditionType,
  RiskTolerance,
  SensitivitySettings,
} from "./types";

// Default health profile for new users
const DEFAULT_HEALTH_PROFILE: HealthProfile = {
  conditionType: "unsure",
  riskTolerance: "medium",
  sensitivities: {
    pollen: 0.5,
    pollution: 0.5,
    pm25: 0.5,
    ozone: 0.5,
  },
};

// Mocked profile data
const MOCK_PROFILE: ProfileData = {
  user: {
    id: "1",
    name: "Alex Doe",
    email: "alex.doe@example.com",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCtsm-pxLuWBC5kQVvoADD2uF6_zIU5uvVeNrXfrkXsFeZu-xtATHiI32UzjDg_fEmRyzdPGI4OHm1jjLScKUvbS4xUlt0m2GlpdtawtgSq9KblUO7JtXhn1nGbDv_R25LwDwfJetMRHJ09hvEGGGIinbrsU8V9timZVtHV3WDATVR5GvTkXGDW6EsLrWm089BUaV20PFDRVUNSfSp1kaPzxKidaUZOCj3GhqsKrQyFtoKB1MvGZhT0RpJv9WyHgQCox4kiwR54oMo",
  },
  allergies: ["Grass Pollen", "Wildfire Smoke", "Ragweed"],
  asthmaConfig: {
    exerciseInduced: true,
    coldAirSensitivity: true,
    thunderstormAsthma: false,
  },
  dietaryRestrictions: ["Dairy", "Peanuts"],
  healthProfile: DEFAULT_HEALTH_PROFILE,
};

interface ProfileState {
  profile: ProfileData;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // Actions
  fetchProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileDto) => Promise<void>;
  addAllergy: (allergy: string) => void;
  removeAllergy: (allergy: string) => void;
  addDietaryRestriction: (restriction: string) => void;
  removeDietaryRestriction: (restriction: string) => void;
  updateAsthmaConfig: (config: Partial<AsthmaConfiguration>) => void;
  // Health profile actions
  updateHealthProfile: (profile: Partial<HealthProfile>) => void;
  setConditionType: (type: ConditionType) => void;
  setRiskTolerance: (tolerance: RiskTolerance) => void;
  updateSensitivities: (sensitivities: Partial<SensitivitySettings>) => void;
  getScoreUserProfile: () => {
    condition_type: ConditionType;
    risk_tolerance: RiskTolerance;
    sensitivities: {
      pollen_sensitivity: number;
      pollution_sensitivity: number;
      pm25_sensitivity: number;
      ozone_sensitivity: number;
    };
  };
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: MOCK_PROFILE,
      isLoading: false,
      isSaving: false,
      error: null,

      fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500));
          // Keep existing profile data (from persistence) but merge with mock user
          const currentProfile = get().profile;
          set({
            profile: {
              ...MOCK_PROFILE,
              healthProfile: currentProfile.healthProfile || DEFAULT_HEALTH_PROFILE,
            },
            isLoading: false,
          });
        } catch {
          set({ error: "Failed to fetch profile", isLoading: false });
        }
      },

      updateProfile: async (data: UpdateProfileDto) => {
        set({ isSaving: true, error: null });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 800));

          const currentProfile = get().profile;
          const updatedProfile: ProfileData = {
            ...currentProfile,
            ...data,
            healthProfile: data.healthProfile
              ? {
                  ...currentProfile.healthProfile,
                  ...data.healthProfile,
                  sensitivities: {
                    ...currentProfile.healthProfile.sensitivities,
                    ...data.healthProfile.sensitivities,
                  },
                }
              : currentProfile.healthProfile,
          };

          set({ profile: updatedProfile, isSaving: false });
        } catch {
          set({ error: "Failed to update profile", isSaving: false });
        }
      },

      addAllergy: (allergy: string) => {
        const currentProfile = get().profile;
        if (!currentProfile.allergies.includes(allergy)) {
          set({
            profile: {
              ...currentProfile,
              allergies: [...currentProfile.allergies, allergy],
            },
          });
        }
      },

      removeAllergy: (allergy: string) => {
        const currentProfile = get().profile;
        set({
          profile: {
            ...currentProfile,
            allergies: currentProfile.allergies.filter((a) => a !== allergy),
          },
        });
      },

      addDietaryRestriction: (restriction: string) => {
        const currentProfile = get().profile;
        if (!currentProfile.dietaryRestrictions.includes(restriction)) {
          set({
            profile: {
              ...currentProfile,
              dietaryRestrictions: [
                ...currentProfile.dietaryRestrictions,
                restriction,
              ],
            },
          });
        }
      },

      removeDietaryRestriction: (restriction: string) => {
        const currentProfile = get().profile;
        set({
          profile: {
            ...currentProfile,
            dietaryRestrictions: currentProfile.dietaryRestrictions.filter(
              (r) => r !== restriction
            ),
          },
        });
      },

      updateAsthmaConfig: (config: Partial<AsthmaConfiguration>) => {
        const currentProfile = get().profile;
        set({
          profile: {
            ...currentProfile,
            asthmaConfig: {
              ...currentProfile.asthmaConfig,
              ...config,
            },
          },
        });
      },

      // Health profile methods
      updateHealthProfile: (healthProfile: Partial<HealthProfile>) => {
        const currentProfile = get().profile;
        set({
          profile: {
            ...currentProfile,
            healthProfile: {
              ...currentProfile.healthProfile,
              ...healthProfile,
              sensitivities: healthProfile.sensitivities
                ? {
                    ...currentProfile.healthProfile.sensitivities,
                    ...healthProfile.sensitivities,
                  }
                : currentProfile.healthProfile.sensitivities,
            },
          },
        });
      },

      setConditionType: (conditionType: ConditionType) => {
        const currentProfile = get().profile;
        set({
          profile: {
            ...currentProfile,
            healthProfile: {
              ...currentProfile.healthProfile,
              conditionType,
            },
          },
        });
      },

      setRiskTolerance: (riskTolerance: RiskTolerance) => {
        const currentProfile = get().profile;
        set({
          profile: {
            ...currentProfile,
            healthProfile: {
              ...currentProfile.healthProfile,
              riskTolerance,
            },
          },
        });
      },

      updateSensitivities: (sensitivities: Partial<SensitivitySettings>) => {
        const currentProfile = get().profile;
        set({
          profile: {
            ...currentProfile,
            healthProfile: {
              ...currentProfile.healthProfile,
              sensitivities: {
                ...currentProfile.healthProfile.sensitivities,
                ...sensitivities,
              },
            },
          },
        });
      },

      // Get user profile formatted for score API
      getScoreUserProfile: () => {
        const { healthProfile } = get().profile;
        return {
          condition_type: healthProfile.conditionType,
          risk_tolerance: healthProfile.riskTolerance,
          sensitivities: {
            pollen_sensitivity: healthProfile.sensitivities.pollen,
            pollution_sensitivity: healthProfile.sensitivities.pollution,
            pm25_sensitivity: healthProfile.sensitivities.pm25,
            ozone_sensitivity: healthProfile.sensitivities.ozone,
          },
        };
      },
    }),
    {
      name: "respira-profile",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        profile: {
          healthProfile: state.profile.healthProfile,
          allergies: state.profile.allergies,
          asthmaConfig: state.profile.asthmaConfig,
          dietaryRestrictions: state.profile.dietaryRestrictions,
        },
      }),
    }
  )
);
