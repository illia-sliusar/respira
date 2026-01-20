import type { HealthMetrics } from "@/src/types";

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
  temperature: 22, // Celsius
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
  temperature: 22, // Celsius
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
  temperature: 24, // Celsius
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
  temperature: 21, // Celsius
  humidity: 58,
  pollutants: {
    pm25: 55,
    pm10: 85,
    o3: 75,
    no2: 65,
  },
};

// Medium Risk air quality (score 6/10) - Matches HTML design mockup
export const MOCK_HEALTH_MEDIUM: HealthMetrics = {
  id: "mock-health-medium",
  score: 6,
  riskLevel: "Medium Risk",
  condition: "Moderate Conditions",
  description: "Air quality is moderate. Sensitive individuals should limit prolonged outdoor exertion.",
  location: "San Francisco",
  timestamp: new Date().toISOString(),
  aqi: 75,
  temperature: 22, // Celsius
  humidity: 55,
  pollutants: {
    pm25: 45,
    pm10: 70,
    o3: 65,
    no2: 55,
  },
};

// Switch between different states for testing:
// export const MOCK_HEALTH_METRICS = MOCK_HEALTH_EXCELLENT; // Score 9 - Green/Safe
// export const MOCK_HEALTH_METRICS = MOCK_HEALTH_MODERATE;  // Score 5 - Orange/Moderate
export const MOCK_HEALTH_METRICS = MOCK_HEALTH_MEDIUM;     // Score 6 - Medium Risk (HTML design)
// export const MOCK_HEALTH_METRICS = MOCK_HEALTH_HAZARDOUS; // Score 3 - High Risk (design)
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
    temperature: 20, // Celsius
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
    temperature: 21, // Celsius
    humidity: 58,
  },
];

// Helper functions moved to @/src/modules/score/score.utils.ts
// Import from @/src/modules/score instead
