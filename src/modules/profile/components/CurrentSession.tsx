import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { authClient } from "@/src/lib/better-auth-client";
import { analyticsService } from "@/src/modules/analytics";
import { APP_VERSION } from "@/src/lib/constants";
import { useModal } from "@/src/ui";

export function CurrentSession() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { showConfirm, showAlert } = useModal();

  const handleLogout = async () => {
    const confirmed = await showConfirm({
      title: "Logout",
      message: "Are you sure you want to logout?",
      variant: "warning",
      confirmText: "Logout",
      cancelText: "Cancel",
      confirmVariant: "danger",
    });

    if (!confirmed) return;

    setIsLoggingOut(true);
    try {
      // Sign out from Better Auth
      await authClient.signOut();

      // Clear local session storage (for mock sessions too)
      await SecureStore.deleteItemAsync("tsmobile.session");
      await SecureStore.deleteItemAsync("tsmobile.token");

      analyticsService.track("user_logged_out");

      // Navigate to login screen
      router.replace("/(auth)/login");
    } catch (_error) {
      await showAlert({
        title: "Error",
        message: "Failed to logout. Please try again.",
        variant: "danger",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <View className="px-6 mt-10 mb-24 bg-black">
      <Text className="text-white text-sm font-medium uppercase tracking-wider opacity-80 mb-4" style={{ color: '#FFFFFF' }}>
        Current Session
      </Text>

      <View className="flex-col">
        <View className="flex-row items-center justify-between py-4 border-b border-neutral-800">
          <Text className="text-neutral-400 text-base" style={{ color: '#9CA3AF' }}>App Version</Text>
          <Text className="text-white text-base font-medium" style={{ color: '#FFFFFF' }}>{APP_VERSION}</Text>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          disabled={isLoggingOut}
          className="flex-row items-center justify-between py-4"
        >
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="logout" size={20} color="#EF4444" />
            <Text className="text-error text-base font-medium">
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
