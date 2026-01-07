import { View, Text } from "react-native";
import type { HealthSummary as HealthSummaryType } from "../types";

interface HealthSummaryProps {
  summary: HealthSummaryType;
}

export function HealthSummary({ summary }: HealthSummaryProps) {
  return (
    <View className="px-6 py-6 border-b border-white/5 bg-black">
      <Text className="text-sm font-medium text-gray-400 mb-1">{summary.location}</Text>
      <View className="flex-row flex-wrap gap-x-4 gap-y-1">
        <Text className="text-2xl font-light tracking-tight text-white">
          {summary.riskLevel}
        </Text>
        <Text className="text-2xl font-light tracking-tight text-gray-600">
          {summary.pollenLevel}
        </Text>
        <Text className="text-2xl font-light tracking-tight text-gray-600">
          {summary.windSpeed}
        </Text>
      </View>
    </View>
  );
}
