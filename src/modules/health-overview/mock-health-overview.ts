import type { HealthMetrics, HealthRiskLevel, HealthCondition } from "@/src/types";

// Excellent air quality (score 9/10)
export const MOCK_HEALTH_EXCELLENT: HealthMetrics = {
  id: "mock-health-excellent",
  score: 9,
  riskLevel: "Low Risk",
  condition: "Excellent",
  description: "Air quality is excellent. Enjoy a walk outside!",
  location: "San Francisco",
  timestamp: new Date().toISOString(),
  aqi: 25,
  temperature: 72,
  humidity: 55,
  pollutants: {
    pm25: 8,
    pm10: 12,
    o3: 30,
    no2: 15,
  },
};

// High Risk air quality (score 3/10) - Matches design
export const MOCK_HEALTH_HAZARDOUS: HealthMetrics = {
  id: "mock-health-hazardous",
  score: 3,
  riskLevel: "High Risk",
  condition: "Hazardous",
  description: "Air quality is hazardous. It is highly recommended to stay indoors and keep windows closed.",
  location: "San Francisco",
  timestamp: new Date().toISOString(),
  aqi: 180,
  temperature: 72,
  humidity: 45,
  pollutants: {
    pm25: 125,
    pm10: 180,
    o3: 120,
    no2: 100,
  },
};

// Very high risk air quality (score 1/10) - Most severe
export const MOCK_HEALTH_SEVERE: HealthMetrics = {
  id: "mock-health-severe",
  score: 1,
  riskLevel: "Very High Risk",
  condition: "Hazardous",
  description: "Air quality is extremely hazardous. Avoid all outdoor activities!",
  location: "San Francisco",
  timestamp: new Date().toISOString(),
  aqi: 301,
  temperature: 75,
  humidity: 50,
  pollutants: {
    pm25: 250,
    pm10: 350,
    o3: 180,
    no2: 200,
    so2: 150,
    co: 15,
  },
};

// Moderate air quality (score 5/10)
export const MOCK_HEALTH_MODERATE: HealthMetrics = {
  id: "mock-health-moderate",
  score: 5,
  riskLevel: "Moderate Risk",
  condition: "Fair",
  description: "Air quality is moderate. Sensitive individuals should limit outdoor exposure.",
  location: "San Francisco",
  timestamp: new Date().toISOString(),
  aqi: 85,
  temperature: 70,
  humidity: 58,
  pollutants: {
    pm25: 55,
    pm10: 85,
    o3: 75,
    no2: 65,
  },
};

// Switch between different states for testing:
// export const MOCK_HEALTH_METRICS = MOCK_HEALTH_EXCELLENT; // Score 9 - Green/Safe
// export const MOCK_HEALTH_METRICS = MOCK_HEALTH_MODERATE;  // Score 5 - Orange/Moderate
export const MOCK_HEALTH_METRICS = MOCK_HEALTH_HAZARDOUS; // Score 3 - High Risk (design)
// export const MOCK_HEALTH_METRICS = MOCK_HEALTH_SEVERE;    // Score 1 - Very High Risk

// For easy reference
export { MOCK_HEALTH_EXCELLENT as MOCK_HEALTH_SAFE };

export const MOCK_HEALTH_HISTORY: HealthMetrics[] = [
  MOCK_HEALTH_METRICS,
  {
    id: "mock-health-2",
    score: 7,
    riskLevel: "Low Risk",
    condition: "Good Conditions",
    description: "Air quality is good. Great day for outdoor activities.",
    location: "San Francisco",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    aqi: 40,
    temperature: 68,
    humidity: 60,
  },
  {
    id: "mock-health-3",
    score: 6,
    riskLevel: "Moderate Risk",
    condition: "Fair",
    description: "Air quality is moderate. Sensitive individuals should limit outdoor exposure.",
    location: "San Francisco",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    aqi: 65,
    temperature: 70,
    humidity: 58,
  },
];

// Helper functions for determining status based on score

export function getRiskLevelFromScore(score: number): HealthRiskLevel {
  if (score >= 8) return "Low Risk";
  if (score >= 6) return "Moderate Risk";
  if (score >= 4) return "High Risk";
  return "Very High Risk";
}

export function getConditionFromScore(score: number): HealthCondition {
  if (score >= 9) return "Excellent";
  if (score >= 7) return "Good Conditions";
  if (score >= 5) return "Fair";
  if (score >= 3) return "Poor";
  return "Hazardous";
}

export function getDescriptionFromScore(score: number): string {
  if (score >= 8) return "Air quality is excellent. Enjoy a walk outside!";
  if (score >= 6) return "Air quality is good. Great day for outdoor activities.";
  if (score >= 4)
    return "Air quality is moderate. Sensitive individuals should limit outdoor exposure.";
  if (score >= 2) return "Air quality is poor. Consider staying indoors.";
  return "Air quality is hazardous. Avoid outdoor activities.";
}

// Color helpers based on score
export function getScoreColor(score: number) {
  if (score >= 8)
    return {
      primary: "rgba(52, 211, 153, 0.9)", // emerald-400
      secondary: "rgba(16, 185, 129, 0.1)", // emerald-500/10
      border: "rgba(16, 185, 129, 0.2)", // emerald-500/20
      glow: "#10b981",
      text: "rgba(52, 211, 153, 0.8)", // emerald-400/80
      badgeText: "rgba(52, 211, 153, 0.8)", // emerald-400/80
      scoreText: "rgba(255, 255, 255, 0.4)", // white/40 for score
    };
  if (score >= 6)
    return {
      primary: "rgba(251, 191, 36, 0.9)", // yellow-400
      secondary: "rgba(245, 158, 11, 0.1)", // yellow-500/10
      border: "rgba(245, 158, 11, 0.2)", // yellow-500/20
      glow: "#F59E0B",
      text: "rgba(251, 191, 36, 0.8)", // yellow-400/80
      badgeText: "rgba(251, 191, 36, 0.8)", // yellow-400/80
      scoreText: "rgba(255, 255, 255, 0.4)", // white/40 for score
    };
  if (score >= 4)
    return {
      primary: "rgba(251, 146, 60, 0.9)", // orange-400
      secondary: "rgba(249, 115, 22, 0.1)", // orange-500/10
      border: "rgba(249, 115, 22, 0.2)", // orange-500/20
      glow: "#F97316",
      text: "rgba(251, 146, 60, 0.8)", // orange-400/80
      badgeText: "rgba(251, 146, 60, 0.8)", // orange-400/80
      scoreText: "rgba(255, 255, 255, 0.4)", // white/40 for score
    };
  // High Risk / Hazardous - Subtle dark red theme
  return {
    primary: "rgba(239, 68, 68, 0.9)", // red-500 for icon
    secondary: "rgba(255, 255, 255, 0.05)", // white/5 for badge bg
    border: "rgba(255, 255, 255, 0.05)", // white/5 for rings
    glow: "#7f1d1d", // dark red-900 for shadow
    text: "rgba(255, 255, 255, 0.7)", // white/70 for badge text
    badgeText: "rgba(255, 255, 255, 0.7)", // white/70 for badge
    scoreText: "rgba(255, 255, 255, 0.4)", // white/40 for score
  };
}

export function getIconName(score: number): "eco" | "directions_walk" | "warning" | "dangerous" {
  if (score >= 8) return "eco";
  if (score >= 6) return "directions_walk";
  if (score >= 3) return "warning"; // High Risk shows warning triangle
  return "dangerous"; // Very High Risk (1-2) shows dangerous icon
}
