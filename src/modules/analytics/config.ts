// Analytics configuration

export const ANALYTICS_CONFIG = {
  // Enable/disable analytics
  enabled: process.env.EXPO_PUBLIC_ANALYTICS_ENABLED === "true" || __DEV__,

  // Provider selection (can be extended for multiple providers)
  provider: process.env.EXPO_PUBLIC_ANALYTICS_PROVIDER || "console",

  // Debug mode
  debug: __DEV__,

  // Default properties to include with all events
  defaultProperties: {
    platform: "mobile",
    appVersion: "1.0.0",
  },
} as const;
