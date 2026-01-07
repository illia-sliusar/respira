import React, { useEffect } from "react";
import { View, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ProfileHeader,
  UserInfo,
  AllergiesSection,
  AsthmaConfigurationComponent,
  DietaryRestrictions,
  CurrentSession,
  useProfileStore,
} from "@/src/modules/profile";
import { Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const {
    profile,
    isLoading,
    isSaving,
    fetchProfile,
    addAllergy,
    removeAllergy,
    addDietaryRestriction,
    removeDietaryRestriction,
    updateAsthmaConfig,
    updateProfile,
  } = useProfileStore();

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  const handleSave = async () => {
    try {
      await updateProfile({
        allergies: profile.allergies,
        asthmaConfig: profile.asthmaConfig,
        dietaryRestrictions: profile.dietaryRestrictions,
      });
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
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
          <UserInfo user={profile.user} />

        <AllergiesSection
          allergies={profile.allergies}
          onAdd={addAllergy}
          onRemove={removeAllergy}
        />

        <AsthmaConfigurationComponent
          config={profile.asthmaConfig}
          onUpdate={updateAsthmaConfig}
        />

        <DietaryRestrictions
          restrictions={profile.dietaryRestrictions}
          onAdd={addDietaryRestriction}
          onRemove={removeDietaryRestriction}
        />

        <CurrentSession />

          <View className="px-6 pb-6 items-center opacity-40">
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
