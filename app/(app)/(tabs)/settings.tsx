import React from "react";
import { View, Text, ScrollView, Alert, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, Button } from "@/src/ui";
import { useAuthStore, authClient } from "@/src/modules/auth";
import { analyticsService } from "@/src/modules/analytics";
import { APP_NAME, APP_VERSION } from "@/src/lib/constants";

export default function SettingsScreen() {
  const { user } = useAuthStore();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  React.useEffect(() => {
    analyticsService.screen("Settings");
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          setIsLoggingOut(true);
          try {
            await authClient.signOut();
            analyticsService.track("user_logged_out");
            // Root layout will automatically redirect to login when session is cleared
          } catch (_error) {
            Alert.alert("Error", "Failed to logout");
          } finally {
            setIsLoggingOut(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["bottom"]}>
      <ScrollView contentContainerClassName="p-md">
        {/* Profile Section */}
        <Card className="mb-md">
          <Text className="text-lg font-semibold text-text mb-md">Profile</Text>
          <View className="flex-row items-center">
            <View className="w-[60px] h-[60px] rounded-[30px] bg-primary items-center justify-center mr-md">
              <Text className="text-2xl font-semibold leading-8 text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-text">{user?.name || "User"}</Text>
              <Text className="text-sm leading-5 text-text-secondary mt-xs">
                {user?.email || "user@example.com"}
              </Text>
            </View>
          </View>
        </Card>

        {/* Preferences Section */}
        <Card className="mb-md">
          <Text className="text-lg font-semibold text-text mb-md">Preferences</Text>

          <View className="flex-row justify-between items-center py-sm border-b border-divider">
            <View>
              <Text className="text-base leading-6 text-text">Push Notifications</Text>
              <Text className="text-xs leading-4 text-text-secondary mt-xs">
                Receive push notifications
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#D1D5DB", true: "#5BA3F5" }}
              thumbColor={notificationsEnabled ? "#2180E1" : "#9CA3AF"}
            />
          </View>

          <View className="flex-row justify-between items-center py-sm">
            <View>
              <Text className="text-base leading-6 text-text">Dark Mode</Text>
              <Text className="text-xs leading-4 text-text-secondary mt-xs">
                Use dark theme (coming soon)
              </Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: "#D1D5DB", true: "#5BA3F5" }}
              thumbColor={darkModeEnabled ? "#2180E1" : "#9CA3AF"}
              disabled
            />
          </View>
        </Card>

        {/* App Info Section */}
        <Card className="mb-md">
          <Text className="text-lg font-semibold text-text mb-md">About</Text>

          <View className="flex-row justify-between items-center py-sm border-b border-divider">
            <Text className="text-base leading-6 text-text-secondary">App Name</Text>
            <Text className="text-base leading-6 text-text font-medium">{APP_NAME}</Text>
          </View>

          <View className="flex-row justify-between items-center py-sm border-b border-divider">
            <Text className="text-base leading-6 text-text-secondary">Version</Text>
            <Text className="text-base leading-6 text-text font-medium">{APP_VERSION}</Text>
          </View>

          <View className="flex-row justify-between items-center py-sm">
            <Text className="text-base leading-6 text-text-secondary">Built with</Text>
            <Text className="text-base leading-6 text-text font-medium">Expo + React Native</Text>
          </View>
        </Card>

        {/* Logout Button */}
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="secondary"
          loading={isLoggingOut}
          fullWidth
          className="mt-md bg-error-light"
        />

        <Text className="text-xs leading-4 text-text-muted text-center mt-lg mb-xl">
          Made with ❤️ using the AI-first architecture
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
