import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/src/lib/axios";
import { API_ENDPOINTS, QUERY_KEYS } from "@/src/lib/constants";
import type { Note, CreateNoteDto, UpdateNoteDto } from "@/src/types";

// Query: Get all notes
export function useNotes() {
  return useQuery({
    queryKey: QUERY_KEYS.NOTES.ALL,
    queryFn: async () => {
      const response = await apiClient.get<Note[]>(API_ENDPOINTS.NOTES.LIST);
      return response.data;
    },
  });
}

// Query: Get single note
export function useNote(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.NOTES.DETAIL(id),
    queryFn: async () => {
      const response = await apiClient.get<Note>(API_ENDPOINTS.NOTES.DETAIL(id));
      return response.data;
    },
    enabled: !!id,
  });
}

// Mutation: Create note
export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateNoteDto) => {
      const response = await apiClient.post<Note>(API_ENDPOINTS.NOTES.CREATE, data);
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTES.ALL });
    },
  });
}

// Mutation: Update note
export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateNoteDto }) => {
      const response = await apiClient.patch<Note>(API_ENDPOINTS.NOTES.UPDATE(id), data);
      return response.data;
    },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTES.ALL });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTES.DETAIL(data.id) });
    },
  });
}

// Mutation: Delete note
export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(API_ENDPOINTS.NOTES.DELETE(id));
      return id;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTES.ALL });
    },
  });
}
