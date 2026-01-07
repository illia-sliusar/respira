import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { ReminderItem } from "../types";

interface ReminderCardProps {
  reminder: ReminderItem;
  onSnooze: () => void;
  onMarkTaken: () => void;
}

export function ReminderCard({ reminder, onSnooze, onMarkTaken }: ReminderCardProps) {
  return (
    <View className="px-6 py-8 border-b border-white/5 bg-black">
      <View className="flex-row items-center gap-2 mb-3">
        <MaterialIcons name="schedule" size={18} color="#FFFFFF" />
        <Text className="text-xs font-bold uppercase tracking-wider text-white">
          Reminder
        </Text>
      </View>

      <Text className="text-xl font-semibold mb-1 text-white">{reminder.title}</Text>

      <View className="flex-row items-center mb-6">
        <Text className="text-sm font-medium text-gray-500">Due {reminder.dueTime}</Text>
        {reminder.isOverdue && (
          <Text className="text-sm font-normal text-white ml-1">• Overdue</Text>
        )}
      </View>

      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={onSnooze}
          className="flex-1 border border-gray-800 rounded-lg py-3 items-center"
        >
          <Text className="text-sm font-medium text-white">Snooze</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onMarkTaken}
          className="flex-1 bg-white rounded-lg py-3 items-center"
        >
          <Text className="text-sm font-medium text-black">Mark Taken</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
