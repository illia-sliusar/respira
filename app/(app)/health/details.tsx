import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { MaterialSymbol } from "@/src/ui";
import {
  useCurrentHealth,
  MetricCard,
  HealthTip,
  getConditionFromScore,
} from "@/src/modules/health-overview";

export default function HealthDetailsScreen() {
  const { data: healthData } = useCurrentHealth();

  const score = healthData?.score ?? 8;
  const scoreDisplay = Math.round(score * 10); // Convert 0-10 to 0-100 scale
  const condition = getConditionFromScore(score);
  const location = healthData?.location ?? "San Francisco";

  // Get AQI quality label
  const getAqiLabel = (aqi?: number) => {
    if (!aqi) return "Good";
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy";
    return "Hazardous";
  };

  // Get pollen level label
  const getPollenLevel = (score: number) => {
    if (score >= 8) return { level: "Low", type: "Tree" };
    if (score >= 6) return { level: "Mod", type: "Tree" };
    if (score >= 4) return { level: "High", type: "Tree" };
    return { level: "Very High", type: "Mixed" };
  };

  // Get health tip based on conditions
  const getHealthTip = () => {
    if (score >= 8) {
      return "Tree pollen levels are rising slightly. It remains a great time for outdoor activities, but sensitive individuals should monitor symptoms.";
    }
    if (score >= 6) {
      return "Air quality is moderate today. Consider limiting prolonged outdoor exertion if you have respiratory sensitivities.";
    }
    if (score >= 4) {
      return "Take precautions today. Limit outdoor activities and keep windows closed. Consider wearing a mask if going outside.";
    }
    return "Air quality is hazardous. Stay indoors with windows closed. Use air purifiers if available. Avoid all outdoor activities.";
  };

  const pollen = getPollenLevel(score);

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-white/10"
          activeOpacity={0.6}
        >
          <MaterialSymbol name="close" size={20} color="white" />
        </TouchableOpacity>
        <View className="flex-row items-center gap-2 opacity-80">
          <MaterialSymbol name="location_on" size={20} color="white" />
          <Text className="text-sm font-medium tracking-widest uppercase text-white">
            {location}
          </Text>
        </View>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-8 pb-12">
          {/* Main Score Section */}
          <View className="items-center justify-center mb-16 mt-8">
            <Text className="text-[120px] leading-none font-light tracking-tighter text-white">
              {scoreDisplay}
            </Text>
            <Text className="text-2xl font-medium mt-2 text-white">{condition}</Text>
            <Text className="text-sm text-zinc-400 mt-2 tracking-widest uppercase">
              Overall Safety Score
            </Text>
          </View>

          {/* Metrics Grid */}
          <View className="flex-row flex-wrap">
            <View className="w-1/2 mb-12 pr-6">
              <MetricCard
                icon="air"
                label="Air Quality"
                value={healthData?.aqi ?? 42}
                unit={getAqiLabel(healthData?.aqi)}
              />
            </View>
            <View className="w-1/2 mb-12 pl-6">
              <MetricCard
                icon="filter_drama"
                label="Pollen"
                value={pollen.level}
                unit={pollen.type}
              />
            </View>
            <View className="w-1/2 pr-6">
              <MetricCard
                icon="air"
                label="Wind"
                value={8}
                unit="mph"
              />
            </View>
            <View className="w-1/2 pl-6">
              <MetricCard
                icon="thermostat"
                label="Temp"
                value={`${healthData?.temperature ?? 72}°`}
                unit="Clear"
              />
            </View>
          </View>

          {/* Health Tip */}
          <HealthTip tip={getHealthTip()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
