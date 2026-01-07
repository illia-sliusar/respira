import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/src/lib/constants";
import { authClient } from "./auth.store";

// Query: Get current user (optional - use authClient.useSession() directly instead)
export function useCurrentUser() {
  const { data: session } = authClient.useSession();

  return useQuery({
    queryKey: QUERY_KEYS.AUTH.USER,
    queryFn: async () => session?.user || null,
    enabled: !!session,
  });
}

// Deprecated: Use authClient.signIn.email() directly instead
export function useLogin() {
  throw new Error("useLogin is deprecated. Use authClient.signIn.email() directly.");
}

// Deprecated: Use authClient.signUp.email() directly instead
export function useSignup() {
  throw new Error("useSignup is deprecated. Use authClient.signUp.email() directly.");
}

// Deprecated: Use authClient.signOut() directly instead
export function useLogout() {
  throw new Error("useLogout is deprecated. Use authClient.signOut() directly.");
}
