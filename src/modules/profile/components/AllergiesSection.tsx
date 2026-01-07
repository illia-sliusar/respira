import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";

interface AllergiesSectionProps {
  allergies: string[];
  onAdd: (allergy: string) => void;
  onRemove: (allergy: string) => void;
}

export function AllergiesSection({ allergies, onAdd, onRemove }: AllergiesSectionProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <View className="px-6 mt-8 bg-black">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-white text-sm font-medium uppercase tracking-wider opacity-80" style={{ color: '#FFFFFF' }}>
          Allergies & Triggers
        </Text>
      </View>

      <View className="flex-col gap-3">
        <View className="relative">
          <TextInput
            className="w-full bg-transparent border-b border-neutral-800 text-white py-3 px-0 text-base"
            placeholder="Add a new allergy..."
            placeholderTextColor="#6B7280"
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={handleAdd}
            returnKeyType="done"
            style={{ color: '#FFFFFF', backgroundColor: 'transparent', borderBottomColor: '#27272a', borderBottomWidth: 1 }}
          />
          <MaterialIcons
            name="add"
            size={20}
            color="#6B7280"
            style={{ position: 'absolute', right: 0, top: 12 }}
          />
        </View>

        <View className="flex-row flex-wrap gap-2 mt-2">
          {allergies.map((allergy) => (
            <View
              key={allergy}
              className="flex-row items-center gap-2 pl-3 pr-2 py-1.5 rounded-md bg-neutral-800"
            >
              <Text className="text-sm font-medium text-neutral-200" style={{ color: '#E5E5E5' }}>{allergy}</Text>
              <TouchableOpacity onPress={() => onRemove(allergy)}>
                <MaterialIcons name="close" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
