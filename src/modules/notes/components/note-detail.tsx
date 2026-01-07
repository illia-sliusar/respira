import { View, Text, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Button, Loading, Card } from "@/src/ui";
import { useNote, useDeleteNote } from "../notes.api";
import { analyticsService, ANALYTICS_EVENTS } from "@/src/modules/analytics";
import type { Note } from "@/src/types";

// Mock data for when API is unavailable
const MOCK_NOTES: Record<string, Note> = {
  "1": {
    id: "1",
    title: "Welcome to Notes",
    content:
      "This is your first note! You can create, edit, and delete notes. Notes support plain text content and are automatically saved to the server.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

interface NoteDetailProps {
  noteId: string;
}

export function NoteDetail({ noteId }: NoteDetailProps) {
  const router = useRouter();
  const { data: apiNote, isLoading } = useNote(noteId);
  const { mutate: deleteNote, isPending: isDeleting } = useDeleteNote();

  // Use mock data if API returns nothing
  const note = apiNote ?? MOCK_NOTES[noteId];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Note",
      `Are you sure you want to delete "${note?.title}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteNote(noteId, {
              onSuccess: () => {
                analyticsService.track(ANALYTICS_EVENTS.NOTE_DELETED, {
                  noteId,
                });
                router.back();
              },
              onError: () => Alert.alert("Error", "Could not delete note"),
            });
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <Loading message="Loading note..." fullScreen />;
  }

  if (!note) {
    return (
      <View className="flex-1 items-center justify-center p-xl">
        <Text className="text-xl font-semibold text-secondary mb-lg">Note not found</Text>
        <Button title="Go Back" onPress={() => router.back()} variant="outline" />
      </View>
    );
  }

  const wordCount = note.content ? note.content.trim().split(/\s+/).length : 0;
  const charCount = note.content ? note.content.length : 0;
  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute

  return (
    <ScrollView className="flex-1 bg-surface">
      {/* Header Section */}
      <View className="bg-white px-md pt-lg pb-md border-b border-border">
        <Text className="text-3xl font-bold text-text mb-md">{note.title}</Text>

        {/* Stats Row */}
        <View className="flex-row gap-md">
          <View className="flex-row items-center gap-xs">
            <View className="w-[8px] h-[8px] rounded-full bg-primary" />
            <Text className="text-xs font-medium text-text-secondary">{wordCount} words</Text>
          </View>
          <View className="flex-row items-center gap-xs">
            <View className="w-[8px] h-[8px] rounded-full bg-success" />
            <Text className="text-xs font-medium text-text-secondary">{charCount} characters</Text>
          </View>
          <View className="flex-row items-center gap-xs">
            <View className="w-[8px] h-[8px] rounded-full bg-warning" />
            <Text className="text-xs font-medium text-text-secondary">
              {estimatedReadTime} min read
            </Text>
          </View>
        </View>
      </View>

      <View className="p-md">
        {/* Content Section */}
        <Card className="mb-md">
          <View className="mb-sm">
            <Text className="text-xs font-bold uppercase tracking-wide text-primary">Content</Text>
          </View>
          {note.content ? (
            <Text className="text-base text-text leading-7">{note.content}</Text>
          ) : (
            <Text className="text-base text-text-secondary italic">No content available</Text>
          )}
        </Card>

        {/* Metadata Section */}
        <Card className="mb-md">
          <View className="mb-md">
            <Text className="text-xs font-bold uppercase tracking-wide text-primary">Metadata</Text>
          </View>

          <View className="gap-sm">
            <View className="flex-row items-center justify-between py-sm px-sm bg-surface rounded-md">
              <Text className="text-sm font-medium text-text-secondary">Created</Text>
              <Text className="text-sm font-semibold text-text">{formatDate(note.createdAt)}</Text>
            </View>
            <View className="flex-row items-center justify-between py-sm px-sm bg-surface rounded-md">
              <Text className="text-sm font-medium text-text-secondary">Last Updated</Text>
              <Text className="text-sm font-semibold text-text">{formatDate(note.updatedAt)}</Text>
            </View>
            <View className="flex-row items-center justify-between py-sm px-sm bg-surface rounded-md">
              <Text className="text-sm font-medium text-text-secondary">Note ID</Text>
              <Text className="text-xs font-mono text-text-muted">{noteId}</Text>
            </View>
          </View>
        </Card>

        {/* Actions */}
        <View className="gap-sm mb-lg">
          <Button
            title="✏️  Edit Note"
            variant="primary"
            onPress={() => router.push(`/note/edit/${noteId}` as never)}
            fullWidth
            size="lg"
          />
          <Button
            title="🗑️  Delete Note"
            variant="outline"
            onPress={handleDelete}
            loading={isDeleting}
            fullWidth
            size="lg"
            className="border-error"
          />
        </View>
      </View>
    </ScrollView>
  );
}
