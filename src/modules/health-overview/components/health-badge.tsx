import React from "react";
import { View, Text } from "react-native";
import { MaterialSymbol } from "@/src/ui";
import type { HealthCondition } from "@/src/types";

interface HealthBadgeProps {
  condition: HealthCondition;
  iconName: "eco" | "directions_walk" | "warning" | "dangerous" | "health_and_safety";
  colors: {
    primary: string;
    secondary: string;
    border: string;
    glow: string;
    text: string;
    badgeText?: string;
    scoreText?: string;
  };
}

export function HealthBadge({ condition, iconName, colors }: HealthBadgeProps) {
  // For hazardous/advisory state, use white/gray icon color
  const iconColor =
    iconName === "health_and_safety" ? "rgba(255, 255, 255, 0.5)" : colors.primary;

  return (
    <View
      className="flex-row items-center gap-2 px-3 py-1 rounded-full border mb-2"
      style={{
        backgroundColor: colors.secondary,
        borderColor: colors.border,
      }}
    >
      <MaterialSymbol name={iconName} size={16} color={iconColor} />
      <Text
        className="text-xs font-medium uppercase tracking-wide"
        style={{ color: colors.badgeText || colors.text }}
      >
        {condition}
      </Text>
    </View>
  );
}
