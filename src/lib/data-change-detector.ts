import type { EnvironmentSnapshot } from "./data-snapshot.store";

/**
 * Change detection thresholds
 */
export const CHANGE_THRESHOLDS = {
  // Significant changes (trigger advisor refresh)
  SCORE_DELTA: 2, // Score change >= 2 points
  AQI_DELTA: 15, // AQI change >= 15 points
  POLLEN_INDEX_DELTA: 2, // Pollen index change >= 2 levels (0-5 scale)

  // Moderate changes (don't trigger advisor refresh)
  TEMPERATURE_DELTA: 5, // Temperature change >= 5°C
  HUMIDITY_DELTA: 10, // Humidity change >= 10%

  // Time thresholds
  ADVISOR_FORCE_REFRESH_MS: 30 * 60 * 1000, // Force advisor refresh after 30 min
} as const;

/**
 * Types of changes detected
 */
export type ChangeType = "significant" | "moderate" | "minor" | "none";

/**
 * Changed field information
 */
export interface ChangedField {
  field: string;
  oldValue: unknown;
  newValue: unknown;
  delta?: number;
}

/**
 * Result of change detection
 */
export interface ChangeDetectionResult {
  hasChange: boolean;
  changeType: ChangeType;
  changedFields: ChangedField[];

  // Specific flags for decision making
  shouldRefreshAdvisor: boolean;
  changeReason?: string;

  // Deltas for debugging
  deltas: {
    score?: number;
    aqi?: number;
    pollenIndex?: number;
    temperature?: number;
    humidity?: number;
  };
}

/**
 * Current environmental data for comparison
 */
export interface CurrentEnvironmentData {
  score: number;
  aqi: number;
  pollenIndex: number;
  dominantAllergen?: string | null;
  dominantDriver: string;
  temperature: number;
  humidity: number;
}

/**
 * Detect changes between current data and previous snapshot
 */
export function detectChanges(
  current: CurrentEnvironmentData,
  previous: EnvironmentSnapshot | null,
  lastAdvisorRefresh: number | null,
  userRequestedRefresh: boolean = false
): ChangeDetectionResult {
  // If no previous snapshot, this is the first data - significant change
  if (!previous) {
    return {
      hasChange: true,
      changeType: "significant",
      changedFields: [{ field: "initial", oldValue: null, newValue: "first_load" }],
      shouldRefreshAdvisor: true,
      changeReason: "initial_load",
      deltas: {},
    };
  }

  const changedFields: ChangedField[] = [];
  const deltas: ChangeDetectionResult["deltas"] = {};
  let changeType: ChangeType = "none";
  let shouldRefreshAdvisor = false;
  let changeReason: string | undefined;

  // Always refresh on user request (pull-to-refresh)
  if (userRequestedRefresh) {
    return {
      hasChange: true,
      changeType: "significant",
      changedFields: [{ field: "user_request", oldValue: null, newValue: "manual" }],
      shouldRefreshAdvisor: true,
      changeReason: "user_requested",
      deltas: {},
    };
  }

  // Level 1: Check significant numeric changes
  const scoreDelta = Math.abs(current.score - previous.score);
  if (scoreDelta >= CHANGE_THRESHOLDS.SCORE_DELTA) {
    changedFields.push({
      field: "score",
      oldValue: previous.score,
      newValue: current.score,
      delta: scoreDelta,
    });
    deltas.score = scoreDelta;
    changeType = "significant";
    shouldRefreshAdvisor = true;
    changeReason = "score_changed";
  }

  const aqiDelta = Math.abs(current.aqi - previous.aqi);
  if (aqiDelta >= CHANGE_THRESHOLDS.AQI_DELTA) {
    changedFields.push({
      field: "aqi",
      oldValue: previous.aqi,
      newValue: current.aqi,
      delta: aqiDelta,
    });
    deltas.aqi = aqiDelta;
    changeType = "significant";
    shouldRefreshAdvisor = true;
    if (!changeReason) changeReason = "aqi_changed";
  }

  const pollenDelta = Math.abs(current.pollenIndex - previous.pollenIndex);
  if (pollenDelta >= CHANGE_THRESHOLDS.POLLEN_INDEX_DELTA) {
    changedFields.push({
      field: "pollenIndex",
      oldValue: previous.pollenIndex,
      newValue: current.pollenIndex,
      delta: pollenDelta,
    });
    deltas.pollenIndex = pollenDelta;
    changeType = "significant";
    shouldRefreshAdvisor = true;
    if (!changeReason) changeReason = "pollen_changed";
  }

  // Level 2: Check categorical changes
  if (current.dominantDriver !== previous.dominantDriver) {
    changedFields.push({
      field: "dominantDriver",
      oldValue: previous.dominantDriver,
      newValue: current.dominantDriver,
    });
    changeType = "significant";
    shouldRefreshAdvisor = true;
    if (!changeReason) changeReason = "dominant_driver_changed";
  }

  if (current.dominantAllergen !== previous.dominantAllergen) {
    changedFields.push({
      field: "dominantAllergen",
      oldValue: previous.dominantAllergen,
      newValue: current.dominantAllergen,
    });
    changeType = "significant";
    shouldRefreshAdvisor = true;
    if (!changeReason) changeReason = "allergen_changed";
  }

  // Level 3: Check moderate changes (don't trigger advisor refresh)
  const tempDelta = Math.abs(current.temperature - previous.temperature);
  if (tempDelta >= CHANGE_THRESHOLDS.TEMPERATURE_DELTA) {
    changedFields.push({
      field: "temperature",
      oldValue: previous.temperature,
      newValue: current.temperature,
      delta: tempDelta,
    });
    deltas.temperature = tempDelta;
    if (changeType === "none") changeType = "moderate";
  }

  const humidityDelta = Math.abs(current.humidity - previous.humidity);
  if (humidityDelta >= CHANGE_THRESHOLDS.HUMIDITY_DELTA) {
    changedFields.push({
      field: "humidity",
      oldValue: previous.humidity,
      newValue: current.humidity,
      delta: humidityDelta,
    });
    deltas.humidity = humidityDelta;
    if (changeType === "none") changeType = "moderate";
  }

  // Time-based force refresh for advisor (30 min since last advisor refresh)
  if (
    !shouldRefreshAdvisor &&
    lastAdvisorRefresh &&
    Date.now() - lastAdvisorRefresh > CHANGE_THRESHOLDS.ADVISOR_FORCE_REFRESH_MS
  ) {
    shouldRefreshAdvisor = true;
    changeReason = "time_threshold";
  }

  // Minor changes detection (any small numeric fluctuation)
  if (changedFields.length === 0) {
    // Check for any changes at all
    if (
      scoreDelta > 0 ||
      aqiDelta > 0 ||
      pollenDelta > 0 ||
      tempDelta > 0 ||
      humidityDelta > 0
    ) {
      changeType = "minor";
    }
  }

  return {
    hasChange: changedFields.length > 0 || changeType !== "none",
    changeType,
    changedFields,
    shouldRefreshAdvisor,
    changeReason,
    deltas,
  };
}

/**
 * Helper hook-style function to check if advisor should be refreshed
 */
export function shouldRefreshAdvisor(
  current: CurrentEnvironmentData | null,
  previous: EnvironmentSnapshot | null,
  lastAdvisorRefresh: number | null,
  userRequested: boolean = false
): boolean {
  if (!current) return false;
  if (userRequested) return true;
  if (!previous) return true;

  const result = detectChanges(current, previous, lastAdvisorRefresh, false);
  return result.shouldRefreshAdvisor;
}
