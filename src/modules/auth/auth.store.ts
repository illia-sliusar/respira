import { authClient } from "@/src/lib/better-auth-client";

// Re-export Better Auth client for backward compatibility
export { authClient };

// Simplified hook that wraps useSession for backward compatibility
export const useAuthStore = () => {
  const { data: session, isPending } = authClient.useSession();

  return {
    user: session?.user || null,
    isLoading: isPending,
    isAuthenticated: !!session,
    // Deprecated methods - Better Auth handles these internally
    initialize: async () => {
      // No-op: Better Auth automatically initializes
    },
  };
};
