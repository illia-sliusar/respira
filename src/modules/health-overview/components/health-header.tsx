import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { MaterialSymbol } from "@/src/ui";

interface HealthHeaderProps {
  userName?: string;
  location: string;
  avatarUrl?: string;
  onNotificationPress?: () => void;
}

export function HealthHeader({
  userName,
  location,
  avatarUrl,
  onNotificationPress,
}: HealthHeaderProps) {
  return (
    <View className="relative z-10 flex-row items-center justify-between px-6 pt-8 pb-4">
      <View className="flex-row items-center gap-4">
        <View className="w-10 h-10 rounded-full border border-white/10 overflow-hidden">
          <Image
            source={{
              uri:
                avatarUrl ||
                "https://lh3.googleusercontent.com/aida-public/AB6AXuABGljyw5FTHCHMS02hrSPJQDj2DGRR9WrZUYWGMVvdL0clC7QEzvz_Z66b_3xP54ZXZpuUnaKyw6GxrCu9InDENkNQ-BXAAeN1-Owu_3l4Kdfe7bnRoKArccEOt58LrvEnr0nsUguHM-9NO01XBv4pRDAp18BBIyap26VrbtWSBjn5bOETlDQgOX6nqdO5g1nAe0-TAw4ehg5E8y8SmgJqkEUQj3B7YClcnCBVsSqxTdjCg0qjEoFUWMf2GuiB021wSEZGu3mYPF4",
            }}
            style={{
              width: 40,
              height: 40,
              opacity: 0.8,
            }}
            resizeMode="cover"
          />
        </View>
        <View>
          <Text className="text-sm font-medium text-white/90">
            Hello, {userName || "Guest"}
          </Text>
          <Text className="text-[10px] uppercase tracking-widest text-white/40">
            {location}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        className="w-10 h-10 items-center justify-center rounded-full"
        onPress={onNotificationPress}
      >
        <MaterialSymbol name="notifications" size={20} color="rgba(255,255,255,0.4)" />
      </TouchableOpacity>
    </View>
  );
}
