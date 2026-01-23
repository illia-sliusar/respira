import "../global.css";
import React, { useEffect, useState, useCallback } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { queryClient, queryPersister } from "@/src/lib/query-client";
import { ErrorBoundary } from "@/src/modules/errors";
import { useSession } from "@/src/lib/better-auth-client";
import { Loading, ModalProvider } from "@/src/ui";
import { useAppLifecycle } from "@/src/lib/hooks";
import { useRefreshOrchestrator } from "@/src/lib/refresh-orchestrator";
import { useProfileStore } from "@/src/modules/profile";

function RootLayoutContent() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const segments = useSegments();
  const [mockSessionChecked, setMockSessionChecked] = useState(false);
  const [hasMockSession, setHasMockSession] = useState(false);

  // Refresh orchestrator for coordinated data refresh
  const { refreshOnForeground } = useRefreshOrchestrator();

  // Onboarding status
  const hasCompletedOnboarding = useProfileStore((s) => s.hasCompletedOnboarding);

  // Handle data refresh when app comes to foreground
  const handleAppForeground = useCallback(() => {
    // Orchestrator handles 15-min threshold check and smart advisor refresh
    refreshOnForeground();
  }, [refreshOnForeground]);

  // Listen for app lifecycle changes
  useAppLifecycle({
    onForeground: handleAppForeground,
  });

  // Check for mock session on mount and when segments change
  useEffect(() => {
    async function checkMockSession() {
      try {
        const mockSession = await SecureStore.getItemAsync("tsmobile.session");
        setHasMockSession(!!mockSession);
      } catch (error) {
        console.error("Error checking mock session:", error);
        setHasMockSession(false);
      } finally {
        setMockSessionChecked(true);
      }
    }
    checkMockSession();
  }, [segments]); // Re-check when navigation changes

  useEffect(() => {
    if (isPending || !mockSessionChecked) return;

    const inAuthGroup = segments[0] === "(auth)";
    const isAuthenticated = !!session || hasMockSession;

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated and not in auth group
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      // Use setTimeout to ensure navigation happens after Stack is mounted
      setTimeout(() => {
        if (!hasCompletedOnboarding) {
          // First login - redirect to profile to fill health information
          router.replace("/(app)/(tabs)/profile");
        } else {
          // Returning user - redirect to home
          router.replace("/(app)/(tabs)");
        }
      }, 0);
    }
  }, [session, isPending, segments, router, mockSessionChecked, hasMockSession, hasCompletedOnboarding]);

  if (isPending) {
    return <Loading message="Loading..." fullScreen />;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister: queryPersister }}
        >
          <ModalProvider>
            <RootLayoutContent />
          </ModalProvider>
        </PersistQueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
