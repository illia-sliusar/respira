import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface ProfileHeaderProps {
  onSave: () => void;
  isSaving?: boolean;
}

export function ProfileHeader({ onSave, isSaving = false }: ProfileHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-6 py-4 bg-black">
      <View className="w-10 h-10 shrink-0 items-center justify-start">
        <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
      </View>

      <Text className="text-white text-base font-semibold tracking-wide uppercase text-center">
        Profile
      </Text>

      <TouchableOpacity
        onPress={onSave}
        className="w-10 items-center justify-end"
        disabled={isSaving}
      >
        <Text className="text-white text-sm font-medium">
          {isSaving ? "..." : "Save"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
