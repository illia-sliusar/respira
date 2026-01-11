import React from "react";
import { View, ScrollView } from "react-native";
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
import { useAuthStore } from "@/src/modules/auth";
import { analyticsService, ANALYTICS_EVENTS } from "@/src/modules/analytics";
import {
  useCurrentHealth,
  HealthScoreCircle,
  HealthHeader,
  HealthBadge,
  HealthDescription,
  AnimatedBackground,
  getScoreColor,
  getIconName,
} from "@/src/modules/health-overview";

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { data: healthData } = useCurrentHealth();

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
      score: healthData?.score,
      riskLevel: healthData?.riskLevel,
    });

    // Navigate to detailed view
    router.push("/health/details");
  };

  // Get colors and icon based on score
  const score = healthData?.score ?? 9;
  const colors = getScoreColor(score);
  const iconName = getIconName(score);

  // Get badge icon based on condition
  const getBadgeIcon = (): "eco" | "directions_walk" | "warning" | "dangerous" | "health_and_safety" => {
    if (score >= 8) return "directions_walk";
    if (score >= 6) return "directions_walk";
    if (score >= 4) return "warning";
    return "health_and_safety"; // Advisory for hazardous conditions
  };

  // Get badge text based on score
  const getBadgeText = (): string => {
    if (score >= 4) return healthData?.condition ?? "Good Conditions";
    return "Advisory"; // Show "Advisory" instead of "Hazardous"
  };

  // Get background gradient colors based on score
  const getBackgroundColors = () => {
    if (score >= 8) {
      return {
        topGradient: ["rgba(16, 185, 129, 0.08)", "transparent"] as [string, string],
        blobGradient: ["rgba(5, 150, 105, 0.4)", "rgba(0, 0, 0, 0)"] as [string, string],
      };
    }
    if (score >= 6) {
      return {
        topGradient: ["rgba(245, 158, 11, 0.08)", "transparent"] as [string, string],
        blobGradient: ["rgba(217, 119, 6, 0.4)", "rgba(0, 0, 0, 0)"] as [string, string],
      };
    }
    if (score >= 4) {
      // Medium Risk - Deep orange tones matching #ea580c
      return {
        topGradient: ["rgba(234, 88, 12, 0.15)", "transparent"] as [string, string],
        blobGradient: ["rgba(234, 88, 12, 0.4)", "rgba(0, 0, 0, 0)"] as [string, string],
      };
    }
    // Hazardous: Dark subtle red/maroon tones
    return {
      topGradient: ["rgba(127, 29, 29, 0.2)", "transparent"] as [string, string],
      blobGradient: ["rgba(185, 28, 28, 1)", "rgba(0, 0, 0, 0)"] as [string, string],
    };
  };

  // Get blob variant based on score
  const getBlobVariant = (): "safe" | "medium" | "hazardous" => {
    if (score >= 8) return "safe";
    if (score >= 4) return "medium";
    return "hazardous";
  };

  // Get blob size based on variant
  const getBlobSize = () => {
    if (score >= 8) return 280;
    if (score >= 4) return 600; // Larger blob for medium risk (matches HTML design)
    return 500; // Large blob for hazardous
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      <View className="flex-1 relative">
        {/* Background Gradients */}
        <AnimatedBackground
          pulseProgress={pulseProgress}
          colors={getBackgroundColors()}
          blobSize={getBlobSize()}
          variant={getBlobVariant()}
        />

        {/* Header */}
        <HealthHeader
          userName={user?.name}
          location={healthData?.location ?? "San Francisco"}
          avatarUrl={user?.avatarUrl}
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
              riskLevel={healthData?.riskLevel ?? "Low Risk"}
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
                condition={getBadgeText() as any}
                iconName={getBadgeIcon()}
                colors={colors}
              />

              <HealthDescription
                description={
                  healthData?.description ?? "Air quality is excellent. Enjoy a walk outside!"
                }
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
