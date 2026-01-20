import { create } from "zustand";
import type { AdvisorData, AdvisorItem, CompletedItem } from "./types";

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
}

export const useAdvisorStore = create<AdvisorState>((set, get) => ({
  data: DEFAULT_DATA,
  dismissedIds: new Set(),
  snoozedIds: new Set(),
  savedIds: new Set(),

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
    const { snoozedIds } = get();
    set({
      snoozedIds: new Set([...snoozedIds, id]),
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
    const { data, dismissedIds, snoozedIds, savedIds } = get();
    return data.items
      .filter((item) => !dismissedIds.has(item.id))
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
}));
