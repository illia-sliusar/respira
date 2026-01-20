// API hook
export { usePersonalizedScore } from "./score.api";

// Score utilities (unified module)
export {
  getScoreRiskLevel,
  getScoreCondition,
  getScoreColors,
  getScoreHexColor,
  getScoreColorClass,
  getScoreIcon,
  getScoreRecommendation,
  getScoreDescription,
  getScoreBackgroundColors,
  getScoreBlobVariant,
  getScoreBlobSize,
} from "./score.utils";

export type {
  ScoreColors,
  ScoreIcon,
  BackgroundColors,
  BlobVariant,
} from "./score.utils";

export type {
  ConditionType,
  RiskTolerance,
  DominantDriver,
  RiskCategory,
  UserSensitivities,
  ScoreUserProfile,
  ScoreDrivers,
  ScoreFactor,
  ScoreResult,
  LocationInfo,
  EnvironmentalData,
  PersonalizedScoreResponse,
} from "./types";
