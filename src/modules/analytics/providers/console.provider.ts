import { logger } from "@/src/lib/logger";

// Console provider for development/testing
export const consoleProvider = {
  identify: (userId: string, traits?: Record<string, unknown>) => {
    logger.info("[Analytics] Identify", { userId, traits });
  },

  track: (event: string, properties?: Record<string, unknown>) => {
    logger.info("[Analytics] Track", { event, properties });
  },

  screen: (screenName: string, properties?: Record<string, unknown>) => {
    logger.info("[Analytics] Screen", { screenName, properties });
  },

  reset: () => {
    logger.info("[Analytics] Reset");
  },
};
