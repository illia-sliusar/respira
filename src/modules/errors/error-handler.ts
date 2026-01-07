import { logger } from "@/src/lib/logger";

interface ErrorContext {
  [key: string]: unknown;
}

/**
 * Log an error with optional context
 */
export function logError(error: Error | string, context?: ErrorContext): void {
  const errorMessage = error instanceof Error ? error.message : error;
  const stack = error instanceof Error ? error.stack : undefined;

  logger.error(errorMessage, {
    ...context,
    stack,
    timestamp: new Date().toISOString(),
  });

  // In production, you would also send to Sentry here
  // Sentry.captureException(error, { extra: context });
}

/**
 * Log an info message
 */
export function logInfo(message: string, context?: ErrorContext): void {
  logger.info(message, {
    ...context,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Log a warning
 */
export function logWarn(message: string, context?: ErrorContext): void {
  logger.warn(message, {
    ...context,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Log a debug message
 */
export function logDebug(message: string, context?: ErrorContext): void {
  logger.debug(message, {
    ...context,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Create an error handler for async operations
 */
export function createErrorHandler(context: string) {
  return (error: unknown): void => {
    if (error instanceof Error) {
      logError(error, { context });
    } else {
      logError(String(error), { context });
    }
  };
}
