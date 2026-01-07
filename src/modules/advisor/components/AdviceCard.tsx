import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { AdviceItem } from "../types";

interface AdviceCardProps {
  advice: AdviceItem;
  onSave?: () => void;
  onDismiss: () => void;
}

export function AdviceCard({ advice, onSave, onDismiss }: AdviceCardProps) {
  const getIcon = () => {
    switch (advice.type) {
      case "nutrition":
        return "restaurant";
      case "lifestyle":
        return "visibility";
      default:
        return "info";
    }
  };

  const getLabel = () => {
    return advice.type.charAt(0).toUpperCase() + advice.type.slice(1);
  };

  return (
    <View className="px-6 py-8 border-b border-white/5 bg-black">
      <View className="flex-row items-center gap-2 mb-3">
        <MaterialIcons name={getIcon()} size={18} color="#FFFFFF" />
        <Text className="text-xs font-bold uppercase tracking-wider text-white">
          {getLabel()}
        </Text>
      </View>

      <Text className="text-xl font-semibold mb-3 text-white">{advice.title}</Text>

      <Text className="text-gray-400 text-base leading-relaxed mb-6">
        {advice.description}
      </Text>

      <View className="flex-row gap-4">
        {onSave && (
          <TouchableOpacity onPress={onSave}>
            <Text className="text-sm font-medium text-gray-400">Save for later</Text>
          </TouchableOpacity>
        )}
        {!onSave && (
          <TouchableOpacity onPress={onDismiss}>
            <Text className="text-sm font-medium text-gray-400">Dismiss</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
