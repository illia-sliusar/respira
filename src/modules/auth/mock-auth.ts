import * as SecureStore from "expo-secure-store";

/**
 * Mock authentication for development
 * Simulates a Better Auth session by storing mock data in SecureStore
 */
export async function mockLogin() {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  const mockUser = {
    id: "mock-user-id",
    email: "user@breathline.app",
    name: "Alex",
    emailVerified: true,
    image: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockSession = {
    id: "mock-session-id",
    userId: "mock-user-id",
    expiresAt: expiresAt.getTime(),
    token: "mock-token-" + Date.now(),
    ipAddress: "127.0.0.1",
    userAgent: "Breathline Mobile",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Store session data in the format Better Auth expects
  const sessionData = {
    session: mockSession,
    user: mockUser,
  };

  try {
    // Store in SecureStore with the key Better Auth uses
    await SecureStore.setItemAsync("tsmobile.session", JSON.stringify(sessionData));

    // Also store the token separately for axios interceptors
    await SecureStore.setItemAsync("tsmobile.token", mockSession.token);

    console.log("Mock session created successfully");
    return true;
  } catch (error) {
    console.error("Failed to store mock session:", error);
    return false;
  }
}

export async function mockLogout() {
  try {
    await SecureStore.deleteItemAsync("tsmobile.session");
    return true;
  } catch (error) {
    console.error("Failed to delete mock session:", error);
    return false;
  }
}

export const MOCK_CREDENTIALS = {
  email: "user",
  password: "1234qwer",
} as const;
