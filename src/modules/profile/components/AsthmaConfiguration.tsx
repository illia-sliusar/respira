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
import {
  ASTHMA_TRIGGER_OPTIONS,
  ASTHMA_SEVERITY_OPTIONS,
  type AsthmaTriggerType,
  type AsthmaSeverity,
} from "../types";
import { MultiSelectDropdown } from "./MultiSelectDropdown";

interface AsthmaConfigurationProps {
  asthmaSeverity: AsthmaSeverity;
  onSeverityChange: (severity: AsthmaSeverity) => void;
  selectedTriggers: AsthmaTriggerType[];
  onToggleTrigger: (trigger: AsthmaTriggerType) => void;
}

export function AsthmaConfigurationComponent({
  asthmaSeverity,
  onSeverityChange,
  selectedTriggers,
  onToggleTrigger,
}: AsthmaConfigurationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const handleSelect = (severity: AsthmaSeverity) => {
    onSeverityChange(severity);
    handleClose();
  };

  const currentOption = ASTHMA_SEVERITY_OPTIONS.find(
    (opt) => opt.value === asthmaSeverity
  );

  const hasAsthma = asthmaSeverity !== "none";

  return (
    <View>
      {/* Asthma Severity Selector */}
      <View className="px-6 mt-8">
        <View className="flex-row items-center justify-between mb-2">
          <Text
            className="text-white text-sm font-medium uppercase tracking-wider opacity-80"
            style={{ color: "#FFFFFF" }}
          >
            Asthma
          </Text>
          {hasAsthma && (
            <View className="flex-row items-center gap-1">
              <View
                className={`w-2 h-2 rounded-full ${
                  asthmaSeverity === "severe"
                    ? "bg-red-500"
                    : asthmaSeverity === "moderate"
                    ? "bg-orange-500"
                    : asthmaSeverity === "mild"
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
              />
              <Text className="text-neutral-500 text-xs">
                {currentOption?.label}
              </Text>
            </View>
          )}
        </View>
        <Text className="text-neutral-400 text-sm mb-3">
          Select your asthma severity level (GINA classification)
        </Text>

        <TouchableOpacity
          onPress={() => setIsOpen(true)}
          activeOpacity={0.7}
          className="flex-row items-center justify-between bg-neutral-900 rounded-xl px-4 py-4 border border-neutral-800"
        >
          <View className="flex-1 mr-4">
            <Text
              className={`text-base ${
                hasAsthma ? "text-white" : "text-neutral-500"
              }`}
            >
              {currentOption?.label || "Select severity"}
            </Text>
            {currentOption?.description && (
              <Text className="text-neutral-500 text-sm mt-1">
                {currentOption.description}
              </Text>
            )}
          </View>
          <MaterialIcons name="keyboard-arrow-down" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Asthma Triggers - only show if hasAsthma is true */}
      {hasAsthma && (
        <MultiSelectDropdown
          label="Asthma Triggers"
          subtitle="Select the factors that trigger your asthma"
          options={ASTHMA_TRIGGER_OPTIONS}
          selectedValues={selectedTriggers}
          onToggle={onToggleTrigger}
          placeholder="Select triggers"
        />
      )}

      {/* Severity Selection Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="none"
        onRequestClose={handleClose}
        statusBarTranslucent
      >
        <View className="flex-1 justify-end">
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

          <Animated.View
            style={contentAnimatedStyle}
            className="bg-zinc-900 rounded-t-3xl max-h-[70%]"
          >
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-white/5">
              <Text className="text-lg font-medium text-white">
                Asthma Severity
              </Text>
              <TouchableOpacity onPress={handleClose} activeOpacity={0.6}>
                <MaterialIcons name="close" size={24} color="#a1a1aa" />
              </TouchableOpacity>
            </View>

            <ScrollView className="py-2" showsVerticalScrollIndicator={false}>
              {ASTHMA_SEVERITY_OPTIONS.map((option) => {
                const isSelected = asthmaSeverity === option.value;
                const severityColor =
                  option.value === "severe"
                    ? "bg-red-500"
                    : option.value === "moderate"
                    ? "bg-orange-500"
                    : option.value === "mild"
                    ? "bg-yellow-500"
                    : option.value === "intermittent"
                    ? "bg-green-500"
                    : "bg-neutral-500";

                return (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => handleSelect(option.value)}
                    activeOpacity={0.6}
                    className="flex-row items-center justify-between px-6 py-4"
                  >
                    <View className="flex-row items-center flex-1 mr-4">
                      {option.value !== "none" && (
                        <View
                          className={`w-3 h-3 rounded-full mr-3 ${severityColor}`}
                        />
                      )}
                      <View className="flex-1">
                        <Text
                          className={`text-base ${
                            isSelected
                              ? "text-white font-medium"
                              : "text-zinc-300"
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
                    </View>
                    <View
                      className={`w-6 h-6 rounded-full items-center justify-center ${
                        isSelected ? "bg-blue-600" : "border-2 border-zinc-600"
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

            <View className="h-6" />
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}
