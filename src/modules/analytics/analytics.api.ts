import { ANALYTICS_CONFIG } from "./config";
import { consoleProvider } from "./providers";

type EventProperties = Record<string, unknown>;
type UserTraits = Record<string, unknown>;

// Get the appropriate provider based on config
const getProvider = () =>
  // For now, always use console provider
  // In production, you would switch based on ANALYTICS_CONFIG.provider
  consoleProvider;

/**
 * Analytics service abstraction
 * Provides a unified interface for analytics tracking
 */
export const analyticsService = {
  /**
   * Identify a user with optional traits
   */
  identify: (userId: string, traits?: UserTraits) => {
    if (!ANALYTICS_CONFIG.enabled) return;

    const provider = getProvider();
    provider.identify(userId, {
      ...ANALYTICS_CONFIG.defaultProperties,
      ...traits,
    });
  },

  /**
   * Track an event with optional properties
   */
  track: (event: string, properties?: EventProperties) => {
    if (!ANALYTICS_CONFIG.enabled) return;

    const provider = getProvider();
    provider.track(event, {
      ...ANALYTICS_CONFIG.defaultProperties,
      ...properties,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Track a screen view
   */
  screen: (screenName: string, properties?: EventProperties) => {
    if (!ANALYTICS_CONFIG.enabled) return;

    const provider = getProvider();
    provider.screen(screenName, {
      ...ANALYTICS_CONFIG.defaultProperties,
      ...properties,
    });
  },

  /**
   * Reset analytics (on logout)
   */
  reset: () => {
    if (!ANALYTICS_CONFIG.enabled) return;

    const provider = getProvider();
    provider.reset();
  },
};

// Common event names for consistency
export const ANALYTICS_EVENTS = {
  // Auth events
  USER_SIGNED_UP: "user_signed_up",
  USER_LOGGED_IN: "user_logged_in",
  USER_LOGGED_OUT: "user_logged_out",

  // Note events
  NOTE_CREATED: "note_created",
  NOTE_VIEWED: "note_viewed",
  NOTE_UPDATED: "note_updated",
  NOTE_DELETED: "note_deleted",

  // Navigation events
  TAB_CHANGED: "tab_changed",
  SCREEN_VIEWED: "screen_viewed",

  // Error events
  ERROR_OCCURRED: "error_occurred",
} as const;
