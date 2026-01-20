import { View, Text, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { UserProfile } from "../types";

interface UserInfoProps {
  user: UserProfile;
  showEditIndicator?: boolean;
}

export function UserInfo({ user, showEditIndicator = false }: UserInfoProps) {
  if (!user) {
    return null;
  }

  return (
    <View className="px-6 pt-4 pb-8 border-b border-neutral-800 bg-black">
      <View className="flex-row items-center gap-5">
        {user.avatarUrl ? (
          <Image
            source={{ uri: user.avatarUrl }}
            className="w-16 h-16 rounded-full"
            style={{ width: 64, height: 64, borderRadius: 32 }}
          />
        ) : (
          <View className="w-16 h-16 rounded-full bg-neutral-800 items-center justify-center">
            <Text className="text-2xl font-semibold text-white">
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <View className="flex-1">
          <Text className="text-white text-xl font-semibold tracking-tight" style={{ color: '#FFFFFF' }}>
            {user.name}
          </Text>
          <Text className="text-neutral-400 text-sm font-normal" style={{ color: '#9CA3AF' }}>
            {user.email}
          </Text>
        </View>

        {showEditIndicator && (
          <MaterialIcons name="chevron-right" size={24} color="#525252" />
        )}
      </View>
    </View>
  );
}
