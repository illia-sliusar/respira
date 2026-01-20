import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, { useAnimatedStyle, interpolate } from "react-native-reanimated";
import { MaterialSymbol } from "@/src/ui";
import type { HealthRiskLevel } from "@/src/types";

interface HealthScoreCircleProps {
  score: number;
  riskLevel?: HealthRiskLevel;
  iconName?: "eco" | "directions_walk" | "warning" | "dangerous";
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
  ring1Progress?: Animated.SharedValue<number>;
  ring2Progress?: Animated.SharedValue<number>;
  circleScale?: Animated.SharedValue<number>;
  tapHintProgress?: Animated.SharedValue<number>;
  /** Simple mode - shows only the score number */
  simple?: boolean;
  /** Size of the circle (default: 256 for normal, 160 for simple) */
  size?: number;
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
  simple = false,
  size,
}: HealthScoreCircleProps) {
  const circleSize = size ?? (simple ? 160 : 256);
  const ringOffset1 = simple ? 10 : 14;
  const ringOffset2 = simple ? 24 : 32;
  const ring1AnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: ring1Progress ? interpolate(ring1Progress.value, [0, 1], [1, 1.05]) : 1,
        },
      ],
    };
  });

  const ring2AnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: ring2Progress ? interpolate(ring2Progress.value, [0, 1], [1, 1.08]) : 1,
        },
      ],
    };
  });

  const circleAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: circleScale?.value ?? 1 }],
    };
  });

  const tapHintAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: tapHintProgress?.value ?? 0,
    };
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={1} disabled={!onPress}>
      <View className={simple ? "relative" : "mb-12 relative"}>
        {/* Outer rings with animation */}
        <Animated.View
          style={[
            {
              position: "absolute",
              top: -ringOffset1,
              left: -ringOffset1,
              right: -ringOffset1,
              bottom: -ringOffset1,
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
              top: -ringOffset2,
              left: -ringOffset2,
              right: -ringOffset2,
              bottom: -ringOffset2,
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
              width: circleSize,
              height: circleSize,
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
              shadowRadius: simple ? 30 : (score < 4 ? 50 : 60),
              // Android shadow
              elevation: simple ? 10 : 20,
            },
            circleAnimatedStyle,
          ]}
        >
          {/* Multi-layer glow shadow effect */}
          <View className="absolute inset-0 rounded-full" style={{ backgroundColor: colors.secondary }} />

          {/* Additional outer glow layer for enhanced effect */}
          {!simple && (
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
          )}

          {simple ? (
            /* Simple mode - score with /10 */
            <View className="flex-row items-baseline">
              <Text
                style={{ color: colors.primary, fontSize: circleSize * 0.35, fontWeight: "300" }}
              >
                {score}
              </Text>
              <Text
                style={{ color: "rgba(255,255,255,0.4)", fontSize: circleSize * 0.15, fontWeight: "300" }}
              >
                /10
              </Text>
            </View>
          ) : (
            /* Full mode - icon, risk level, score */
            <View className="items-center">
              {iconName && (
                <View className="mb-3">
                  <MaterialSymbol name={iconName} size={48} color={colors.primary} />
                </View>
              )}
              {riskLevel && (
                <Text className="text-4xl font-light tracking-tight text-white mb-1">
                  {riskLevel}
                </Text>
              )}
              <Text
                className="text-sm font-medium tracking-wide"
                style={{ color: colors.scoreText || colors.text }}
              >
                Score: {score}/10
              </Text>
            </View>
          )}

          {/* Tap hint with fade-in animation (only in full mode) */}
          {!simple && (
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
          )}
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}
