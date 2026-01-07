import { create } from "zustand";
import type { ProfileData, UpdateProfileDto, AsthmaConfiguration } from "./types";

// Mocked profile data
const MOCK_PROFILE: ProfileData = {
  user: {
    id: "1",
    name: "Alex Doe",
    email: "alex.doe@example.com",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtsm-pxLuWBC5kQVvoADD2uF6_zIU5uvVeNrXfrkXsFeZu-xtATHiI32UzjDg_fEmRyzdPGI4OHm1jjLScKUvbS4xUlt0m2GlpdtawtgSq9KblUO7JtXhn1nGbDv_R25LwDwfJetMRHJ09hvEGGGIinbrsU8V9timZVtHV3WDATVR5GvTkXGDW6EsLrWm089BUaV20PFDRVUNSfSp1kaPzxKidaUZOCj3GhqsKrQyFtoKB1MvGZhT0RpJv9WyHgQCox4kiwR54oMo",
  },
  allergies: ["Grass Pollen", "Wildfire Smoke", "Ragweed"],
  asthmaConfig: {
    exerciseInduced: true,
    coldAirSensitivity: true,
    thunderstormAsthma: false,
  },
  dietaryRestrictions: ["Dairy", "Peanuts"],
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
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: MOCK_PROFILE,
  isLoading: false,
  isSaving: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({ profile: MOCK_PROFILE, isLoading: false });
    } catch (error) {
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
      };

      set({ profile: updatedProfile, isSaving: false });
    } catch (error) {
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
          dietaryRestrictions: [...currentProfile.dietaryRestrictions, restriction],
        },
      });
    }
  },

  removeDietaryRestriction: (restriction: string) => {
    const currentProfile = get().profile;
    set({
      profile: {
        ...currentProfile,
        dietaryRestrictions: currentProfile.dietaryRestrictions.filter((r) => r !== restriction),
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
}));
