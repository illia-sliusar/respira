import React from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { MaterialSymbol } from "@/src/ui";
import {
  useCurrentHealth,
  HealthScoreCircle,
} from "@/src/modules/health-overview";
import {
  usePersonalizedScore,
  getScoreColors,
} from "@/src/modules/score";
import type { PollenLevel } from "@/src/types";

export default function HealthDetailsScreen() {
  const { data: healthData, isLoading: healthLoading, error: healthError } = useCurrentHealth();
  const { data: scoreData, isLoading: scoreLoading, error: scoreError } = usePersonalizedScore();

  const isLoading = healthLoading || scoreLoading;
  const error = healthError || scoreError;

  const personalizedScore = scoreData?.score?.score_1_10 ?? 0;
  const topFactors = scoreData?.score?.top_factors ?? [];
  const location = healthData?.location ?? scoreData?.location?.name ?? "Loading...";

  const colors = getScoreColors(personalizedScore);

  // Get AQI quality label
  const getAqiLabel = (aqi?: number) => {
    if (aqi === undefined) return "...";
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy";
    return "Hazardous";
  };

  // Convert pollen level to display string
  const getPollenLevelLabel = (level: PollenLevel): string => {
    switch (level) {
      case 0: return "None";
      case 1: return "Low";
      case 2: return "Mod";
      case 3: return "High";
      case 4: return "V.High";
      default: return "...";
    }
  };

  // Get dominant pollen type from pollen data
  const getPollenInfo = () => {
    const pollen = healthData?.pollen;
    if (!pollen) return { level: "...", type: "..." };

    const categories = [
      { name: "Tree", level: pollen.tree?.level ?? 0 },
      { name: "Grass", level: pollen.grass?.level ?? 0 },
      { name: "Weed", level: pollen.weed?.level ?? 0 },
      { name: "Mold", level: pollen.mold?.level ?? 0 },
    ];

    const dominant = categories.reduce((max, cat) =>
      cat.level > max.level ? cat : max
    );

    return {
      level: getPollenLevelLabel(dominant.level as PollenLevel),
      type: dominant.name,
    };
  };

  const pollen = getPollenInfo();

  // Get icon for risk factor
  const getFactorIcon = (name: string): string => {
    switch (name) {
      case "pm25": return "blur_on";
      case "pm10": return "blur_circular";
      case "o3": return "wb_sunny";
      case "no2": return "local_gas_station";
      case "pollen": return "grass";
      case "thunderstorm": return "thunderstorm";
      case "cold": return "ac_unit";
      case "humidity": return "humidity_percentage";
      case "weather": return "cloud";
      default: return "warning";
    }
  };

  // Get readable label for risk factor
  const getFactorLabel = (name: string): string => {
    switch (name) {
      case "pm25": return "Pm2.5 Particles";
      case "pm10": return "Pm10 Particles";
      case "o3": return "Ozone";
      case "no2": return "Nitrogen Dioxide";
      case "pollen": return "Pollen";
      case "thunderstorm": return "Thunderstorm";
      case "cold": return "Cold Weather";
      case "humidity": return "Humidity";
      case "weather": return "Weather";
      default: return name;
    }
  };

  // Get color for impact level (hex)
  const getImpactBarColor = (impact: number): string => {
    if (impact >= 0.7) return "#ef4444"; // red
    if (impact >= 0.4) return "#eab308"; // yellow
    return "#22c55e"; // green
  };

  // Header component
  const renderHeader = () => (
    <View className="flex-row items-center justify-between px-6 py-4">
      <TouchableOpacity
        onPress={() => router.back()}
        className="w-10 h-10 items-center justify-center rounded-full bg-white/10"
        activeOpacity={0.6}
      >
        <MaterialSymbol name="arrow_back" size={20} color="white" />
      </TouchableOpacity>
      <View className="flex-row items-center gap-2 opacity-80">
        <MaterialSymbol name="location_on" size={18} color="white" />
        <Text className="text-sm font-medium tracking-widest uppercase text-white">
          {location}
        </Text>
      </View>
      <View className="w-10" />
    </View>
  );

  // Metric display component
  const MetricDisplay = ({
    icon,
    label,
    value,
    unit
  }: {
    icon: string;
    label: string;
    value: string | number;
    unit: string;
  }) => (
    <View className="flex-1">
      <View className="flex-row items-center gap-2 mb-2">
        <MaterialSymbol name={icon} size={16} color="#6b7280" />
        <Text className="text-xs font-medium tracking-wider text-gray-500 uppercase">
          {label}
        </Text>
      </View>
      <View className="flex-row items-baseline">
        <Text className="text-3xl font-light text-white">{value}</Text>
        <Text className="text-base text-gray-500 ml-2">{unit}</Text>
      </View>
    </View>
  );

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
        {renderHeader()}
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="text-neutral-400 mt-4">Loading health data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
        {renderHeader()}
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-20 h-20 rounded-full bg-red-500/10 items-center justify-center mb-6">
            <MaterialSymbol name="error_outline" size={40} color="#ef4444" />
          </View>
          <Text className="text-xl font-semibold text-white mb-2">Unable to Load Data</Text>
          <Text className="text-neutral-400 text-center">
            We couldn't retrieve health data for your location. Please check your connection and try again.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-8 px-6 py-3 bg-white/10 rounded-full"
            activeOpacity={0.7}
          >
            <Text className="text-white font-medium">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      {renderHeader()}

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Score Circle - Simple Mode */}
        <View className="items-center py-8">
          <HealthScoreCircle
            score={personalizedScore}
            colors={colors}
            simple
            size={140}
          />
        </View>

        <View className="px-6">
          {/* Air Quality Section */}
          <View className="mb-8">
            <Text className="text-lg font-semibold text-white mb-5">Air Quality</Text>

            {/* Row 1: AQI & PM2.5 */}
            <View className="flex-row mb-6">
              <MetricDisplay
                icon="air"
                label="AQI"
                value={healthData?.aqi ?? "..."}
                unit={getAqiLabel(healthData?.aqi)}
              />
              <MetricDisplay
                icon="blur_on"
                label="PM2.5"
                value={healthData?.pollutants?.pm25 !== undefined
                  ? Math.round(healthData.pollutants.pm25)
                  : "..."}
                unit="µg/m³"
              />
            </View>

            {/* Row 2: PM10 & Pollen */}
            <View className="flex-row">
              <MetricDisplay
                icon="blur_circular"
                label="PM10"
                value={healthData?.pollutants?.pm10 !== undefined
                  ? Math.round(healthData.pollutants.pm10)
                  : "..."}
                unit="µg/m³"
              />
              <MetricDisplay
                icon="grass"
                label="Pollen"
                value={pollen.level}
                unit={pollen.type}
              />
            </View>
          </View>

          {/* Weather Section */}
          <View className="mb-8">
            <Text className="text-lg font-semibold text-white mb-5">Weather</Text>

            <View className="flex-row">
              <MetricDisplay
                icon="thermostat"
                label="Temp"
                value={healthData?.temperature !== undefined ? `${healthData.temperature}°` : "..."}
                unit="C"
              />
              <MetricDisplay
                icon="humidity_percentage"
                label="Humidity"
                value={healthData?.humidity ?? "..."}
                unit="%"
              />
            </View>
          </View>

          {/* Risk Factors Section */}
          {topFactors.length > 0 && (
            <View className="mb-8">
              <Text className="text-lg font-semibold text-white mb-5">Risk Factors</Text>

              <View className="bg-white/5 rounded-2xl px-4">
                {topFactors.slice(0, 3).map((factor, index) => (
                  <View
                    key={factor.name}
                    className={`flex-row items-center justify-between py-4 ${
                      index < Math.min(topFactors.length, 3) - 1 ? "border-b border-white/10" : ""
                    }`}
                  >
                    <View className="flex-row items-center flex-1">
                      <MaterialSymbol
                        name={getFactorIcon(factor.name)}
                        size={20}
                        color="#6b7280"
                      />
                      <Text className="text-white ml-3 text-base">
                        {getFactorLabel(factor.name)}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <View className="h-2 rounded-full bg-zinc-800 w-20 overflow-hidden">
                        <View
                          className="h-full rounded-full"
                          style={{
                            width: `${factor.impact_0_1 * 100}%`,
                            backgroundColor: getImpactBarColor(factor.impact_0_1),
                          }}
                        />
                      </View>
                      <Text className="text-zinc-500 ml-3 text-sm w-10 text-right">
                        {Math.round(factor.impact_0_1 * 100)}%
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
