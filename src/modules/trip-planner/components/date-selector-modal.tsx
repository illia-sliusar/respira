import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  Platform,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { MaterialSymbol } from "@/src/ui";
import type { DateOption } from "../types";

const SCREEN_HEIGHT = Dimensions.get("window").height;

interface DateSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  selectedOption: DateOption;
  customDate: Date | null;
  onSelectOption: (option: DateOption) => void;
  onSelectCustomDate: (date: Date) => void;
}

const DATE_OPTIONS: { value: DateOption; label: string }[] = [
  { value: "This weekend", label: "This weekend" },
  { value: "Next week", label: "Next week" },
  { value: "Custom", label: "Custom date" },
];

// Get tomorrow's date as default for custom date picker
const getTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
};

// Get start of today for minimum date
const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export function DateSelectorModal({
  visible,
  onClose,
  selectedOption,
  customDate,
  onSelectOption,
  onSelectCustomDate,
}: DateSelectorModalProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Use customDate if it's in the future, otherwise use tomorrow
  const getInitialDate = () => {
    if (customDate && customDate >= getToday()) {
      return customDate;
    }
    return getTomorrow();
  };

  const [tempDate, setTempDate] = useState(getInitialDate());
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Animation values
  const translateY = useSharedValue(400);
  const backdropOpacity = useSharedValue(0);

  // Handle open/close animations
  useEffect(() => {
    if (visible) {
      setIsModalVisible(true);
      setTempDate(getInitialDate());
      setShowDatePicker(false);
      // Animate in
      backdropOpacity.value = withTiming(1, { duration: 250 });
      translateY.value = withTiming(0, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    } else {
      // Animate out
      backdropOpacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(400, {
        duration: 250,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }, () => {
        runOnJS(setIsModalVisible)(false);
      });
    }
  }, [visible]);

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleOptionSelect = (option: DateOption) => {
    if (option === "Custom") {
      setShowDatePicker(true);
    } else {
      onSelectOption(option);
      onClose();
    }
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
      if (event.type === "set" && selectedDate) {
        onSelectCustomDate(selectedDate);
        onSelectOption("Custom");
        onClose();
      }
    } else {
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const handleConfirmDate = () => {
    onSelectCustomDate(tempDate);
    onSelectOption("Custom");
    setShowDatePicker(false);
    onClose();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Modal
      visible={isModalVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
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
          <Pressable className="flex-1" onPress={onClose} />
        </Animated.View>

        {/* Content */}
        <Animated.View
          style={contentAnimatedStyle}
          className="bg-zinc-900 rounded-t-3xl"
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-white/5">
            <Text className="text-lg font-medium text-white">Select date</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.6}>
              <MaterialSymbol name="close" size={24} color="rgba(161, 161, 170, 1)" />
            </TouchableOpacity>
          </View>

          {/* Options */}
          {!showDatePicker ? (
            <View className="py-2">
              {DATE_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleOptionSelect(option.value)}
                  activeOpacity={0.6}
                  className="flex-row items-center justify-between px-6 py-4"
                >
                  <View className="flex-row items-center gap-3">
                    <MaterialSymbol
                      name={option.value === "Custom" ? "calendar_month" : "date_range"}
                      size={20}
                      color={
                        selectedOption === option.value
                          ? "#ffffff"
                          : "rgba(161, 161, 170, 1)"
                      }
                    />
                    <Text
                      className={`text-base ${
                        selectedOption === option.value
                          ? "text-white font-medium"
                          : "text-zinc-400"
                      }`}
                    >
                      {option.label}
                    </Text>
                    {option.value === "Custom" && customDate && selectedOption === "Custom" && (
                      <Text className="text-sm text-zinc-500 ml-2">
                        ({formatDate(customDate)})
                      </Text>
                    )}
                  </View>
                  {selectedOption === option.value && (
                    <MaterialSymbol name="check" size={20} color="#22c55e" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className="px-6 py-4">
              <DateTimePicker
                value={tempDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
                minimumDate={getToday()}
                themeVariant="dark"
              />
              {Platform.OS === "ios" && (
                <View className="flex-row gap-3 mt-4">
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(false)}
                    className="flex-1 py-3 rounded-xl border border-white/10"
                    activeOpacity={0.7}
                  >
                    <Text className="text-center text-white font-medium">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleConfirmDate}
                    className="flex-1 py-3 rounded-xl bg-white"
                    activeOpacity={0.7}
                  >
                    <Text className="text-center text-black font-medium">Confirm</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Safe area padding */}
          <View className="h-8" />
        </Animated.View>
      </View>
    </Modal>
  );
}
