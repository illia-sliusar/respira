import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./constants";
import { useLocationStore } from "@/src/modules/location";
import { useScoreRefreshStore } from "@/src/modules/score";
import { useDataSnapshotStore } from "./data-snapshot.store";
import {
  detectChanges,
  type CurrentEnvironmentData,
  type ChangeDetectionResult,
} from "./data-change-detector";

/**
 * Refresh reason type
 */
export type RefreshReason = "appForeground" | "userPull" | "timer" | "manual";

/**
 * Result of a refresh operation
 */
export interface RefreshResult {
  success: boolean;
  reason: RefreshReason;
  timestamp: number;
  refreshed: {
    health: boolean;
    score: boolean;
    advisor: boolean;
  };
  changeDetection: ChangeDetectionResult | null;
  error?: string;
}

/**
 * Options for refresh orchestration
 */
interface RefreshOrchestratorOptions {
  /**
   * Callback to get current environmental data after fetching
   * This should be called after health/score data is available
   */
  getCurrentData?: () => CurrentEnvironmentData | null;
}

/**
 * Hook to orchestrate data refresh across multiple screens
 *
 * Coordinates refresh of health, score, and advisor data while:
 * - Always refreshing health (cheap external API)
 * - Always refreshing score (free deterministic calculation)
 * - Only refreshing advisor when data significantly changed (expensive OpenAI call)
 */
export function useRefreshOrchestrator(options: RefreshOrchestratorOptions = {}) {
  const queryClient = useQueryClient();
  const getLocationOrDefault = useLocationStore((s) => s.getLocationOrDefault);

  // Score refresh store
  const shouldRefreshScore = useScoreRefreshStore((s) => s.shouldRefresh);
  const setScoreLastRefresh = useScoreRefreshStore((s) => s.setLastRefresh);

  // Data snapshot store
  const snapshot = useDataSnapshotStore((s) => s.snapshot);
  const captureSnapshot = useDataSnapshotStore((s) => s.captureSnapshot);
  const markAdvisorRefreshed = useDataSnapshotStore((s) => s.markAdvisorRefreshed);

  /**
   * Execute a coordinated refresh of all data
   */
  const executeRefresh = useCallback(
    async (reason: RefreshReason): Promise<RefreshResult> => {
      const location = getLocationOrDefault();
      const lat = location.coordinates.latitude;
      const lon = location.coordinates.longitude;
      const isUserRequested = reason === "userPull";

      const result: RefreshResult = {
        success: false,
        reason,
        timestamp: Date.now(),
        refreshed: {
          health: false,
          score: false,
          advisor: false,
        },
        changeDetection: null,
      };

      try {
        // Step 1: Always refresh health and score (cheap/free)
        // Invalidate queries to trigger refetch
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.HEALTH.CURRENT(lat, lon),
          }),
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.SCORE.PERSONALIZED(lat, lon),
          }),
        ]);

        result.refreshed.health = true;
        result.refreshed.score = true;
        setScoreLastRefresh();

        // Step 2: Get current data for change detection
        // Wait a bit for queries to complete
        await new Promise((resolve) => setTimeout(resolve, 100));

        const currentData = options.getCurrentData?.();

        // Step 3: Detect changes
        if (currentData) {
          const changeResult = detectChanges(
            currentData,
            snapshot?.environment ?? null,
            snapshot?.lastAdvisorRefresh ?? null,
            isUserRequested
          );

          result.changeDetection = changeResult;

          // Step 4: Refresh advisor only if needed
          if (changeResult.shouldRefreshAdvisor) {
            await queryClient.invalidateQueries({
              queryKey: QUERY_KEYS.ADVISOR.DATA(lat, lon),
            });
            result.refreshed.advisor = true;
            markAdvisorRefreshed();
          }

          // Step 5: Update snapshot with current data
          captureSnapshot(currentData);
        } else {
          // No current data available - refresh advisor anyway on user request
          if (isUserRequested) {
            await queryClient.invalidateQueries({
              queryKey: QUERY_KEYS.ADVISOR.DATA(lat, lon),
            });
            result.refreshed.advisor = true;
            markAdvisorRefreshed();
          }
        }

        result.success = true;
      } catch (error) {
        result.error = error instanceof Error ? error.message : "Unknown error";
      }

      return result;
    },
    [
      queryClient,
      getLocationOrDefault,
      setScoreLastRefresh,
      snapshot,
      captureSnapshot,
      markAdvisorRefreshed,
      options,
    ]
  );

  /**
   * Refresh only on app foreground (respects 15-min threshold)
   */
  const refreshOnForeground = useCallback(async (): Promise<RefreshResult | null> => {
    if (!shouldRefreshScore()) {
      return null; // Skip refresh - not enough time elapsed
    }
    return executeRefresh("appForeground");
  }, [shouldRefreshScore, executeRefresh]);

  /**
   * Manual refresh (always executes, user-initiated)
   */
  const refreshManual = useCallback(
    async (): Promise<RefreshResult> => {
      return executeRefresh("userPull");
    },
    [executeRefresh]
  );

  /**
   * Force refresh advisor only (for specific use cases)
   */
  const forceRefreshAdvisor = useCallback(async (): Promise<void> => {
    const location = getLocationOrDefault();
    await queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.ADVISOR.DATA(
        location.coordinates.latitude,
        location.coordinates.longitude
      ),
    });
    markAdvisorRefreshed();
  }, [queryClient, getLocationOrDefault, markAdvisorRefreshed]);

  return {
    executeRefresh,
    refreshOnForeground,
    refreshManual,
    forceRefreshAdvisor,
    snapshot,
  };
}
