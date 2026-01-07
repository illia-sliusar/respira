import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { useAuthStore } from "@/src/modules/auth";
import { analyticsService } from "@/src/modules/analytics";

export default function HomeScreen() {
  const { user } = useAuthStore();

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
    // Navigate to detailed view
  };

  // Animated styles
  const pulseAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(pulseProgress.value, [0, 1], [0.3, 0.5]),
      transform: [
        {
          scale: interpolate(pulseProgress.value, [0, 1], [1, 1.05]),
        },
      ],
    };
  });

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
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      <View className="flex-1 relative">
        {/* Background Gradients */}
        <View className="absolute inset-0 z-0">
          {/* Top gradient */}
          <LinearGradient
            colors={["rgba(16, 185, 129, 0.08)", "transparent"]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "40%",
            }}
          />

          {/* Center animated blob */}
          <View
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 280,
              height: 280,
              marginLeft: -140,
              marginTop: -140,
            }}
          >
            <Animated.View style={[{ width: "100%", height: "100%" }, pulseAnimatedStyle]}>
              <LinearGradient
                colors={["rgba(5, 150, 105, 0.4)", "rgba(0, 0, 0, 0)"]}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 9999,
                }}
              />
            </Animated.View>
          </View>
        </View>

        {/* Header */}
        <View className="relative z-10 flex-row items-center justify-between px-6 pt-8 pb-4">
          <View className="flex-row items-center gap-4">
            <View className="w-10 h-10 rounded-full border border-white/10 overflow-hidden">
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuABGljyw5FTHCHMS02hrSPJQDj2DGRR9WrZUYWGMVvdL0clC7QEzvz_Z66b_3xP54ZXZpuUnaKyw6GxrCu9InDENkNQ-BXAAeN1-Owu_3l4Kdfe7bnRoKArccEOt58LrvEnr0nsUguHM-9NO01XBv4pRDAp18BBIyap26VrbtWSBjn5bOETlDQgOX6nqdO5g1nAe0-TAw4ehg5E8y8SmgJqkEUQj3B7YClcnCBVsSqxTdjCg0qjEoFUWMf2GuiB021wSEZGu3mYPF4",
                }}
                style={{
                  width: 40,
                  height: 40,
                  opacity: 0.8,
                }}
                resizeMode="cover"
              />
            </View>
            <View>
              <Text className="text-sm font-medium text-white/90">
                Hello, {user?.name || "Guest"}
              </Text>
              <Text className="text-[10px] uppercase tracking-widest text-white/40">
                San Francisco
              </Text>
            </View>
          </View>
          <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full">
            <MaterialIcons name="notifications-none" size={20} color="rgba(255,255,255,0.4)" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <ScrollView
          className="flex-1 relative z-10"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 items-center justify-center pb-20 px-6">
            {/* Score Circle */}
            <TouchableOpacity onPress={handleCirclePress} activeOpacity={1}>
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
                      borderColor: "rgba(16, 185, 129, 0.1)",
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
                      borderColor: "rgba(16, 185, 129, 0.05)",
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
                      // iOS shadow
                      shadowColor: "#10b981",
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.3,
                      shadowRadius: 30,
                      // Android shadow
                      elevation: 10,
                    },
                    circleAnimatedStyle,
                  ]}
                >
                  {/* Emerald glow shadow effect */}
                  <View className="absolute inset-0 rounded-full bg-emerald-500/5" />

                  <View className="items-center">
                    <View className="mb-3">
                      <MaterialIcons name="eco" size={48} color="rgba(52, 211, 153, 0.9)" />
                    </View>
                    <Text className="text-3xl font-light tracking-tight text-white mb-1">
                      Low Risk
                    </Text>
                    <Text className="text-emerald-400/80 text-sm font-medium tracking-wide">
                      Score: 9/10
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

            {/* Status Badge and Description */}
            <View className="w-full max-w-xs items-center space-y-4">
              <View className="flex-row items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-2">
                <MaterialIcons name="directions-walk" size={16} color="rgba(52, 211, 153, 1)" />
                <Text className="text-xs font-medium text-emerald-200/80 uppercase tracking-wide">
                  Good Conditions
                </Text>
              </View>

              <Text className="text-white/60 text-sm leading-relaxed font-light text-center">
                Air quality is excellent. Enjoy a walk outside!
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
