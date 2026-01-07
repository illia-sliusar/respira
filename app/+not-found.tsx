import React from "react";
import { View, Text } from "react-native";
import { Link, Stack } from "expo-router";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 items-center justify-center px-xl bg-background">
        <Text className="text-3xl font-bold leading-9 text-text mb-sm">Page Not Found</Text>
        <Text className="text-base leading-6 text-text-secondary text-center mb-lg">
          The page you&apos;re looking for doesn&apos;t exist.
        </Text>
        <Link href="/" className="mt-md">
          <Text className="text-base font-semibold text-primary">Go to Home</Text>
        </Link>
      </View>
    </>
  );
}
