import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { CompletedItem as CompletedItemType } from "../types";

interface CompletedItemProps {
  item: CompletedItemType;
}

export function CompletedItem({ item }: CompletedItemProps) {
  return (
    <View className="px-6 py-6 opacity-40 bg-black">
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-base font-medium line-through text-white">
            {item.title}
          </Text>
          <Text className="text-xs text-gray-500 mt-1">
            Taken at {item.completedAt}
          </Text>
        </View>
        <MaterialIcons name="check-circle" size={24} color="#FFFFFF" />
      </View>
    </View>
  );
}
