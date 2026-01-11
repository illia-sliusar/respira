import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { MaterialSymbol } from "@/src/ui";

interface ForecastFormProps {
  date: string;
  onDatePress?: () => void;
  onSearch?: () => void;
  isLoading?: boolean;
  isDropdownOpen?: boolean;
}

export function ForecastForm({
  date,
  onDatePress,
  onSearch,
  isLoading = false,
  isDropdownOpen = false,
}: ForecastFormProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withTiming(isDropdownOpen ? 180 : 0, {
      duration: 200,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }, [isDropdownOpen]);

  const chevronAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View className="flex flex-col gap-3">
      {/* Date Selector */}
      <TouchableOpacity
        onPress={onDatePress}
        activeOpacity={0.7}
        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 flex-row items-center justify-between"
      >
        <View>
          <Text className="text-[10px] uppercase font-bold text-zinc-400 mb-1">
            When
          </Text>
          <Text className="text-sm font-medium text-white">{date}</Text>
        </View>
        <Animated.View style={chevronAnimatedStyle}>
          <MaterialSymbol name="keyboard_arrow_down" size={24} color="rgba(161, 161, 170, 1)" />
        </Animated.View>
      </TouchableOpacity>

      {/* Find Safer Places Button */}
      <TouchableOpacity
        onPress={onSearch}
        activeOpacity={0.8}
        disabled={isLoading}
        className="w-full bg-white py-3.5 rounded-xl items-center justify-center flex-row gap-2"
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#000000" />
        ) : (
          <Text className="text-sm font-medium tracking-wide text-black">
            Find safer places
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
