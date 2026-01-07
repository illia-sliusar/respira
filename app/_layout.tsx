import "../global.css";
import React, { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { queryClient, queryPersister } from "@/src/lib/query-client";
import { ErrorBoundary } from "@/src/modules/errors";
import { useSession } from "@/src/lib/better-auth-client";
import { Loading } from "@/src/ui";

function RootLayoutContent() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const segments = useSegments();
  const [mockSessionChecked, setMockSessionChecked] = useState(false);
  const [hasMockSession, setHasMockSession] = useState(false);

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
