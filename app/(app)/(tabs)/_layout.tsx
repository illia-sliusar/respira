import React from "react";
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          borderTopColor: "rgba(255, 255, 255, 0.05)",
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 24,
          height: 88,
          position: "absolute",
        },
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "rgba(255, 255, 255, 0.3)",
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color }) => (
            <MaterialIcons
              name="dashboard"
              size={24}
              color={color}
              style={{ fontWeight: "300" }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: "History",
          tabBarIcon: ({ focused, color }) => (
            <MaterialIcons name="history" size={24} color={color} style={{ fontWeight: "300" }} />
          ),
        }}
      />
      <Tabs.Screen
        name="advisor"
        options={{
          title: "Advisor",
          tabBarIcon: ({ focused, color }) => (
            <MaterialIcons name="health-and-safety" size={24} color={color} style={{ fontWeight: "300" }} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color }) => (
            <MaterialIcons name="person" size={24} color={color} style={{ fontWeight: "300" }} />
          ),
        }}
      />
    </Tabs>
  );
}
