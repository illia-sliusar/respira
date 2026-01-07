// Constants and configuration

// API URL - use EXPO_PUBLIC_ prefix for environment variables
export const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Auth URL - for Better Auth integration (defaults to API_URL)
export const AUTH_URL = process.env.EXPO_PUBLIC_API_URL || API_URL;

// App info
export const APP_NAME = "TS Mobile Starter";
export const APP_VERSION = "1.0.0";

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_DATA: "user_data",
  QUERY_CACHE: "query_cache",
  THEME_PREFERENCE: "theme_preference",
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    SIGN_IN: "/api/auth/sign-in",
    SIGN_UP: "/api/auth/sign-up",
    SIGN_OUT: "/api/auth/sign-out",
    ME: "/api/auth/me",
  },
  NOTES: {
    LIST: "/api/notes",
    DETAIL: (id: string) => `/api/notes/${id}`,
    CREATE: "/api/notes",
    UPDATE: (id: string) => `/api/notes/${id}`,
    DELETE: (id: string) => `/api/notes/${id}`,
  },
  USERS: {
    PROFILE: "/api/users/profile",
    UPDATE: "/api/users/profile",
  },
} as const;

// Query keys for React Query
export const QUERY_KEYS = {
  AUTH: {
    USER: ["auth", "user"] as const,
  },
  NOTES: {
    ALL: ["notes"] as const,
    DETAIL: (id: string) => ["notes", id] as const,
  },
  USERS: {
    PROFILE: ["users", "profile"] as const,
  },
} as const;
