import React from "react";
import { View, Text } from "react-native";
import { cn } from "@/src/lib/utils";
import { Button } from "./button";

interface EmptyStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <View className={cn("flex-1 items-center justify-center p-xl", className)}>
      {icon && <View className="mb-md">{icon}</View>}
      <Text className="text-h3 font-semibold text-text text-center">{title}</Text>
      {message && (
        <Text className="text-body text-text-secondary text-center mt-sm">{message}</Text>
      )}
      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} variant="primary" className="mt-lg" />
      )}
    </View>
  );
}
