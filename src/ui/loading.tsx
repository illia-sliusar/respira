import React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { cn } from "@/src/lib/utils";

interface LoadingProps {
  message?: string;
  size?: "small" | "large";
  fullScreen?: boolean;
  className?: string;
}

export function Loading({ message, size = "large", fullScreen = false, className }: LoadingProps) {
  const content = (
    <>
      <ActivityIndicator size={size} className="text-primary" />
      {message && <Text className="text-body text-text-secondary mt-md">{message}</Text>}
    </>
  );

  if (fullScreen) {
    return (
      <View className={cn("flex-1 items-center justify-center bg-background", className)}>
        {content}
      </View>
    );
  }

  return <View className={cn("p-lg items-center justify-center", className)}>{content}</View>;
}
