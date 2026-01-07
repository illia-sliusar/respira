import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type TouchableOpacityProps,
} from "react-native";
import { cn } from "@/src/lib/utils";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses = {
  primary: "bg-primary",
  secondary: "bg-surface-secondary",
  outline: "bg-transparent border-2 border-border",
  ghost: "bg-transparent",
};

const sizeClasses = {
  sm: "px-lg py-2 min-h-[40px]",
  md: "px-xl py-3 min-h-[48px]",
  lg: "px-xl py-4 min-h-[56px]",
};

const textVariantClasses = {
  primary: "text-white",
  secondary: "text-text",
  outline: "text-text",
  ghost: "text-text",
};

const textSizeClasses = {
  sm: "text-sm font-semibold",
  md: "text-base font-semibold",
  lg: "text-base font-bold",
};

export function Button({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  // Detect if bg-white is in className for text color adjustment
  const hasWhiteBg = className?.includes("bg-white");
  const textColorClass = hasWhiteBg ? "text-black" : textVariantClasses[variant];
  const spinnerColor = hasWhiteBg ? "#000000" : (variant === "primary" ? "#FFFFFF" : "#000000");

  return (
    <TouchableOpacity
      className={cn(
        // Base styles - rounded corners
        "rounded-xl items-center justify-center flex-row",
        // Variant (only if no bg override)
        !hasWhiteBg && variantClasses[variant],
        // Size
        sizeClasses[size],
        // Modifiers
        fullWidth && "w-full",
        isDisabled && "opacity-50",
        className
      )}
      disabled={isDisabled}
      activeOpacity={0.9}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={spinnerColor} />
      ) : (
        <Text className={cn(textColorClass, textSizeClasses[size])}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
