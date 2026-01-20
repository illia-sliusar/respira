import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  ASTHMA_TRIGGER_OPTIONS,
  type AsthmaTriggerType,
} from "../types";

interface AsthmaTriggersProps {
  selectedTriggers: AsthmaTriggerType[];
  onToggle: (trigger: AsthmaTriggerType) => void;
}

export function AsthmaConfigurationComponent({ selectedTriggers, onToggle }: AsthmaTriggersProps) {
  const isSelected = (value: AsthmaTriggerType) => selectedTriggers.includes(value);

  // Group triggers by category
  const environmentalTriggers = ASTHMA_TRIGGER_OPTIONS.filter(
    (opt) => ["exercise", "cold_air", "thunderstorm"].includes(opt.value)
  );
  const airQualityTriggers = ASTHMA_TRIGGER_OPTIONS.filter(
    (opt) => ["pm25", "pm10", "ozone", "no2", "so2", "co"].includes(opt.value)
  );

  const renderTriggerChip = (option: typeof ASTHMA_TRIGGER_OPTIONS[0]) => {
    const selected = isSelected(option.value);
    return (
      <TouchableOpacity
        key={option.value}
        onPress={() => onToggle(option.value)}
        activeOpacity={0.7}
        className={`flex-row items-center gap-2 px-3 py-2 rounded-lg border ${
          selected
            ? "bg-orange-600/20 border-orange-500"
            : "bg-neutral-900 border-neutral-800"
        }`}
      >
        <MaterialIcons
          name={selected ? "check-circle" : "radio-button-unchecked"}
          size={18}
          color={selected ? "#f97316" : "#6B7280"}
        />
        <Text
          className={`text-sm font-medium ${
            selected ? "text-orange-400" : "text-neutral-300"
          }`}
          style={{ color: selected ? "#fb923c" : "#d4d4d4" }}
        >
          {option.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="px-6 mt-10 bg-black">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-white text-sm font-medium uppercase tracking-wider opacity-80" style={{ color: '#FFFFFF' }}>
          Asthma Triggers
        </Text>
        <Text className="text-neutral-500 text-xs">
          {selectedTriggers.length} selected
        </Text>
      </View>
      <Text className="text-neutral-400 text-sm mb-4">
        Select the factors that trigger your asthma
      </Text>

      {/* Environmental Triggers */}
      <Text className="text-neutral-500 text-xs uppercase tracking-wider mb-2">
        Environmental
      </Text>
      <View className="flex-row flex-wrap gap-2 mb-4">
        {environmentalTriggers.map(renderTriggerChip)}
      </View>

      {/* Air Quality Triggers */}
      <Text className="text-neutral-500 text-xs uppercase tracking-wider mb-2">
        Air Quality
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {airQualityTriggers.map(renderTriggerChip)}
      </View>
    </View>
  );
}
