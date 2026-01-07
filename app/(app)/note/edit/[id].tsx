import { Stack, useLocalSearchParams } from "expo-router";
import { NoteForm, useNote } from "@/src/modules/notes";
import { Loading } from "@/src/ui";

export default function EditNoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: note, isLoading } = useNote(id);

  if (!id) return null;

  if (isLoading) {
    return <Loading message="Loading note..." fullScreen />;
  }

  if (!note) {
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Edit Note",
          headerShown: false,
          presentation: "card",
        }}
      />
      <NoteForm note={note} mode="edit" />
    </>
  );
}
