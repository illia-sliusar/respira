import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { useLocationStore } from "@/src/modules/location";

export default function AppLayout() {
  const getCurrentLocation = useLocationStore(
    (state) => state.getCurrentLocation
  );

  // Initialize location when app loads
  useEffect(() => {
    getCurrentLocation()
  }, [getCurrentLocation]);
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#FFFFFF" },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="note/[id]"
        options={{
          headerShown: true,
          headerTitle: "Note Details",
          headerBackTitle: "Back",
          headerStyle: { backgroundColor: "#FFFFFF" },
          headerTintColor: "#2180E1",
        }}
      />
      <Stack.Screen
        name="health/details"
        options={{
          headerShown: false,
          contentStyle: { backgroundColor: "#000000" },
          presentation: "modal",
          animation: "slide_from_bottom",
          gestureEnabled: true,
          gestureDirection: "vertical",
        }}
      />
      <Stack.Screen
        name="api-test"
        options={{
          headerShown: false,
          contentStyle: { backgroundColor: "#000000" },
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}
