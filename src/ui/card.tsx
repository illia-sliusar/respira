import { View, Text, TouchableOpacity, type TouchableOpacityProps } from "react-native";
import { cn } from "@/src/lib/utils";

interface CardProps extends Omit<TouchableOpacityProps, "style"> {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  pressable?: boolean;
}

export function Card({
  children,
  title,
  subtitle,
  className,
  pressable = false,
  ...props
}: CardProps) {
  const content = (
    <>
      {(title || subtitle) && (
        <View className="mb-sm">
          {title && <Text className="text-lg font-semibold text-text">{title}</Text>}
          {subtitle && <Text className="text-sm text-text-secondary mt-xs">{subtitle}</Text>}
        </View>
      )}
      <View>{children}</View>
    </>
  );

  if (pressable) {
    return (
      <TouchableOpacity
        className={cn("bg-white rounded-lg p-md shadow-sm", className)}
        activeOpacity={0.7}
        {...props}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View className={cn("bg-white rounded-lg p-md shadow-sm", className)}>{content}</View>;
}
