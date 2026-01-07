// Simple logger for the app
// In production, this could be replaced with a proper logging service

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

const formatMessage = (level: LogLevel, message: string, context?: LogContext): string => {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` ${JSON.stringify(context)}` : "";
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
};

const shouldLog = (level: LogLevel): boolean => {
  // In production, you might want to filter out debug/info logs
  const isDev = __DEV__;
  if (!isDev && (level === "debug" || level === "info")) {
    return false;
  }
  return true;
};

export const logger = {
  debug: (message: string, context?: LogContext) => {
    if (shouldLog("debug")) {
      // eslint-disable-next-line no-console
      console.debug(formatMessage("debug", message, context));
    }
  },

  info: (message: string, context?: LogContext) => {
    if (shouldLog("info")) {
      // eslint-disable-next-line no-console
      console.info(formatMessage("info", message, context));
    }
  },

  warn: (message: string, context?: LogContext) => {
    if (shouldLog("warn")) {
      console.warn(formatMessage("warn", message, context));
    }
  },

  error: (error: Error | string, context?: LogContext) => {
    if (shouldLog("error")) {
      const message = error instanceof Error ? error.message : error;
      console.warn(formatMessage("error", message, context));
      if (error instanceof Error && error.stack) {
        console.warn(error.stack);
      }
    }
  },
};
