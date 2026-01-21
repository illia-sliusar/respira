import React, { useEffect } from "react";
import { View, ScrollView, ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { analyticsService, ANALYTICS_EVENTS } from "@/src/modules/analytics";
import { logger } from "@/src/lib/logger";
import { useProfileStore } from "@/src/modules/profile";
import {
  usePersonalizedScore,
  getScoreRiskLevel,
  getScoreRecommendation,
  getScoreColors,
  getScoreIcon,
  getScoreBackgroundColors,
} from "@/src/modules/score";
import {
  HealthScoreCircle,
  HealthHeader,
  HealthBadge,
  HealthDescription,
  FabricBackground,
} from "@/src/modules/health-overview";

export default function HomeScreen() {
  const { profile, fetchProfile } = useProfileStore();
  const { data: scoreData, isLoading, error } = usePersonalizedScore();

  // Fetch profile on mount
  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  // Shared values for animations
  const pulseProgress = useSharedValue(0);
  const ring1Progress = useSharedValue(0);
  const ring2Progress = useSharedValue(0);
  const tapHintProgress = useSharedValue(0);
  const circleScale = useSharedValue(1);

  React.useEffect(() => {
    analyticsService.screen("Home");

    // Background blob pulsing animation
    pulseProgress.value = withRepeat(
      withTiming(1, {
        duration: 6000,
        easing: Easing.bezier(0.4, 0, 0.6, 1),
      }),
      -1,
      true
    );

    // Ring 1 pulsing animation
    ring1Progress.value = withRepeat(
      withTiming(1, {
        duration: 4000,
        easing: Easing.bezier(0.4, 0, 0.6, 1),
      }),
      -1,
      true
    );

    // Ring 2 pulsing animation (different timing)
    ring2Progress.value = withRepeat(
      withTiming(1, {
        duration: 5000,
        easing: Easing.bezier(0.4, 0, 0.6, 1),
      }),
      -1,
      true
    );

    // Tap hint fade-in animation
    tapHintProgress.value = withDelay(
      1000,
      withTiming(1, {
        duration: 1000,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    );
  }, []);

  const handleCirclePress = () => {
    // Scale down and up animation
    circleScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );

    // Track analytics
    analyticsService.track(ANALYTICS_EVENTS.HEALTH_SCORE_TAPPED, {
      score: scoreData?.score.score_1_10,
      riskLevel: scoreData?.score.drivers.category,
    });

    // Navigate to detailed view
    router.push("/health/details");
  };

  // Extract score data (hardcoded for UI testing)
  const score = scoreData?.score.score_1_10 ?? 2;
  const riskLevel = getScoreRiskLevel(score);
  const dominantDriver = scoreData?.score.drivers.dominant_driver ?? "mixed";
  const locationName = scoreData?.location.name ?? "Loading...";

  // Get colors and icon based on score
  const colors = getScoreColors(score);
  const iconName = getScoreIcon(score);

  // Get badge icon based on score (uses same logic as main icon but with extra option)
  const getBadgeIcon = (): "eco" | "directions_walk" | "warning" | "dangerous" | "health_and_safety" => {
    if (score >= 8) return "eco";
    if (score >= 6) return "directions_walk";
    if (score >= 4) return "warning";
    return "dangerous";
  };

  // Get condition text based on score (higher = better)
  const getConditionText = (): string => {
    if (score >= 8) return "Excellent";
    if (score >= 6) return "Good Conditions";
    if (score >= 4) return "Moderate";
    return "Poor Conditions";
  };

  // Get description based on score and dominant driver
  const getDescription = (): string =>
    getScoreRecommendation(score, dominantDriver);

  // Get background colors and variant
  const backgroundColors = getScoreBackgroundColors(score);
  const backgroundVariant = score >= 8 ? "safe" : score >= 6 ? "medium" : "hazardous";

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center" edges={["top"]}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-neutral-400 mt-4">Loading health data...</Text>
      </SafeAreaView>
    );
  }

  // Error state - show default UI
  if (error) {
    logger.warn({ error }, "Score API error");
  }

  return (
    <View className="flex-1 bg-black">
      {/* Background - Fabric shader effect (full screen) */}
      <FabricBackground variant={backgroundVariant} />

      <SafeAreaView className="flex-1" edges={["top"]}>
        <View className="flex-1 relative">
          {/* Header */}
          <HealthHeader
            userName={profile?.user?.name ?? ""}
            location={locationName}
            avatarUrl={profile?.user?.avatarUrl}
            onAvatarPress={() => router.push("/(app)/profile/user-details")}
          />

          {/* Main Content */}
          <ScrollView
            className="flex-1 relative z-10"
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 items-center justify-center pb-20 px-6">
              {/* Score Circle */}
              <HealthScoreCircle
                score={score}
                riskLevel={riskLevel}
                iconName={iconName}
                colors={colors}
                onPress={handleCirclePress}
                ring1Progress={ring1Progress}
                ring2Progress={ring2Progress}
                circleScale={circleScale}
                tapHintProgress={tapHintProgress}
              />

              {/* Status Badge and Description */}
              <View className="w-full max-w-xs items-center space-y-4">
                <HealthBadge
                  condition={getConditionText() as any}
                  iconName={getBadgeIcon()}
                  colors={colors}
                />

                <HealthDescription description={getDescription()} />
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}
