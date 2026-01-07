import { useState } from "react";
import { View, Text, ScrollView, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Button, Card } from "@/src/ui";
import { useCreateNote, useUpdateNote } from "../notes.api";
import { analyticsService, ANALYTICS_EVENTS } from "@/src/modules/analytics";
import type { Note } from "@/src/types";

interface NoteFormProps {
  note?: Note;
  mode?: "create" | "edit";
}

export function NoteForm({ note, mode = "create" }: NoteFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");

  const { mutate: createNote, isPending: isCreating } = useCreateNote();
  const { mutate: updateNote, isPending: isUpdating } = useUpdateNote();

  const isPending = isCreating || isUpdating;
  const isValid = title.trim().length > 0;

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  const handleSave = () => {
    if (!isValid) return;

    if (mode === "create") {
      createNote(
        { title: title.trim(), content: content.trim() || undefined },
        {
          onSuccess: (data) => {
            analyticsService.track(ANALYTICS_EVENTS.NOTE_CREATED, {
              noteId: data.id,
              hasContent: !!content.trim(),
            });
            router.back();
          },
          onError: (error) => {
            console.error("Failed to create note:", error);
          },
        }
      );
    } else if (note) {
      updateNote(
        {
          id: note.id,
          data: {
            title: title.trim(),
            content: content.trim() || undefined,
          },
        },
        {
          onSuccess: (data) => {
            analyticsService.track(ANALYTICS_EVENTS.NOTE_UPDATED, {
              noteId: data.id,
            });
            router.back();
          },
          onError: (error) => {
            console.error("Failed to update note:", error);
          },
        }
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={[]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="bg-white px-md pt-lg pb-md border-b border-border">
            <Text className="text-2xl font-bold text-text mb-xs">
              {mode === "create" ? "Create New Note" : "Edit Note"}
            </Text>
            <View className="flex-row items-center gap-md">
              <View className="flex-row items-center gap-xs">
                <View className="w-[6px] h-[6px] rounded-full bg-primary" />
                <Text className="text-xs font-medium text-text-secondary">{wordCount} words</Text>
              </View>
              <View className="flex-row items-center gap-xs">
                <View className="w-[6px] h-[6px] rounded-full bg-success" />
                <Text className="text-xs font-medium text-text-secondary">
                  {charCount} characters
                </Text>
              </View>
            </View>
          </View>

          <View className="p-md">
            {/* Title Input */}
            <Card className="mb-md">
              <View className="mb-sm">
                <Text className="text-xs font-bold uppercase tracking-wide text-primary mb-xs">
                  Title <Text className="text-error">*</Text>
                </Text>
                <Text className="text-xs text-text-secondary mb-sm">
                  Give your note a clear, descriptive title
                </Text>
              </View>
              <TextInput
                className="text-base border-2 border-border rounded-lg p-md bg-white focus:border-primary"
                placeholder="e.g., Meeting Notes, Ideas, To-Do List..."
                placeholderTextColor="#9CA3AF"
                value={title}
                onChangeText={setTitle}
                autoFocus={mode === "create"}
                returnKeyType="next"
              />
              {title.trim().length === 0 && title.length > 0 && (
                <Text className="text-xs text-error mt-xs">Title cannot be empty</Text>
              )}
            </Card>

            {/* Content Input */}
            <Card className="mb-md">
              <View className="mb-sm">
                <Text className="text-xs font-bold uppercase tracking-wide text-primary mb-xs">
                  Content
                </Text>
                <Text className="text-xs text-text-secondary mb-sm">
                  Write your thoughts, ideas, or information here
                </Text>
              </View>
              <TextInput
                className="text-base border-2 border-border rounded-lg p-md bg-white min-h-[250px] focus:border-primary"
                placeholder="Start typing your note content..."
                placeholderTextColor="#9CA3AF"
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
              />
            </Card>

            {/* Action Buttons */}
            <View className="gap-sm mb-lg">
              <Button
                title={mode === "create" ? "📝  Create Note" : "💾  Save Changes"}
                variant="primary"
                onPress={handleSave}
                loading={isPending}
                disabled={!isValid || isPending}
                fullWidth
                size="lg"
              />
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => router.back()}
                disabled={isPending}
                fullWidth
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
