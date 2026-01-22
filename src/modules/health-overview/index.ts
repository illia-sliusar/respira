// API hooks
export {
  useCurrentHealth,
  useHealthHistory,
  useHealthByLocation,
  hasRealData,
  isAllSimulated,
  getDataSourceInfo,
} from "./health-overview.api";

// Components
export {
  HealthScoreCircle,
  HealthHeader,
  HealthBadge,
  HealthDescription,
  AnimatedBackground,
  MetricCard,
  HealthTip,
  FabricBackground,
  FloatingFabricBackground
} from "./components";

// Mock data only (helpers moved to @/src/modules/score)
export {
  MOCK_HEALTH_METRICS,
  MOCK_HEALTH_EXCELLENT,
  MOCK_HEALTH_SAFE,
  MOCK_HEALTH_MODERATE,
  MOCK_HEALTH_MEDIUM,
  MOCK_HEALTH_HAZARDOUS,
  MOCK_HEALTH_SEVERE,
  MOCK_HEALTH_HISTORY,
} from "./mock-health-overview";

// Re-export score utilities for backwards compatibility
// Prefer importing directly from @/src/modules/score
export {
  getScoreRiskLevel as getRiskLevelFromScore,
  getScoreCondition as getConditionFromScore,
  getScoreDescription as getDescriptionFromScore,
  getScoreColors as getScoreColor,
  getScoreIcon as getIconName,
} from "../score/score.utils";
