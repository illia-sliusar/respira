import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 15 minutes threshold in milliseconds
const REFRESH_THRESHOLD_MS = 15 * 60 * 1000;

// Debounce threshold - minimum time between refreshes (5 seconds)
const DEBOUNCE_THRESHOLD_MS = 5 * 1000;

interface ScoreRefreshState {
  lastRefreshTimestamp: number | null;
  isRefreshing: boolean;
  refreshError: string | null;

  // Computed
  shouldRefresh: () => boolean;
  getTimeSinceLastRefresh: () => number | null;

  // Actions
  setLastRefresh: () => void;
  setRefreshing: (isRefreshing: boolean) => void;
  setRefreshError: (error: string | null) => void;
  reset: () => void;
}

export const useScoreRefreshStore = create<ScoreRefreshState>()(
  persist(
    (set, get) => ({
      lastRefreshTimestamp: null,
      isRefreshing: false,
      refreshError: null,

      shouldRefresh: () => {
        const { lastRefreshTimestamp, isRefreshing } = get();

        // Don't refresh if already refreshing
        if (isRefreshing) return false;

        // Always refresh if never refreshed
        if (lastRefreshTimestamp === null) return true;

        const elapsed = Date.now() - lastRefreshTimestamp;

        // Debounce: don't refresh if less than 5 seconds since last refresh
        if (elapsed < DEBOUNCE_THRESHOLD_MS) return false;

        // Refresh if more than 15 minutes elapsed
        return elapsed >= REFRESH_THRESHOLD_MS;
      },

      getTimeSinceLastRefresh: () => {
        const { lastRefreshTimestamp } = get();
        if (lastRefreshTimestamp === null) return null;
        return Date.now() - lastRefreshTimestamp;
      },

      setLastRefresh: () => {
        set({
          lastRefreshTimestamp: Date.now(),
          refreshError: null,
        });
      },

      setRefreshing: (isRefreshing: boolean) => {
        set({ isRefreshing });
      },

      setRefreshError: (error: string | null) => {
        set({ refreshError: error, isRefreshing: false });
      },

      reset: () => {
        set({
          lastRefreshTimestamp: null,
          isRefreshing: false,
          refreshError: null,
        });
      },
    }),
    {
      name: "score-refresh-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        lastRefreshTimestamp: state.lastRefreshTimestamp,
      }),
    }
  )
);
