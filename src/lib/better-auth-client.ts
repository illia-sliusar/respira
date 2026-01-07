import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import { AUTH_URL } from "./constants";

export const authClient = createAuthClient({
  baseURL: AUTH_URL,
  plugins: [
    expoClient({
      scheme: "tsmobile", // Reads from app.json automatically
      storagePrefix: "tsmobile",
      storage: SecureStore, // Encrypted session caching
    }),
  ],
});

// Export hooks for convenience
export const { useSession } = authClient;
