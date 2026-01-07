import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, type TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/src/lib/utils";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  variant?: "default" | "underlined" | "box";
}

export function Input({
  label,
  error,
  helperText,
  containerClassName,
  className,
  rightIcon,
  onRightIconPress,
  variant = "default",
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const isUnderlined = variant === "underlined";
  const isBox = variant === "box";

  return (
    <View className={cn("mb-md", containerClassName)}>
      {label && !isUnderlined && !isBox && (
        <Text className="text-sm text-text-secondary font-regular mb-xs">{label}</Text>
      )}
      <View className="relative">
        <TextInput
          className={cn(
            // Base styles
            "text-base",
            // Variant-specific styles
            isUnderlined
              ? cn(
                  // Underlined variant - transparent background with bottom border only
                  "bg-transparent border-b py-3 px-0",
                  isFocused ? "border-text" : "border-border",
                  error && "border-error",
                  "text-text"
                )
              : isBox
              ? cn(
                  // Box variant - dark surface background with rounded corners (matching design)
                  "bg-surface-dark rounded-xl py-4 px-4 text-white min-h-[56px]",
                  // Always have ring-2 to prevent remounting, use opacity/color to control visibility
                  error ? "ring-2 ring-error" : isFocused ? "ring-2 ring-neutral-700" : "ring-2 ring-transparent"
                )
              : cn(
                  // Default variant - minimal light gray background
                  "bg-input border border-input-border rounded-lg px-md py-3.5 min-h-[52px]",
                  isFocused && "border-input-focus",
                  error && "border-error",
                  "text-text"
                ),
            // Add padding if right icon exists
            rightIcon && "pr-12",
            className
          )}
          placeholderTextColor={isBox ? "#9ca3af" : "#737373"}
          textAlignVertical="center"
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            className="absolute right-md top-1/2 -translate-y-1/2"
            activeOpacity={0.7}
          >
            <Ionicons name={rightIcon} size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-xs text-error mt-xs">{error}</Text>}
      {helperText && !error && (
        <Text className="text-xs text-text-secondary mt-xs">{helperText}</Text>
      )}
    </View>
  );
}
