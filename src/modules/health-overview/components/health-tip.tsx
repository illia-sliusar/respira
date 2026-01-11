import React from "react";
import { View, Text } from "react-native";

interface HealthTipProps {
  tip: string;
}

export function HealthTip({ tip }: HealthTipProps) {
  return (
    <View className="mt-16 border-t border-zinc-800 pt-8">
      <Text className="text-sm leading-relaxed text-zinc-400">
        <Text className="font-semibold text-white">Health Tip: </Text>
        {tip}
      </Text>
    </View>
  );
}
