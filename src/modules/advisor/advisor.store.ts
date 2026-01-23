import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AdvisorData, AdvisorItem, CompletedItem } from "./types";

// Max snooze count before hiding reminder permanently
const MAX_SNOOZE_COUNT = 5;

// Default empty data
const DEFAULT_DATA: AdvisorData = {
  summary: {
    location: "Loading...",
    riskLevel: "",
    pollenLevel: "",
    windSpeed: "",
  },
  items: [],
  completedItems: [],
};

interface AdvisorState {
  data: AdvisorData;
  dismissedIds: Set<string>;
  snoozedIds: Set<string>;
  savedIds: Set<string>;
  // Track snooze counts by reminder title (persisted)
  reminderSnoozeCount: Record<string, number>;

  // Actions
  setData: (data: AdvisorData) => void;
  dismissAlert: (id: string) => void;
  snoozeReminder: (id: string) => void;
  markReminderTaken: (id: string) => void;
  saveAdvice: (id: string) => void;
  dismissAdvice: (id: string) => void;
  resetLocalState: () => void;

  // Getters
  getVisibleItems: () => AdvisorItem[];
  getCompletedItems: () => CompletedItem[];
  isReminderHidden: (title: string) => boolean;
}

export const useAdvisorStore = create<AdvisorState>()(
  persist(
    (set, get) => ({
      data: DEFAULT_DATA,
      dismissedIds: new Set(),
      snoozedIds: new Set(),
      savedIds: new Set(),
      reminderSnoozeCount: {},

      setData: (data: AdvisorData) => {
        set({ data });
      },

      dismissAlert: (id: string) => {
        const { dismissedIds } = get();
        set({
          dismissedIds: new Set([...dismissedIds, id]),
        });
      },

      snoozeReminder: (id: string) => {
        const { snoozedIds, data, reminderSnoozeCount } = get();
        // Find the reminder to get its title for tracking
        const reminder = data.items.find((item) => item.id === id);
        const title = reminder?.title ?? id;

        // Increment snooze count for this reminder type
        const currentCount = reminderSnoozeCount[title] ?? 0;
        const newCount = currentCount + 1;

        set({
          snoozedIds: new Set([...snoozedIds, id]),
          reminderSnoozeCount: {
            ...reminderSnoozeCount,
            [title]: newCount,
          },
        });
      },

      markReminderTaken: (id: string) => {
        const { data, dismissedIds } = get();
        const reminder = data.items.find((item) => item.id === id);

        if (reminder && reminder.type === "reminder") {
          const completedItem: CompletedItem = {
            id: `c-${id}`,
            title: reminder.title,
            completedAt: new Date().toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
          };

          set({
            data: {
              ...data,
              completedItems: [...data.completedItems, completedItem],
            },
            dismissedIds: new Set([...dismissedIds, id]),
          });
        }
      },

      saveAdvice: (id: string) => {
        const { savedIds } = get();
        set({
          savedIds: new Set([...savedIds, id]),
        });
      },

      dismissAdvice: (id: string) => {
        const { dismissedIds } = get();
        set({
          dismissedIds: new Set([...dismissedIds, id]),
        });
      },

      resetLocalState: () => {
        set({
          dismissedIds: new Set(),
          snoozedIds: new Set(),
          savedIds: new Set(),
          data: {
            ...get().data,
            completedItems: [],
          },
        });
      },

      getVisibleItems: () => {
        const { data, dismissedIds, snoozedIds, savedIds, reminderSnoozeCount } = get();
        return data.items
          .filter((item) => {
            // Filter out dismissed items
            if (dismissedIds.has(item.id)) return false;
            // Filter out reminders that have been snoozed 5+ times
            if (item.type === "reminder") {
              const snoozeCount = reminderSnoozeCount[item.title] ?? 0;
              if (snoozeCount >= MAX_SNOOZE_COUNT) return false;
            }
            return true;
          })
          .map((item) => {
            if (item.type === "reminder" && snoozedIds.has(item.id)) {
              return { ...item, snoozed: true };
            }
            if ((item.type === "nutrition" || item.type === "lifestyle") && savedIds.has(item.id)) {
              return { ...item, saved: true };
            }
            return item;
          });
      },

      getCompletedItems: () => {
        return get().data.completedItems;
      },

      isReminderHidden: (title: string) => {
        const { reminderSnoozeCount } = get();
        return (reminderSnoozeCount[title] ?? 0) >= MAX_SNOOZE_COUNT;
      },
    }),
    {
      name: "respira-advisor",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Only persist snooze counts - other state is session-based
        reminderSnoozeCount: state.reminderSnoozeCount,
      }),
    }
  )
);
