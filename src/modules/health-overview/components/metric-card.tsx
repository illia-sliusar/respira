import React from "react";
import { View, Text } from "react-native";
import { MaterialSymbol } from "@/src/ui";

interface MetricCardProps {
  icon: string;
  label: string;
  value: string | number;
  unit: string;
}

export function MetricCard({ icon, label, value, unit }: MetricCardProps) {
  return (
    <View className="flex flex-col gap-1">
      <View className="flex-row items-center gap-2 mb-1">
        <MaterialSymbol name={icon as any} size={18} color="rgba(161, 161, 170, 1)" />
        <Text className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          {label}
        </Text>
      </View>
      <View className="flex-row items-baseline gap-2">
        <Text className="text-3xl font-light text-white">{value}</Text>
        <Text className="text-sm font-medium text-white/60">{unit}</Text>
      </View>
    </View>
  );
}
