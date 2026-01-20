import React, { useEffect } from "react";
import { View, ScrollView, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AdvisorHeader,
  HealthSummaryComponent,
  AlertCard,
  ReminderCard,
  AdviceCard,
  CompletedItemComponent,
  useAdvisorStore,
  useAdvisorData,
} from "@/src/modules/advisor";

export default function AdvisorScreen() {
  const {
    setData,
    getVisibleItems,
    getCompletedItems,
    dismissAlert,
    snoozeReminder,
    markReminderTaken,
    saveAdvice,
    dismissAdvice,
    data: storeData,
  } = useAdvisorStore();

  // Fetch advisor data from API
  const { data: apiData, isLoading, error } = useAdvisorData();

  // Sync API data to store when it arrives
  useEffect(() => {
    if (apiData) {
      setData({
        summary: apiData.summary,
        items: apiData.items,
        completedItems: apiData.completedItems,
      });
    }
  }, [apiData, setData]);

  // Get visible items (filtered by dismissed/snoozed state)
  const visibleItems = getVisibleItems();
  const completedItems = getCompletedItems();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="text-neutral-400 mt-4">Loading your personalized advice...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    console.warn("Advisor API error:", error);
  }

  return (
    <View className="flex-1 bg-black">
      <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
        <AdvisorHeader />

        <ScrollView
          className="flex-1 bg-black"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ backgroundColor: "#000000", paddingBottom: 120 }}
        >
          <HealthSummaryComponent summary={storeData.summary} />

          <View className="flex-col">
            {visibleItems.map((item) => {
              if (item.type === "alert") {
                return (
                  <AlertCard
                    key={item.id}
                    alert={item}
                    onDismiss={() => dismissAlert(item.id)}
                    onViewDetails={() => console.log("View details:", item.id)}
                  />
                );
              }

              if (item.type === "reminder") {
                return (
                  <ReminderCard
                    key={item.id}
                    reminder={item}
                    onSnooze={() => snoozeReminder(item.id)}
                    onMarkTaken={() => markReminderTaken(item.id)}
                  />
                );
              }

              if (item.type === "nutrition" || item.type === "lifestyle") {
                return (
                  <AdviceCard
                    key={item.id}
                    advice={item}
                    onSave={item.type === "nutrition" ? () => saveAdvice(item.id) : undefined}
                    onDismiss={() => dismissAdvice(item.id)}
                  />
                );
              }

              return null;
            })}

            {completedItems.map((item) => (
              <CompletedItemComponent key={item.id} item={item} />
            ))}

            {visibleItems.length === 0 && completedItems.length === 0 && !isLoading && (
              <View className="items-center py-12 px-6">
                <Text className="text-neutral-400 text-center">
                  No advice items at the moment. Check back later for personalized recommendations.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
