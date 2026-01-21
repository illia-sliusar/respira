import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";

interface Option<T extends string> {
  value: T;
  label: string;
  description?: string;
}

interface MultiSelectDropdownProps<T extends string> {
  label: string;
  subtitle?: string;
  options: Option<T>[];
  selectedValues: T[];
  onToggle: (value: T) => void;
  placeholder?: string;
}

export function MultiSelectDropdown<T extends string>({
  label,
  subtitle,
  options,
  selectedValues,
  onToggle,
  placeholder = "Select options",
}: MultiSelectDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Animation values
  const translateY = useSharedValue(400);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (isOpen) {
      setIsModalVisible(true);
      backdropOpacity.value = withTiming(1, { duration: 250 });
      translateY.value = withTiming(0, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    } else {
      backdropOpacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(
        400,
        {
          duration: 250,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        },
        () => {
          runOnJS(setIsModalVisible)(false);
        }
      );
    }
  }, [isOpen]);

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleClose = () => setIsOpen(false);

  const getDisplayText = () => {
    if (selectedValues.length === 0) return placeholder;
    if (selectedValues.length === 1) {
      const option = options.find((o) => o.value === selectedValues[0]);
      return option?.label || selectedValues[0];
    }
    return `${selectedValues.length} selected`;
  };

  return (
    <View className="px-6 mt-8">
      {/* Label */}
      <View className="flex-row items-center justify-between mb-2">
        <Text
          className="text-white text-sm font-medium uppercase tracking-wider opacity-80"
          style={{ color: "#FFFFFF" }}
        >
          {label}
        </Text>
        <Text className="text-neutral-500 text-xs">
          {selectedValues.length} selected
        </Text>
      </View>
      {subtitle && (
        <Text className="text-neutral-400 text-sm mb-3">{subtitle}</Text>
      )}

      {/* Dropdown Trigger */}
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
        className="flex-row items-center justify-between bg-neutral-900 rounded-xl px-4 py-4 border border-neutral-800"
      >
        <Text
          className={`text-base ${
            selectedValues.length > 0 ? "text-white" : "text-neutral-500"
          }`}
        >
          {getDisplayText()}
        </Text>
        <MaterialIcons name="keyboard-arrow-down" size={24} color="#6B7280" />
      </TouchableOpacity>

      {/* Selected Tags */}
      {selectedValues.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mt-3">
          {selectedValues.map((value) => {
            const option = options.find((o) => o.value === value);
            return (
              <TouchableOpacity
                key={value}
                onPress={() => onToggle(value)}
                activeOpacity={0.7}
                className="flex-row items-center gap-1.5 bg-blue-600/20 border border-blue-500/50 rounded-lg px-3 py-1.5"
              >
                <Text className="text-blue-400 text-sm">
                  {option?.label || value}
                </Text>
                <MaterialIcons name="close" size={16} color="#60a5fa" />
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="none"
        onRequestClose={handleClose}
        statusBarTranslucent
      >
        <View className="flex-1 justify-end">
          {/* Backdrop */}
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
              },
              backdropAnimatedStyle,
            ]}
          >
            <Pressable className="flex-1" onPress={handleClose} />
          </Animated.View>

          {/* Content */}
          <Animated.View
            style={contentAnimatedStyle}
            className="bg-zinc-900 rounded-t-3xl max-h-[70%]"
          >
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-white/5">
              <Text className="text-lg font-medium text-white">{label}</Text>
              <TouchableOpacity onPress={handleClose} activeOpacity={0.6}>
                <MaterialIcons name="close" size={24} color="#a1a1aa" />
              </TouchableOpacity>
            </View>

            {/* Options List */}
            <ScrollView className="py-2" showsVerticalScrollIndicator={false}>
              {options.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => onToggle(option.value)}
                    activeOpacity={0.6}
                    className="flex-row items-center justify-between px-6 py-4"
                  >
                    <View className="flex-1 mr-4">
                      <Text
                        className={`text-base ${
                          isSelected ? "text-white font-medium" : "text-zinc-300"
                        }`}
                      >
                        {option.label}
                      </Text>
                      {option.description && (
                        <Text className="text-sm text-zinc-500 mt-0.5">
                          {option.description}
                        </Text>
                      )}
                    </View>
                    <View
                      className={`w-6 h-6 rounded-md items-center justify-center ${
                        isSelected
                          ? "bg-blue-600"
                          : "border-2 border-zinc-600"
                      }`}
                    >
                      {isSelected && (
                        <MaterialIcons name="check" size={18} color="#fff" />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Footer */}
            <View className="px-6 py-4 border-t border-white/5">
              <TouchableOpacity
                onPress={handleClose}
                activeOpacity={0.7}
                className="bg-blue-600 rounded-xl py-3.5"
              >
                <Text className="text-center text-white font-semibold text-base">
                  Done
                </Text>
              </TouchableOpacity>
            </View>

            {/* Safe area padding */}
            <View className="h-6" />
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}
