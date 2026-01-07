import React from "react";
import { TouchableOpacity, View, Text, type TouchableOpacityProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/src/lib/utils";

interface SocialButtonProps extends TouchableOpacityProps {
  provider: "google" | "apple" | "facebook" | "x";
  size?: "sm" | "md" | "lg";
  variant?: "circular" | "rectangular";
  showLabel?: boolean;
}

const iconMap = {
  google: "logo-google",
  apple: "logo-apple",
  facebook: "logo-facebook",
  x: "logo-twitter",
} as const;

const circularSizeClasses = {
  sm: "w-10 h-10",
  md: "w-12 h-12",
  lg: "w-14 h-14",
};

const rectangularSizeClasses = {
  sm: "flex-1 h-12",
  md: "flex-1 h-14",
  lg: "flex-1 h-14",
};

const iconSizes = {
  sm: 20,
  md: 24,
  lg: 24,
};

const labelMap = {
  google: "Google",
  apple: "Apple",
  facebook: "Facebook",
  x: "X",
} as const;

export function SocialButton({
  provider,
  size = "md",
  variant = "circular",
  showLabel = false,
  disabled,
  className,
  ...props
}: SocialButtonProps) {
  const isRectangular = variant === "rectangular";
  const sizeClass = isRectangular ? rectangularSizeClasses[size] : circularSizeClasses[size];

  // Determine icon color based on className (if dark bg, use white icon)
  const hasDarkBg = className?.includes("bg-neutral-900") || className?.includes("bg-black");
  const iconColor = hasDarkBg ? "#FFFFFF" : "#000000";
  const textColor = hasDarkBg ? "text-white" : "text-text";

  return (
    <TouchableOpacity
      className={cn(
        // Base styles
        "items-center justify-center",
        showLabel ? "flex-row gap-3" : "",
        // Variant styles
        isRectangular
          ? "rounded-xl bg-surface-secondary"
          : "rounded-full border border-border bg-white",
        // Size
        sizeClass,
        // Modifiers
        disabled && "opacity-50",
        className
      )}
      disabled={disabled}
      activeOpacity={0.7}
      {...props}
    >
      <Ionicons name={iconMap[provider]} size={iconSizes[size]} color={iconColor} />
      {showLabel && (
        <Text className={cn("text-sm font-medium", textColor)}>{labelMap[provider]}</Text>
      )}
    </TouchableOpacity>
  );
}
