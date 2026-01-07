import { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { NoteDetail } from "@/src/modules/notes";
import { analyticsService, ANALYTICS_EVENTS } from "@/src/modules/analytics";

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      analyticsService.track(ANALYTICS_EVENTS.NOTE_VIEWED, { noteId: id });
    }
  }, [id]);

  if (!id) {
    return null;
  }

  return <NoteDetail noteId={id} />;
}
