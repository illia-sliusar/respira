import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { MaterialSymbol } from "@/src/ui";

interface HealthHeaderProps {
  userName?: string;
  location: string;
  avatarUrl?: string;
  onNotificationPress?: () => void;
  onAvatarPress?: () => void;
}

export function HealthHeader({
  userName,
  location,
  avatarUrl,
  onNotificationPress,
  onAvatarPress,
}: HealthHeaderProps) {
  // Get initials from name for fallback
  const getInitials = (name?: string) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0]?.toUpperCase() || "?";
  };

  return (
    <View className="relative z-10 flex-row items-center justify-between px-6 pt-8 pb-4">
      <TouchableOpacity
        className="flex-row items-center gap-4"
        onPress={onAvatarPress}
        activeOpacity={0.7}
      >
        <View className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-neutral-800 items-center justify-center">
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={{
                width: 40,
                height: 40,
                opacity: 0.8,
              }}
              resizeMode="cover"
            />
          ) : (
            <Text className="text-white font-semibold text-sm">
              {getInitials(userName)}
            </Text>
          )}
        </View>
        <View>
          <Text className="text-sm font-medium text-white/90">
            Hello, {userName || "Guest"}
          </Text>
          <Text className="text-[10px] uppercase tracking-widest text-white/40">
            {location}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        className="w-10 h-10 items-center justify-center rounded-full"
        onPress={onNotificationPress}
      >
        <MaterialSymbol name="notifications" size={20} color="rgba(255,255,255,0.4)" />
      </TouchableOpacity>
    </View>
  );
}
