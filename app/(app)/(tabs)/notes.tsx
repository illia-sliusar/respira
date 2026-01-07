import { useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { NotesList } from "@/src/modules/notes";
import { analyticsService } from "@/src/modules/analytics";
import { Ionicons } from "@expo/vector-icons";

export default function NotesScreen() {
  const router = useRouter();

  useEffect(() => {
    analyticsService.screen("Notes");
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: "My Notes",
          headerShown: true,
          headerLargeTitle: true,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/note/create" as never)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              className="mr-sm"
            >
              <View className="bg-primary rounded-full w-[32px] h-[32px] items-center justify-center">
                <Ionicons name="add" size={24} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <View className="flex-1">
        <NotesList />
      </View>
    </SafeAreaView>
  );
}
