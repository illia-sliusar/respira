import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Environmental data snapshot for change detection
 */
export interface EnvironmentSnapshot {
  score: number;
  aqi: number;
  pollenIndex: number;
  dominantAllergen: string | null;
  dominantDriver: string;
  temperature: number;
  humidity: number;
  timestamp: number;
}

/**
 * Full data snapshot including metadata
 */
export interface DataSnapshot {
  environment: EnvironmentSnapshot;
  lastAdvisorRefresh: number;
  version: number;
}

interface DataSnapshotState {
  snapshot: DataSnapshot | null;

  // Actions
  captureSnapshot: (data: Partial<EnvironmentSnapshot>) => void;
  markAdvisorRefreshed: () => void;
  getSnapshot: () => DataSnapshot | null;
  reset: () => void;
}

const SNAPSHOT_VERSION = 1;

export const useDataSnapshotStore = create<DataSnapshotState>()(
  persist(
    (set, get) => ({
      snapshot: null,

      captureSnapshot: (data: Partial<EnvironmentSnapshot>) => {
        const current = get().snapshot;

        set({
          snapshot: {
            environment: {
              score: data.score ?? current?.environment.score ?? 0,
              aqi: data.aqi ?? current?.environment.aqi ?? 0,
              pollenIndex: data.pollenIndex ?? current?.environment.pollenIndex ?? 0,
              dominantAllergen: data.dominantAllergen ?? current?.environment.dominantAllergen ?? null,
              dominantDriver: data.dominantDriver ?? current?.environment.dominantDriver ?? "mixed",
              temperature: data.temperature ?? current?.environment.temperature ?? 20,
              humidity: data.humidity ?? current?.environment.humidity ?? 50,
              timestamp: Date.now(),
            },
            lastAdvisorRefresh: current?.lastAdvisorRefresh ?? 0,
            version: SNAPSHOT_VERSION,
          },
        });
      },

      markAdvisorRefreshed: () => {
        const current = get().snapshot;
        if (current) {
          set({
            snapshot: {
              ...current,
              lastAdvisorRefresh: Date.now(),
            },
          });
        }
      },

      getSnapshot: () => get().snapshot,

      reset: () => {
        set({ snapshot: null });
      },
    }),
    {
      name: "data-snapshot-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
