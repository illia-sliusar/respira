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
import { Loading } from "@/src/ui";
import { useAppLifecycle } from "@/src/lib/hooks";
import { useScoreRefreshStore } from "@/src/modules/score";
import { useLocationStore } from "@/src/modules/location";
import { QUERY_KEYS } from "@/src/lib/constants";

function RootLayoutContent() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const segments = useSegments();
  const [mockSessionChecked, setMockSessionChecked] = useState(false);
  const [hasMockSession, setHasMockSession] = useState(false);

  // Score refresh store
  const shouldRefresh = useScoreRefreshStore((s) => s.shouldRefresh);
  const setLastRefresh = useScoreRefreshStore((s) => s.setLastRefresh);
  const getLocationOrDefault = useLocationStore((s) => s.getLocationOrDefault);

  // Handle score refresh when app comes to foreground
  const handleAppForeground = useCallback(() => {
    if (shouldRefresh()) {
      const location = getLocationOrDefault();
      // Invalidate score query to trigger refetch
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SCORE.PERSONALIZED(
          location.coordinates.latitude,
          location.coordinates.longitude
        ),
      });
      setLastRefresh();
    }
  }, [shouldRefresh, setLastRefresh, getLocationOrDefault]);

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
      // Redirect to app home if authenticated and in auth group
      router.replace("/");
    }
  }, [session, isPending, segments, router, mockSessionChecked, hasMockSession]);

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
          <RootLayoutContent />
        </PersistQueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
