import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, { useAnimatedStyle, interpolate } from "react-native-reanimated";
import { MaterialSymbol } from "@/src/ui";
import type { HealthRiskLevel } from "@/src/types";

interface HealthScoreCircleProps {
  score: number;
  riskLevel: HealthRiskLevel;
  iconName: "eco" | "directions_walk" | "warning" | "dangerous";
  colors: {
    primary: string;
    secondary: string;
    border: string;
    glow: string;
    text: string;
    badgeText?: string;
    scoreText?: string;
  };
  onPress?: () => void;
  ring1Progress: Animated.SharedValue<number>;
  ring2Progress: Animated.SharedValue<number>;
  circleScale: Animated.SharedValue<number>;
  tapHintProgress: Animated.SharedValue<number>;
}

export function HealthScoreCircle({
  score,
  riskLevel,
  iconName,
  colors,
  onPress,
  ring1Progress,
  ring2Progress,
  circleScale,
  tapHintProgress,
}: HealthScoreCircleProps) {
  const ring1AnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(ring1Progress.value, [0, 1], [1, 1.05]),
        },
      ],
    };
  });

  const ring2AnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(ring2Progress.value, [0, 1], [1, 1.08]),
        },
      ],
    };
  });

  const circleAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: circleScale.value }],
    };
  });

  const tapHintAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: tapHintProgress.value,
    };
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={1}>
      <View className="mb-12 relative">
        {/* Outer rings with animation */}
        <Animated.View
          style={[
            {
              position: "absolute",
              top: -14,
              left: -14,
              right: -14,
              bottom: -14,
              borderRadius: 9999,
              borderWidth: 1,
              borderColor: colors.border,
            },
            ring1AnimatedStyle,
          ]}
        />
        <Animated.View
          style={[
            {
              position: "absolute",
              top: -32,
              left: -32,
              right: -32,
              bottom: -32,
              borderRadius: 9999,
              borderWidth: 1,
              borderColor: colors.border,
              opacity: 0.3,
            },
            ring2AnimatedStyle,
          ]}
        />

        {/* Main circle with animation */}
        <Animated.View
          style={[
            {
              width: 256,
              height: 256,
              borderRadius: 9999,
              backgroundColor: "rgba(24, 24, 27, 0.6)",
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, 0.1)",
              alignItems: "center",
              justifyContent: "center",
              // iOS shadow - enhanced for better glow effect
              shadowColor: colors.glow,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.3,
              shadowRadius: score < 4 ? 50 : 60, // Larger radius for safe state
              // Android shadow
              elevation: 20,
            },
            circleAnimatedStyle,
          ]}
        >
          {/* Multi-layer glow shadow effect */}
          <View className="absolute inset-0 rounded-full" style={{ backgroundColor: colors.secondary }} />

          {/* Additional outer glow layer for enhanced effect */}
          <View
            className="absolute rounded-full"
            style={{
              top: -20,
              left: -20,
              right: -20,
              bottom: -20,
              backgroundColor: "transparent",
              shadowColor: colors.glow,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.15,
              shadowRadius: 40,
            }}
          />

          <View className="items-center">
            <View className="mb-3">
              <MaterialSymbol name={iconName} size={48} color={colors.primary} />
            </View>
            <Text className="text-4xl font-light tracking-tight text-white mb-1">
              {riskLevel}
            </Text>
            <Text
              className="text-sm font-medium tracking-wide"
              style={{ color: colors.scoreText || colors.text }}
            >
              Score: {score}/10
            </Text>
          </View>

          {/* Tap hint with fade-in animation */}
          <Animated.View
            style={[
              {
                position: "absolute",
                bottom: 32,
              },
              tapHintAnimatedStyle,
            ]}
          >
            <Text className="text-[10px] uppercase tracking-widest text-white/30">
              Tap for details
            </Text>
          </Animated.View>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}
