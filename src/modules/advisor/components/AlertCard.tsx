import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { AlertItem } from "../types";

interface AlertCardProps {
  alert: AlertItem;
  onDismiss: () => void;
  onViewDetails?: () => void;
}

export function AlertCard({ alert, onDismiss, onViewDetails }: AlertCardProps) {
  return (
    <View className="px-6 py-8 border-b border-white/5 bg-[#121212]">
      <View className="flex-row items-center gap-2 mb-3">
        <MaterialIcons name="warning" size={18} color="#FFFFFF" />
        <Text className="text-xs font-bold uppercase tracking-wider text-white">
          Alert
        </Text>
      </View>

      <Text className="text-xl font-semibold mb-3 text-white">{alert.title}</Text>

      <Text className="text-gray-400 text-base leading-relaxed mb-6">
        {alert.description}
      </Text>

      <View className="flex-row items-center gap-6">
        {onViewDetails && (
          <TouchableOpacity onPress={onViewDetails}>
            <Text className="text-sm font-medium text-white underline decoration-1">
              View Details
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onDismiss}>
          <Text className="text-sm font-medium text-gray-400">Dismiss</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
