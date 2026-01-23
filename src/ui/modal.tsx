import React from "react";
import {
  View,
  Text,
  Modal as RNModal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  FadeInDown,
  FadeOutDown,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { MaterialIcons } from "@expo/vector-icons";
import { cn } from "@/src/lib/utils";

export type ModalVariant = "default" | "success" | "warning" | "danger" | "info";

export interface ModalButton {
  text: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
}

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  variant?: ModalVariant;
  icon?: keyof typeof MaterialIcons.glyphMap;
  buttons?: ModalButton[];
  children?: React.ReactNode;
  dismissable?: boolean;
}

const variantConfig: Record<
  ModalVariant,
  { icon: keyof typeof MaterialIcons.glyphMap; color: string; bgColor: string }
> = {
  default: { icon: "info", color: "#3b82f6", bgColor: "bg-blue-500/20" },
  success: { icon: "check-circle", color: "#22c55e", bgColor: "bg-green-500/20" },
  warning: { icon: "warning", color: "#f59e0b", bgColor: "bg-amber-500/20" },
  danger: { icon: "error", color: "#ef4444", bgColor: "bg-red-500/20" },
  info: { icon: "info", color: "#6366f1", bgColor: "bg-indigo-500/20" },
};

const buttonVariantStyles = {
  primary: "bg-white",
  secondary: "bg-neutral-800 border border-neutral-700",
  danger: "bg-red-500",
  ghost: "bg-transparent",
};

const buttonTextStyles = {
  primary: "text-black",
  secondary: "text-white",
  danger: "text-white",
  ghost: "text-neutral-400",
};

export function Modal({
  visible,
  onClose,
  title,
  message,
  variant = "default",
  icon,
  buttons,
  children,
  dismissable = true,
}: ModalProps) {
  const config = variantConfig[variant];
  const displayIcon = icon ?? config.icon;

  const handleBackdropPress = () => {
    if (dismissable) {
      onClose();
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={dismissable ? onClose : undefined}
    >
      <View className="flex-1">
        {/* Backdrop */}
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          className="absolute inset-0"
        >
          <TouchableWithoutFeedback onPress={handleBackdropPress}>
            <BlurView intensity={20} tint="dark" className="flex-1 bg-black/60" />
          </TouchableWithoutFeedback>
        </Animated.View>

        {/* Modal Content */}
        <View className="flex-1 justify-center items-center px-6">
          <Animated.View
            entering={FadeInDown.duration(250).delay(50)}
            exiting={FadeOutDown.duration(200)}
            className="w-full max-w-sm"
          >
            <Pressable>
              <View className="bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-800">
                {/* Icon */}
                <View className="items-center pt-8 pb-4">
                  <View
                    className={cn(
                      "w-16 h-16 rounded-full items-center justify-center",
                      config.bgColor
                    )}
                  >
                    <MaterialIcons name={displayIcon} size={32} color={config.color} />
                  </View>
                </View>

                {/* Content */}
                <View className="px-6 pb-6">
                  {title && (
                    <Text className="text-white text-xl font-semibold text-center mb-2">
                      {title}
                    </Text>
                  )}
                  {message && (
                    <Text className="text-neutral-400 text-base text-center leading-6">
                      {message}
                    </Text>
                  )}
                  {children && <View className="mt-4">{children}</View>}
                </View>

                {/* Buttons */}
                {buttons && buttons.length > 0 && (
                  <View className="px-6 pb-6 gap-3">
                    {buttons.map((button, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={button.onPress}
                        disabled={button.loading}
                        activeOpacity={0.8}
                        className={cn(
                          "py-4 rounded-2xl items-center justify-center",
                          buttonVariantStyles[button.variant ?? "primary"],
                          button.loading && "opacity-50"
                        )}
                      >
                        <Text
                          className={cn(
                            "font-semibold text-base",
                            buttonTextStyles[button.variant ?? "primary"]
                          )}
                        >
                          {button.text}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </RNModal>
  );
}

/**
 * Pre-configured Alert Modal (single button)
 */
export interface AlertModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  variant?: ModalVariant;
  buttonText?: string;
}

export function AlertModal({
  visible,
  onClose,
  title,
  message,
  variant = "default",
  buttonText = "OK",
}: AlertModalProps) {
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={title}
      message={message}
      variant={variant}
      buttons={[{ text: buttonText, onPress: onClose, variant: "primary" }]}
    />
  );
}

/**
 * Pre-configured Confirm Modal (two buttons)
 */
export interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  variant?: ModalVariant;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "primary" | "danger";
  loading?: boolean;
}

export function ConfirmModal({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  variant = "default",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "primary",
  loading = false,
}: ConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={title}
      message={message}
      variant={variant}
      dismissable={!loading}
      buttons={[
        { text: confirmText, onPress: onConfirm, variant: confirmVariant, loading },
        { text: cancelText, onPress: onClose, variant: "ghost" },
      ]}
    />
  );
}
