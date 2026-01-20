/**
 * Score Interpretation Utilities
 *
 * Unified module for all score-related display/interpretation functions.
 * Score interpretation (higher = better):
 *   8-10: Excellent - great conditions
 *   5-7:  Moderate - caution advised
 *   3-4:  High risk - limit exposure
 *   1-2:  Very high risk - avoid outdoor activities
 */

import type { HealthRiskLevel, HealthCondition } from "@/src/types";

// ============================================================================
// RISK LEVEL
// ============================================================================

/**
 * Get risk level text from score (higher score = better conditions)
 */
export function getScoreRiskLevel(score: number): HealthRiskLevel {
  if (score >= 8) return "Low Risk";
  if (score >= 5) return "Moderate Risk";
  if (score >= 3) return "High Risk";
  return "Very High Risk";
}

// ============================================================================
// CONDITION LABEL
// ============================================================================

/**
 * Get condition label from score (higher score = better conditions)
 */
export function getScoreCondition(score: number): HealthCondition {
  if (score >= 8) return "Excellent";
  if (score >= 6) return "Good Conditions";
  if (score >= 4) return "Fair";
  if (score >= 2) return "Poor";
  return "Hazardous";
}

// ============================================================================
// COLORS
// ============================================================================

export interface ScoreColors {
  primary: string;
  secondary: string;
  border: string;
  glow: string;
  text: string;
  badgeText: string;
  scoreText: string;
}

/**
 * Get color palette object for score-based UI elements
 */
export function getScoreColors(score: number): ScoreColors {
  // Excellent (8-10) - Green
  if (score >= 8) {
    return {
      primary: "rgba(52, 211, 153, 0.9)", // emerald-400
      secondary: "rgba(16, 185, 129, 0.1)", // emerald-500/10
      border: "rgba(16, 185, 129, 0.2)", // emerald-500/20
      glow: "#10b981",
      text: "rgba(52, 211, 153, 0.8)", // emerald-400/80
      badgeText: "rgba(52, 211, 153, 0.8)", // emerald-400/80
      scoreText: "rgba(255, 255, 255, 0.4)", // white/40 for score
    };
  }
  // Moderate (5-7) - Yellow
  if (score >= 5) {
    return {
      primary: "rgba(251, 191, 36, 0.9)", // yellow-400
      secondary: "rgba(245, 158, 11, 0.1)", // yellow-500/10
      border: "rgba(245, 158, 11, 0.2)", // yellow-500/20
      glow: "#F59E0B",
      text: "rgba(251, 191, 36, 0.8)", // yellow-400/80
      badgeText: "rgba(251, 191, 36, 0.8)", // yellow-400/80
      scoreText: "rgba(255, 255, 255, 0.4)", // white/40 for score
    };
  }
  // High Risk (3-4) - Orange
  if (score >= 3) {
    return {
      primary: "rgba(234, 88, 12, 0.9)", // orange-600
      secondary: "rgba(234, 88, 12, 0.1)", // orange-600/10
      border: "rgba(234, 88, 12, 0.2)", // orange-600/20
      glow: "#ea580c",
      text: "rgba(234, 88, 12, 0.9)", // orange-600/90
      badgeText: "rgba(234, 88, 12, 0.9)", // orange-600/90
      scoreText: "rgba(255, 255, 255, 0.5)", // white/50 for score
    };
  }
  // Very High Risk (1-2) - Red
  return {
    primary: "rgba(239, 68, 68, 0.9)", // red-500
    secondary: "rgba(255, 255, 255, 0.05)", // white/5
    border: "rgba(255, 255, 255, 0.05)", // white/5
    glow: "#7f1d1d", // dark red-900
    text: "rgba(255, 255, 255, 0.7)", // white/70
    badgeText: "rgba(255, 255, 255, 0.7)", // white/70
    scoreText: "rgba(255, 255, 255, 0.4)", // white/40
  };
}

/**
 * Get hex color for score (useful for simple color needs)
 */
export function getScoreHexColor(score: number): string {
  if (score >= 8) return "#10b981"; // emerald-500
  if (score >= 5) return "#f59e0b"; // yellow-500
  if (score >= 3) return "#ea580c"; // orange-600
  return "#ef4444"; // red-500
}

/**
 * Get Tailwind color class for score
 */
export function getScoreColorClass(score: number): string {
  if (score >= 8) return "text-green-500";
  if (score >= 5) return "text-yellow-500";
  if (score >= 3) return "text-orange-500";
  return "text-red-500";
}

// ============================================================================
// ICONS
// ============================================================================

export type ScoreIcon = "eco" | "directions_walk" | "warning" | "dangerous";

/**
 * Get Material Symbol icon name for score
 */
export function getScoreIcon(score: number): ScoreIcon {
  if (score >= 8) return "eco"; // Excellent - green leaf
  if (score >= 5) return "directions_walk"; // Moderate - walking
  if (score >= 3) return "warning"; // High Risk - warning triangle
  return "dangerous"; // Very High Risk (1-2) - dangerous icon
}

// ============================================================================
// RECOMMENDATIONS
// ============================================================================

/**
 * Get recommendation text based on score and dominant driver
 */
export function getScoreRecommendation(
  score: number,
  dominantDriver: string
): string {
  // Excellent conditions (8-10)
  if (score >= 8) {
    return "Great conditions for outdoor activities!";
  }

  // Moderate conditions (5-7)
  if (score >= 5) {
    switch (dominantDriver) {
      case "pollen":
        return "Consider morning or evening walks when pollen is lower.";
      case "pollution":
        return "Limit prolonged outdoor exercise, especially near traffic.";
      case "weather":
        return "Check the forecast and dress appropriately.";
      default:
        return "Take precautions if you have respiratory sensitivities.";
    }
  }

  // Poor/Hazardous conditions (1-4)
  switch (dominantDriver) {
    case "pollen":
      return "High pollen levels. Consider staying indoors or wearing a mask.";
    case "pollution":
      return "Poor air quality. Avoid outdoor exercise and keep windows closed.";
    case "weather":
      return "Weather conditions may trigger symptoms. Stay prepared.";
    default:
      return "Unfavorable conditions. Minimize outdoor exposure if possible.";
  }
}

/**
 * Get description text based on score (simpler version without driver)
 */
export function getScoreDescription(score: number): string {
  if (score >= 8) return "Air quality is excellent. Enjoy a walk outside!";
  if (score >= 6) return "Air quality is good. Great day for outdoor activities.";
  if (score >= 4)
    return "Air quality is moderate. Sensitive individuals should limit outdoor exposure.";
  if (score >= 2) return "Air quality is poor. Consider staying indoors.";
  return "Air quality is hazardous. Avoid outdoor activities.";
}

// ============================================================================
// BACKGROUND COLORS (for animated backgrounds)
// ============================================================================

export interface BackgroundColors {
  topGradient: [string, string];
  blobGradient: [string, string];
}
/**
 * Get background gradient colors for animated backgrounds
 */
export function getScoreBackgroundColors(score: number): BackgroundColors {
  if (score >= 8) {
    return {
      topGradient: ["rgba(16, 185, 129, 0.08)", "transparent"],
      blobGradient: ["rgba(5, 150, 105, 0.4)", "rgba(0, 0, 0, 0)"],
    };
  }
  if (score >= 6) {
    return {
      topGradient: ["rgba(245, 158, 11, 0.08)", "transparent"],
      blobGradient: ["rgba(217, 119, 6, 0.4)", "rgba(0, 0, 0, 0)"],
    };
  }
  if (score >= 4) {
    return {
      topGradient: ["rgba(234, 88, 12, 0.15)", "transparent"],
      blobGradient: ["rgba(234, 88, 12, 0.4)", "rgba(0, 0, 0, 0)"],
    };
  }
  return {
    topGradient: ["rgba(127, 29, 29, 0.2)", "transparent"],
    blobGradient: ["rgba(185, 28, 28, 1)", "rgba(0, 0, 0, 0)"],
  };
}

// ============================================================================
// BLOB VARIANTS (for animated backgrounds)
// ============================================================================

export type BlobVariant = "safe" | "medium" | "hazardous";

/**
 * Get blob variant for animated background
 */
export function getScoreBlobVariant(score: number): BlobVariant {
  if (score >= 8) return "safe";
  if (score >= 4) return "medium";
  return "hazardous";
}

/**
 * Get blob size based on score
 */
export function getScoreBlobSize(score: number): number {
  if (score >= 8) return 280;
  if (score >= 4) return 600;
  return 500;
}
