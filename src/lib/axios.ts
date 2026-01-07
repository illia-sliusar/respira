import axios from "axios";
import type { AxiosError, AxiosRequestConfig } from "axios";
import { API_URL } from "./constants";
import { authClient } from "./better-auth-client";
import { logger } from "./logger";
import type { ApiError } from "@/src/types";

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - inject session cookie
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const sessionCookie = authClient.getCookie();

      if (sessionCookie) {
        config.headers.Cookie = sessionCookie;
      }

      logger.debug("API Request", {
        method: config.method,
        url: config.url,
        hasSession: !!sessionCookie,
      });
    } catch (error) {
      logger.error(error as Error, { context: "axios.getCookie" });
    }

    return config;
  },
  (error) => {
    logger.error(error, { context: "axios.request.interceptor" });
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => {
    logger.debug("API Response", {
      status: response.status,
      url: response.config.url,
    });
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const status = error.response?.status;
    if (status === 404) {
      throw error;
    }

    logger.error(error, {
      context: "axios.response.interceptor",
      status,
      message: error.response?.data?.message,
    });

    // 401 will cause useSession to re-validate (Better Auth handles it)
    throw error;
  }
);

// Helper function to extract data from response
export async function fetchApi<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.request<T>(config);
  return response.data;
}
