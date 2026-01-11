import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialSymbol } from "@/src/ui";
import type { Destination, ComfortVerdict } from "../types";

interface DestinationCardProps {
  destination: Destination;
  onPress?: () => void;
}

// Get verdict color based on comfort level
function getVerdictColor(verdict: ComfortVerdict): string {
  switch (verdict) {
    case "Very comfortable":
      return "#22c55e"; // green-500
    case "Mostly comfortable":
      return "#84cc16"; // lime-500
    case "Acceptable with caution":
      return "#eab308"; // yellow-500
    case "Not ideal":
      return "#a1a1aa"; // zinc-400
    default:
      return "#a1a1aa";
  }
}

export function DestinationCard({ destination, onPress }: DestinationCardProps) {
  const verdictColor = getVerdictColor(destination.verdict);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-zinc-900 rounded-xl border border-white/5 p-5"
    >
      {/* Header: Name, Duration, Score */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-base font-semibold text-white">
            {destination.name}
          </Text>
          <Text className="text-xs text-zinc-500 mt-0.5">
            {destination.duration}
          </Text>
        </View>
        {/* Score - lower visual priority */}
        <View className="h-8 w-8 rounded-full border border-white/10 items-center justify-center">
          <Text className="text-[10px] font-medium text-zinc-400">
            {destination.score}
          </Text>
        </View>
      </View>

      {/* Comfort Verdict - Primary */}
      <View className="flex-row items-center gap-2 mb-2">
        <MaterialSymbol
          name={destination.verdictIcon}
          size={18}
          color={verdictColor}
        />
        <Text style={{ color: verdictColor }} className="text-sm font-medium">
          {destination.verdict}
        </Text>
      </View>

      {/* Explanations - Secondary */}
      <View className="flex-row flex-wrap gap-x-2">
        {destination.explanations.map((explanation, index) => (
          <Text key={index} className="text-sm text-zinc-400">
            {explanation}
            {index < destination.explanations.length - 1 && " · "}
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  );
}
