import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialSymbol } from "@/src/ui";
import {
  DestinationCard,
  ForecastForm,
  SearchInput,
  DateSelectorModal,
  MOCK_DESTINATIONS,
  DEFAULT_FORECAST,
} from "@/src/modules/trip-planner";
import type { DateOption } from "@/src/modules/trip-planner";

export default function TripPlannerScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDateOption, setSelectedDateOption] = useState<DateOption>(DEFAULT_FORECAST.date);
  const [customDate, setCustomDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);

  const filteredDestinations = MOCK_DESTINATIONS.filter((dest) =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = () => {
    setIsLoading(true);
    // Simulate search/recalculation
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleDatePress = () => {
    setShowDateModal(true);
  };

  // Format the display date
  const getDisplayDate = () => {
    if (selectedDateOption === "Custom" && customDate) {
      return customDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }
    return selectedDateOption;
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      {/* Header */}
      <View className="px-6 pt-8 pb-4 border-b border-white/5">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-xl font-medium tracking-tight text-white">
            Where it's easier to breathe
          </Text>
          <TouchableOpacity className="rounded-full" activeOpacity={0.6}>
            <MaterialSymbol name="notifications" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <Text className="text-xs text-zinc-500 mb-5">
          Based on your personal health profile
        </Text>

        {/* Search Input */}
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search places"
        />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Date Selection Section */}
        <View className="px-6 py-6 border-b border-white/5">
          <ForecastForm
            date={getDisplayDate()}
            onDatePress={handleDatePress}
            onSearch={handleSearch}
            isLoading={isLoading}
            isDropdownOpen={showDateModal}
          />
        </View>

        {/* Results Section */}
        <View className="px-6 py-6">
          <Text className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">
            Best places for you
          </Text>
          <View className="gap-4">
            {filteredDestinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                onPress={() => {
                  // Future: Navigate to destination details
                }}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Date Selector Modal */}
      <DateSelectorModal
        visible={showDateModal}
        onClose={() => setShowDateModal(false)}
        selectedOption={selectedDateOption}
        customDate={customDate}
        onSelectOption={setSelectedDateOption}
        onSelectCustomDate={setCustomDate}
      />
    </SafeAreaView>
  );
}
