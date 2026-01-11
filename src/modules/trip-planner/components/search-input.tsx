import React from "react";
import { View, TextInput, Text } from "react-native";
import { MaterialSymbol } from "@/src/ui";

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChangeText,
  placeholder = "Search destinations...",
}: SearchInputProps) {
  const hasValue = value.length > 0;

  return (
    <View className="relative">
      {/* Show icon on left when there's text */}
      {hasValue && (
        <View className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
          <MaterialSymbol name="search" size={20} color="rgba(161, 161, 170, 1)" />
        </View>
      )}
      {/* Centered placeholder with icon and text */}
      {!hasValue && (
        <View className="absolute inset-0 flex-row items-center justify-center gap-2 pointer-events-none z-10">
          <MaterialSymbol name="search" size={20} color="rgba(107, 114, 128, 1)" />
          <Text className="text-sm text-gray-500">{placeholder}</Text>
        </View>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="transparent"
        className={`w-full bg-zinc-900 rounded-xl py-3 pr-4 text-sm text-white ${
          hasValue ? "pl-10" : "pl-4"
        }`}
      />
    </View>
  );
}
