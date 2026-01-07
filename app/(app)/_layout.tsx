import React from "react";
import { Stack } from "expo-router";

export default function AppLayout() {
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
    </Stack>
  );
}
