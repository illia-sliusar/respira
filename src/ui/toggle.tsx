import React from "react";
import { View, TouchableOpacity, Animated, type ViewProps } from "react-native";
import { cn } from "@/src/lib/utils";

interface ToggleProps extends ViewProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export function Toggle({ value, onValueChange, disabled, className, ...props }: ToggleProps) {
  const translateX = React.useRef(new Animated.Value(value ? 20 : 0)).current;

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? 20 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value, translateX]);

  const handleToggle = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handleToggle}
      disabled={disabled}
      className={cn(disabled && "opacity-50", className)}
      {...props}
    >
      <View
        className={cn(
          "w-10 h-5 rounded-full transition-colors",
          value ? "bg-neutral-900 dark:bg-white" : "bg-neutral-200 dark:bg-neutral-800"
        )}
      >
        <Animated.View
          style={{ transform: [{ translateX }] }}
          className={cn(
            "absolute top-[2px] left-[2px] h-4 w-4 rounded-full transition-colors",
            value
              ? "bg-white dark:bg-black border-white dark:border-black"
              : "bg-white border-gray-300"
          )}
        />
      </View>
    </TouchableOpacity>
  );
}
