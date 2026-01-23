import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useProfileStore } from "@/src/modules/profile";
import { useModal } from "@/src/ui";

// Directory for storing avatar images
const AVATAR_DIR = `${FileSystem.documentDirectory}avatars/`;

// Save image to persistent local storage
async function saveImageLocally(uri: string): Promise<string> {
  // Ensure avatar directory exists
  const dirInfo = await FileSystem.getInfoAsync(AVATAR_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(AVATAR_DIR, { intermediates: true });
  }

  // Generate unique filename
  const filename = `avatar_${Date.now()}.jpg`;
  const destPath = `${AVATAR_DIR}${filename}`;

  // Copy image to persistent storage
  await FileSystem.copyAsync({
    from: uri,
    to: destPath,
  });

  return destPath;
}

export default function UserDetailsScreen() {
  const { showAlert } = useModal();
  const {
    profile,
    isSaving,
    updateUserDetails,
    fetchProfile,
    isLoading: isProfileLoading,
    setLocalAvatar,
  } = useProfileStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUri, setAvatarUri] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch fresh profile data from backend
    void fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    setFirstName(profile.user.firstName || "");
    setLastName(profile.user.lastName || "");
    setEmail(profile.user.email);
    setAvatarUri(profile.user.avatarUrl);
  }, [profile.user]);

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      await showAlert({
        title: "Permission Required",
        message: "Please allow access to your photo library to upload an avatar.",
        variant: "warning",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        // Save image to persistent local storage
        const localPath = await saveImageLocally(result.assets[0].uri);
        setAvatarUri(localPath);
      } catch (error) {
        console.error("Failed to save image:", error);
        await showAlert({
          title: "Error",
          message: "Failed to save image. Please try again.",
          variant: "danger",
        });
      }
    }
  };

  const handleSave = async () => {
    if (!firstName.trim()) {
      await showAlert({
        title: "Missing Information",
        message: "First name is required.",
        variant: "warning",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Save avatar locally (not to backend)
      if (avatarUri) {
        setLocalAvatar(avatarUri);
      }

      // Build full name for Better Auth compatibility
      const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");

      // Update name fields on backend (avatar is stored locally only)
      await updateUserDetails({
        name: fullName,
        firstName: firstName.trim(),
        lastName: lastName.trim() || null,
      });

      await showAlert({
        title: "Saved",
        message: "Your profile has been updated successfully.",
        variant: "success",
      });
      router.back();
    } catch {
      await showAlert({
        title: "Error",
        message: "Failed to update profile. Please try again.",
        variant: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-neutral-800">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center"
          >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold">Edit Profile</Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={isSaving || isLoading}
            className="w-10 h-10 items-center justify-center"
          >
            {isSaving || isLoading ? (
              <ActivityIndicator size="small" color="#3b82f6" />
            ) : (
              <MaterialIcons name="check" size={24} color="#3b82f6" />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {isProfileLoading && (
            <View className="items-center py-4">
              <ActivityIndicator size="small" color="#3b82f6" />
              <Text className="text-neutral-400 text-sm mt-2">Loading profile...</Text>
            </View>
          )}

          {/* Avatar Section */}
          <View className="items-center py-8">
            <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8}>
              <View className="relative">
                {avatarUri ? (
                  <Image
                    source={{ uri: avatarUri }}
                    className="w-28 h-28 rounded-full"
                    style={{ width: 112, height: 112, borderRadius: 56 }}
                  />
                ) : (
                  <View className="w-28 h-28 rounded-full bg-neutral-800 items-center justify-center">
                    <Text className="text-4xl font-semibold text-white">
                      {firstName.charAt(0).toUpperCase() || "?"}
                    </Text>
                  </View>
                )}
                <View className="absolute bottom-0 right-0 w-9 h-9 bg-blue-600 rounded-full items-center justify-center border-2 border-black">
                  <MaterialIcons name="camera-alt" size={18} color="#fff" />
                </View>
              </View>
            </TouchableOpacity>
            <Text className="text-neutral-400 text-sm mt-3">
              Tap to change photo
            </Text>
          </View>

          {/* Form Fields */}
          <View className="px-6 gap-5">
            {/* First Name */}
            <View>
              <Text className="text-neutral-400 text-sm font-medium mb-2">
                First Name
              </Text>
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
                placeholderTextColor="#525252"
                className="bg-neutral-900 text-white px-4 py-4 rounded-xl text-base"
                style={{ fontSize: 16, color: "#fff" }}
                autoCapitalize="words"
              />
            </View>

            {/* Last Name */}
            <View>
              <Text className="text-neutral-400 text-sm font-medium mb-2">
                Last Name
              </Text>
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
                placeholderTextColor="#525252"
                className="bg-neutral-900 text-white px-4 py-4 rounded-xl text-base"
                style={{ fontSize: 16, color: "#fff" }}
                autoCapitalize="words"
              />
            </View>

            {/* Email (read-only) */}
            <View>
              <Text className="text-neutral-400 text-sm font-medium mb-2">
                Email
              </Text>
              <TextInput
                value={email}
                editable={false}
                placeholder="Email"
                placeholderTextColor="#525252"
                className="bg-neutral-900/50 text-neutral-400 px-4 py-4 rounded-xl text-base"
                style={{ fontSize: 16, color: "#a3a3a3" }}
              />
              <Text className="text-neutral-500 text-xs mt-1">
                Email cannot be changed
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
