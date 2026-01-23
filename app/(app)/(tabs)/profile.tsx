import React, { useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ProfileHeader,
  UserInfo,
  AllergiesSection,
  AsthmaConfigurationComponent,
  DietaryRestrictions,
  CurrentSession,
  useProfileStore,
} from "@/src/modules/profile";
import { MaterialIcons } from "@expo/vector-icons";
import { useModal } from "@/src/ui";

export default function ProfileScreen() {
  const router = useRouter();
  const { showAlert } = useModal();
  const {
    profile,
    isLoading,
    isSaving,
    fetchProfile,
    togglePollenAllergy,
    setAsthmaSeverity,
    toggleAsthmaTrigger,
    addDietaryRestriction,
    removeDietaryRestriction,
    saveHealthProfile,
    completeOnboarding,
    hasCompletedOnboarding,
  } = useProfileStore();

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  const handleSave = async () => {
    try {
      await saveHealthProfile();
      // Mark onboarding as completed after first save
      if (!hasCompletedOnboarding) {
        completeOnboarding();
        await showAlert({
          title: "Welcome!",
          message: "Your profile has been saved. You can now explore your personalized health insights.",
          variant: "success",
        });
      } else {
        await showAlert({
          title: "Saved",
          message: "Your profile has been updated successfully.",
          variant: "success",
        });
      }
    } catch {
      await showAlert({
        title: "Error",
        message: "Failed to save profile. Please try again.",
        variant: "danger",
      });
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 items-center justify-center">
          <Text className="text-neutral-400">Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
        <ProfileHeader onSave={handleSave} isSaving={isSaving} />

        <ScrollView
          className="flex-1 bg-black"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ backgroundColor: '#000000' }}
        >
          <TouchableOpacity
            onPress={() => router.push("/(app)/profile/user-details")}
            activeOpacity={0.7}
          >
            <UserInfo user={profile.user} showEditIndicator />
          </TouchableOpacity>

        <AllergiesSection
          selectedAllergies={profile.pollenAllergies}
          onToggle={togglePollenAllergy}
        />

        <AsthmaConfigurationComponent
          asthmaSeverity={profile.asthmaSeverity}
          onSeverityChange={setAsthmaSeverity}
          selectedTriggers={profile.asthmaTriggers}
          onToggleTrigger={toggleAsthmaTrigger}
        />

        <DietaryRestrictions
          restrictions={profile.dietaryRestrictions}
          onAdd={addDietaryRestriction}
          onRemove={removeDietaryRestriction}
        />

        {/* Developer Section */}
        <View className="px-6 mt-6">
          <Text className="text-white text-sm font-medium uppercase tracking-wider opacity-80 mb-4">
            Developer
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(app)/api-test")}
            className="flex-row items-center justify-between bg-neutral-900 rounded-xl p-4"
          >
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 bg-blue-600/20 rounded-full items-center justify-center">
                <MaterialIcons name="api" size={20} color="#3b82f6" />
              </View>
              <View>
                <Text className="text-white font-medium">API Test</Text>
                <Text className="text-neutral-500 text-sm">Test health API endpoints</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#525252" />
          </TouchableOpacity>
        </View>

        <CurrentSession />

          <View className="px-6 pb-32 items-center opacity-40">
            <View className="flex-row items-center gap-1.5 mb-2">
              <MaterialIcons name="lock" size={12} color="#6B7280" />
              <Text className="text-xs font-medium text-neutral-400">Encrypted & Local</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
