import { Stack } from "expo-router";
import { NoteForm } from "@/src/modules/notes";

export default function CreateNoteScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Create Note",
          headerShown: false,
          presentation: "card",
        }}
      />
      <NoteForm mode="create" />
    </>
  );
}
