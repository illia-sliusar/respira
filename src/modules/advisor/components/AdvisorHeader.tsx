import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export function AdvisorHeader() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <View className="flex-row items-center justify-between px-6 py-6 bg-black border-b border-white/5">
      <Text className="text-xl font-medium tracking-tight text-white">
        Health & Advice
      </Text>

      <View className="flex-row items-center gap-4">
        <Text className="text-xs font-medium text-gray-400">{currentDate}</Text>
        <TouchableOpacity className="relative">
          <MaterialIcons name="notifications-none" size={20} color="#FFFFFF" />
          <View className="absolute top-0 right-0 h-1.5 w-1.5 rounded-full bg-white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
