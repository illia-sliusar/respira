import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";

interface DietaryRestrictionsProps {
  restrictions: string[];
  onAdd: (restriction: string) => void;
  onRemove: (restriction: string) => void;
}

export function DietaryRestrictions({ restrictions, onAdd, onRemove }: DietaryRestrictionsProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <View className="px-6 mt-10 mb-8 bg-black">
      <Text className="text-white text-sm font-medium uppercase tracking-wider opacity-80 mb-4" style={{ color: '#FFFFFF' }}>
        Dietary Restrictions
      </Text>

      <View className="flex-col gap-3">
        <View className="relative">
          <TextInput
            className="w-full bg-transparent border-b border-neutral-800 text-white py-3 px-0 text-base"
            placeholder="Add dietary restriction..."
            placeholderTextColor="#6B7280"
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={handleAdd}
            returnKeyType="done"
          />
          <MaterialIcons
            name="add"
            size={20}
            color="#6B7280"
            style={{ position: 'absolute', right: 0, top: 12 }}
          />
        </View>

        <View className="flex-row flex-wrap gap-2 mt-2">
          {restrictions.map((restriction) => (
            <View
              key={restriction}
              className="flex-row items-center gap-2 pl-3 pr-2 py-1.5 rounded-md bg-neutral-800"
            >
              <Text className="text-sm font-medium text-neutral-200">{restriction}</Text>
              <TouchableOpacity onPress={() => onRemove(restriction)}>
                <MaterialIcons name="close" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
