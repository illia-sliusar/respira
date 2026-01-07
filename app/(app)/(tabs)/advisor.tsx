import React, { useEffect } from "react";
import { View, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AdvisorHeader,
  HealthSummaryComponent,
  AlertCard,
  ReminderCard,
  AdviceCard,
  CompletedItemComponent,
  useAdvisorStore,
} from "@/src/modules/advisor";

export default function AdvisorScreen() {
  const {
    data,
    isLoading,
    fetchAdvisorData,
    dismissAlert,
    snoozeReminder,
    markReminderTaken,
    saveAdvice,
    dismissAdvice,
  } = useAdvisorStore();

  useEffect(() => {
    void fetchAdvisorData();
  }, [fetchAdvisorData]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 items-center justify-center">
          <Text className="text-neutral-400">Loading...</Text>
        </View>
      </SafeAreaView>
    );
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
          <HealthSummaryComponent summary={data.summary} />

          <View className="flex-col">
            {data.items.map((item) => {
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

            {data.completedItems.map((item) => (
              <CompletedItemComponent key={item.id} item={item} />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
