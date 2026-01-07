import React from "react";
import { View, Text, TouchableOpacity, type ViewProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/src/lib/utils";

interface ChipProps extends ViewProps {
  label: string;
  onRemove?: () => void;
  removable?: boolean;
}

export function Chip({ label, onRemove, removable = true, className, ...props }: ChipProps) {
  return (
    <View
      className={cn(
        "flex-row items-center gap-2 pl-3 pr-2 py-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800",
        className
      )}
      {...props}
    >
      <Text className="text-sm font-medium text-neutral-900 dark:text-neutral-200">{label}</Text>
      {removable && onRemove && (
        <TouchableOpacity onPress={onRemove} activeOpacity={0.6}>
          <Ionicons name="close" size={16} color="#9ca3af" />
        </TouchableOpacity>
      )}
    </View>
  );
}
