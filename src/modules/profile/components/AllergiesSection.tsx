import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  POLLEN_ALLERGY_OPTIONS,
  type PollenAllergyType,
} from "../types";

interface AllergiesSectionProps {
  selectedAllergies: PollenAllergyType[];
  onToggle: (allergy: PollenAllergyType) => void;
}

export function AllergiesSection({ selectedAllergies, onToggle }: AllergiesSectionProps) {
  const isSelected = (value: PollenAllergyType) => selectedAllergies.includes(value);

  return (
    <View className="px-6 mt-8 bg-black">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-white text-sm font-medium uppercase tracking-wider opacity-80" style={{ color: '#FFFFFF' }}>
          Pollen Allergies
        </Text>
        <Text className="text-neutral-500 text-xs">
          {selectedAllergies.length} selected
        </Text>
      </View>
      <Text className="text-neutral-400 text-sm mb-4">
        Select the pollen types you are allergic to
      </Text>

      <View className="flex-row flex-wrap gap-2">
        {POLLEN_ALLERGY_OPTIONS.map((option) => {
          const selected = isSelected(option.value);
          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => onToggle(option.value)}
              activeOpacity={0.7}
              className={`flex-row items-center gap-2 px-3 py-2 rounded-lg border ${
                selected
                  ? "bg-blue-600/20 border-blue-500"
                  : "bg-neutral-900 border-neutral-800"
              }`}
            >
              <MaterialIcons
                name={selected ? "check-circle" : "radio-button-unchecked"}
                size={18}
                color={selected ? "#3b82f6" : "#6B7280"}
              />
              <Text
                className={`text-sm font-medium ${
                  selected ? "text-blue-400" : "text-neutral-300"
                }`}
                style={{ color: selected ? "#60a5fa" : "#d4d4d4" }}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
