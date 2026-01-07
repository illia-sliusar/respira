import { View, Text, FlatList, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { Card, Loading, EmptyState } from "@/src/ui";
import { useNotes } from "../notes.api";
import type { Note } from "@/src/types";

export function NotesList() {
  const router = useRouter();
  const { data: notes, isLoading, refetch, isRefetching } = useNotes();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getWordCount = (content: string) => {
    if (!content) return 0;
    return content.trim().split(/\s+/).length;
  };

  const renderNote = ({ item }: { item: Note }) => {
    const wordCount = getWordCount(item.content || "");
    const hasContent = item.content && item.content.length > 0;

    return (
      <Card
        className="mb-md bg-white border border-border"
        pressable
        onPress={() => router.push(`/note/${item.id}` as never)}
        activeOpacity={0.8}
      >
        <View className="flex-row items-start justify-between mb-sm">
          <Text className="text-lg font-bold text-text flex-1 mr-sm" numberOfLines={1}>
            {item.title}
          </Text>
          <View className="bg-primary/10 px-sm py-xs rounded-md">
            <Text className="text-xs font-medium text-primary">{wordCount} words</Text>
          </View>
        </View>

        {hasContent && (
          <Text className="text-base text-text-secondary mb-md leading-6" numberOfLines={3}>
            {item.content}
          </Text>
        )}

        <View className="flex-row items-center justify-between pt-sm border-t border-divider">
          <View className="flex-row items-center gap-xs">
            <View className="w-[6px] h-[6px] rounded-full bg-success" />
            <Text className="text-xs font-medium text-text-secondary">
              {formatDate(item.updatedAt)}
            </Text>
          </View>
          <Text className="text-xs text-primary font-medium">View →</Text>
        </View>
      </Card>
    );
  };

  if (isLoading) {
    return <Loading message="Loading notes..." fullScreen />;
  }

  if (!notes || notes.length === 0) {
    return (
      <EmptyState
        title="No notes yet"
        message="Tap the + button to create your first note and start organizing your thoughts"
      />
    );
  }

  return (
    <FlatList
      data={notes}
      keyExtractor={(item) => item.id}
      renderItem={renderNote}
      contentContainerClassName="p-md"
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />}
    />
  );
}
