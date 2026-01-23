import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClient } from "@/src/lib/axios";
import { API_ENDPOINTS } from "@/src/lib/constants";
import type {
  ProfileData,
  UpdateProfileDto,
  UpdateUserDetailsDto,
  HealthProfile,
  ConditionType,
  RiskTolerance,
  SensitivitySettings,
  PollenAllergyType,
  AsthmaTriggerType,
  AsthmaSeverity,
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

// Default profile data
const DEFAULT_PROFILE: ProfileData = {
  user: {
    id: "",
    name: "",
    email: "",
    avatarUrl: undefined,
  },
  pollenAllergies: [],
  asthmaSeverity: "none",
  asthmaTriggers: [],
  dietaryRestrictions: [],
  healthProfile: DEFAULT_HEALTH_PROFILE,
};

// API response types
interface UserApiResponse {
  user: {
    id: string;
    email: string;
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    image: string | null;
    role: string;
  };
}

interface HealthProfileApiResponse {
  healthProfile: {
    pollenAllergies: string[];
    asthmaSeverity: string;
    asthmaTriggers: string[];
    dietaryRestrictions: string[];
    conditionType: string;
    riskTolerance: string;
    sensitivities: {
      pollen: number;
      pollution: number;
      pm25: number;
      ozone: number;
    };
  };
}

interface ProfileState {
  profile: ProfileData;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  hasCompletedOnboarding: boolean;

  // Actions
  fetchProfile: () => Promise<void>;
  fetchHealthProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileDto) => Promise<void>;
  updateUserDetails: (data: UpdateUserDetailsDto) => Promise<void>;
  saveHealthProfile: () => Promise<void>;
  completeOnboarding: () => void;

  // Pollen allergy actions
  togglePollenAllergy: (allergy: PollenAllergyType) => void;
  setPollenAllergies: (allergies: PollenAllergyType[]) => void;

  // Asthma actions
  setAsthmaSeverity: (severity: AsthmaSeverity) => void;
  toggleAsthmaTrigger: (trigger: AsthmaTriggerType) => void;
  setAsthmaTriggers: (triggers: AsthmaTriggerType[]) => void;

  // Dietary restriction actions
  addDietaryRestriction: (restriction: string) => void;
  removeDietaryRestriction: (restriction: string) => void;

  // Avatar actions (local storage only)
  setLocalAvatar: (avatarUrl: string | undefined) => void;

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
    pollen_allergies: PollenAllergyType[];
    asthma_triggers: AsthmaTriggerType[];
  };
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_PROFILE,
      isLoading: false,
      isSaving: false,
      error: null,
      hasCompletedOnboarding: false,

      // Mark onboarding as completed
      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true });
      },

      // Fetch user profile from backend
      fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
          // Fetch both user profile and health profile in parallel
          const [userResponse, healthResponse] = await Promise.all([
            apiClient.get<UserApiResponse>(API_ENDPOINTS.USER.PROFILE),
            apiClient.get<HealthProfileApiResponse>(API_ENDPOINTS.USER.HEALTH_PROFILE),
          ]);

          const apiUser = userResponse.data.user;
          const apiHealth = healthResponse.data.healthProfile;
          const currentProfile = get().profile;

          set({
            profile: {
              user: {
                id: apiUser.id,
                name: apiUser.name || "",
                firstName: apiUser.firstName || undefined,
                lastName: apiUser.lastName || undefined,
                email: apiUser.email,
                // Keep local avatar if exists, otherwise use backend avatar
                avatarUrl: currentProfile.user.avatarUrl || apiUser.image || undefined,
              },
              pollenAllergies: apiHealth.pollenAllergies as PollenAllergyType[],
              asthmaSeverity: (apiHealth.asthmaSeverity as AsthmaSeverity) ?? "none",
              asthmaTriggers: apiHealth.asthmaTriggers as AsthmaTriggerType[],
              dietaryRestrictions: apiHealth.dietaryRestrictions,
              healthProfile: {
                conditionType: apiHealth.conditionType as ConditionType,
                riskTolerance: apiHealth.riskTolerance as RiskTolerance,
                sensitivities: apiHealth.sensitivities,
              },
            },
            isLoading: false,
          });
        } catch {
          // If health profile fetch fails, still try to get user profile
          try {
            const userResponse = await apiClient.get<UserApiResponse>(API_ENDPOINTS.USER.PROFILE);
            const apiUser = userResponse.data.user;
            const currentProfile = get().profile;

            set({
              profile: {
                ...currentProfile,
                user: {
                  id: apiUser.id,
                  name: apiUser.name || "",
                  firstName: apiUser.firstName || undefined,
                  lastName: apiUser.lastName || undefined,
                  email: apiUser.email,
                  // Keep local avatar if exists
                  avatarUrl: currentProfile.user.avatarUrl || apiUser.image || undefined,
                },
              },
              isLoading: false,
            });
          } catch {
            set({ error: "Failed to fetch profile", isLoading: false });
          }
        }
      },

      // Fetch only health profile from backend
      fetchHealthProfile: async () => {
        try {
          const response = await apiClient.get<HealthProfileApiResponse>(
            API_ENDPOINTS.USER.HEALTH_PROFILE
          );
          const apiHealth = response.data.healthProfile;
          const currentProfile = get().profile;

          set({
            profile: {
              ...currentProfile,
              pollenAllergies: apiHealth.pollenAllergies as PollenAllergyType[],
              asthmaSeverity: (apiHealth.asthmaSeverity as AsthmaSeverity) ?? "none",
              asthmaTriggers: apiHealth.asthmaTriggers as AsthmaTriggerType[],
              dietaryRestrictions: apiHealth.dietaryRestrictions,
              healthProfile: {
                conditionType: apiHealth.conditionType as ConditionType,
                riskTolerance: apiHealth.riskTolerance as RiskTolerance,
                sensitivities: apiHealth.sensitivities,
              },
            },
          });
        } catch {
          // Silently fail - use local data
        }
      },

      // Update health profile on backend
      updateProfile: async (data: UpdateProfileDto) => {
        set({ isSaving: true, error: null });
        try {
          // Build the API payload
          const payload: {
            pollenAllergies?: string[];
            asthmaSeverity?: string;
            asthmaTriggers?: string[];
            dietaryRestrictions?: string[];
            conditionType?: string;
            riskTolerance?: string;
            sensitivities?: {
              pollen?: number;
              pollution?: number;
              pm25?: number;
              ozone?: number;
            };
          } = {};

          if (data.pollenAllergies !== undefined) {
            payload.pollenAllergies = data.pollenAllergies;
          }
          if (data.asthmaSeverity !== undefined) {
            payload.asthmaSeverity = data.asthmaSeverity;
          }
          if (data.asthmaTriggers !== undefined) {
            payload.asthmaTriggers = data.asthmaTriggers;
          }
          if (data.dietaryRestrictions !== undefined) {
            payload.dietaryRestrictions = data.dietaryRestrictions;
          }
          if (data.healthProfile?.conditionType !== undefined) {
            payload.conditionType = data.healthProfile.conditionType;
          }
          if (data.healthProfile?.riskTolerance !== undefined) {
            payload.riskTolerance = data.healthProfile.riskTolerance;
          }
          if (data.healthProfile?.sensitivities !== undefined) {
            payload.sensitivities = data.healthProfile.sensitivities;
          }

          const response = await apiClient.patch<HealthProfileApiResponse>(
            API_ENDPOINTS.USER.HEALTH_PROFILE,
            payload
          );

          const apiHealth = response.data.healthProfile;
          const currentProfile = get().profile;

          set({
            profile: {
              ...currentProfile,
              pollenAllergies: apiHealth.pollenAllergies as PollenAllergyType[],
              asthmaSeverity: (apiHealth.asthmaSeverity as AsthmaSeverity) ?? "none",
              asthmaTriggers: apiHealth.asthmaTriggers as AsthmaTriggerType[],
              dietaryRestrictions: apiHealth.dietaryRestrictions,
              healthProfile: {
                conditionType: apiHealth.conditionType as ConditionType,
                riskTolerance: apiHealth.riskTolerance as RiskTolerance,
                sensitivities: apiHealth.sensitivities,
              },
            },
            isSaving: false,
          });
        } catch {
          set({ error: "Failed to update profile", isSaving: false });
          throw new Error("Failed to update profile");
        }
      },

      // Update user details (name, firstName, lastName, avatar) on backend
      updateUserDetails: async (data: UpdateUserDetailsDto) => {
        set({ isSaving: true, error: null });
        try {
          const payload: { name?: string; firstName?: string | null; lastName?: string | null; image?: string | null } = {};
          if (data.name !== undefined) {
            payload.name = data.name;
          }
          if (data.firstName !== undefined) {
            payload.firstName = data.firstName;
          }
          if (data.lastName !== undefined) {
            payload.lastName = data.lastName;
          }
          if (data.avatarUrl !== undefined) {
            payload.image = data.avatarUrl || null;
          }

          const response = await apiClient.patch<UserApiResponse>(
            API_ENDPOINTS.USER.UPDATE,
            payload
          );

          const apiUser = response.data.user;
          const currentProfile = get().profile;

          set({
            profile: {
              ...currentProfile,
              user: {
                ...currentProfile.user,
                id: apiUser.id,
                name: apiUser.name || "",
                firstName: apiUser.firstName || undefined,
                lastName: apiUser.lastName || undefined,
                email: apiUser.email,
                avatarUrl: apiUser.image || undefined,
              },
            },
            isSaving: false,
          });
        } catch {
          set({ error: "Failed to update user details", isSaving: false });
          throw new Error("Failed to update user details");
        }
      },

      // Save current health profile to backend
      saveHealthProfile: async () => {
        const { profile } = get();
        set({ isSaving: true, error: null });

        try {
          const payload = {
            pollenAllergies: profile.pollenAllergies,
            asthmaSeverity: profile.asthmaSeverity,
            asthmaTriggers: profile.asthmaTriggers,
            dietaryRestrictions: profile.dietaryRestrictions,
            conditionType: profile.healthProfile.conditionType,
            riskTolerance: profile.healthProfile.riskTolerance,
            sensitivities: profile.healthProfile.sensitivities,
          };

          await apiClient.patch<HealthProfileApiResponse>(
            API_ENDPOINTS.USER.HEALTH_PROFILE,
            payload
          );

          set({ isSaving: false });
        } catch {
          set({ error: "Failed to save health profile", isSaving: false });
          throw new Error("Failed to save health profile");
        }
      },

      // Pollen allergy methods (local state updates)
      togglePollenAllergy: (allergy: PollenAllergyType) => {
        const currentProfile = get().profile;
        const isSelected = currentProfile.pollenAllergies.includes(allergy);

        let newAllergies: PollenAllergyType[];

        if (isSelected) {
          // Removing the allergy
          newAllergies = currentProfile.pollenAllergies.filter((a) => a !== allergy);
        } else if (allergy === "not_sure") {
          // Selecting "not_sure" clears all other allergies
          newAllergies = ["not_sure"];
        } else {
          // Selecting a specific allergy removes "not_sure"
          newAllergies = [
            ...currentProfile.pollenAllergies.filter((a) => a !== "not_sure"),
            allergy,
          ];
        }

        set({
          profile: {
            ...currentProfile,
            pollenAllergies: newAllergies,
          },
        });
      },

      setPollenAllergies: (allergies: PollenAllergyType[]) => {
        const currentProfile = get().profile;
        set({
          profile: {
            ...currentProfile,
            pollenAllergies: allergies,
          },
        });
      },

      // Asthma methods (local state updates)
      setAsthmaSeverity: (severity: AsthmaSeverity) => {
        const currentProfile = get().profile;
        set({
          profile: {
            ...currentProfile,
            asthmaSeverity: severity,
            // Clear triggers when setting to "none"
            asthmaTriggers: severity === "none" ? [] : currentProfile.asthmaTriggers,
          },
        });
      },

      toggleAsthmaTrigger: (trigger: AsthmaTriggerType) => {
        const currentProfile = get().profile;
        const isSelected = currentProfile.asthmaTriggers.includes(trigger);

        set({
          profile: {
            ...currentProfile,
            asthmaTriggers: isSelected
              ? currentProfile.asthmaTriggers.filter((t) => t !== trigger)
              : [...currentProfile.asthmaTriggers, trigger],
          },
        });
      },

      setAsthmaTriggers: (triggers: AsthmaTriggerType[]) => {
        const currentProfile = get().profile;
        set({
          profile: {
            ...currentProfile,
            asthmaTriggers: triggers,
          },
        });
      },

      // Dietary restriction methods (local state updates)
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

      // Avatar methods (local storage only - not synced to backend)
      setLocalAvatar: (avatarUrl: string | undefined) => {
        const currentProfile = get().profile;
        set({
          profile: {
            ...currentProfile,
            user: {
              ...currentProfile.user,
              avatarUrl,
            },
          },
        });
      },

      // Health profile methods (local state updates)
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
        const { healthProfile, pollenAllergies, asthmaTriggers } = get().profile;
        return {
          condition_type: healthProfile.conditionType,
          risk_tolerance: healthProfile.riskTolerance,
          sensitivities: {
            pollen_sensitivity: healthProfile.sensitivities.pollen,
            pollution_sensitivity: healthProfile.sensitivities.pollution,
            pm25_sensitivity: healthProfile.sensitivities.pm25,
            ozone_sensitivity: healthProfile.sensitivities.ozone,
          },
          pollen_allergies: pollenAllergies,
          asthma_triggers: asthmaTriggers,
        };
      },
    }),
    {
      name: "respira-profile",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        profile: {
          user: {
            avatarUrl: state.profile?.user?.avatarUrl, // Local avatar persisted
          },
          healthProfile: state.profile?.healthProfile ?? DEFAULT_HEALTH_PROFILE,
          pollenAllergies: state.profile?.pollenAllergies ?? [],
          asthmaSeverity: state.profile?.asthmaSeverity ?? "none",
          asthmaTriggers: state.profile?.asthmaTriggers ?? [],
          dietaryRestrictions: state.profile?.dietaryRestrictions ?? [],
        },
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<ProfileState> | undefined;
        return {
          ...currentState,
          hasCompletedOnboarding: persisted?.hasCompletedOnboarding ?? false,
          profile: {
            ...DEFAULT_PROFILE,
            ...currentState.profile,
            user: {
              ...DEFAULT_PROFILE.user,
              ...currentState.profile?.user,
              avatarUrl: persisted?.profile?.user?.avatarUrl ?? currentState.profile?.user?.avatarUrl,
            },
            healthProfile: persisted?.profile?.healthProfile ?? currentState.profile?.healthProfile ?? DEFAULT_HEALTH_PROFILE,
            pollenAllergies: persisted?.profile?.pollenAllergies ?? currentState.profile?.pollenAllergies ?? [],
            asthmaSeverity: persisted?.profile?.asthmaSeverity ?? currentState.profile?.asthmaSeverity ?? "none",
            asthmaTriggers: persisted?.profile?.asthmaTriggers ?? currentState.profile?.asthmaTriggers ?? [],
            dietaryRestrictions: persisted?.profile?.dietaryRestrictions ?? currentState.profile?.dietaryRestrictions ?? [],
          },
        };
      },
    }
  )
);
