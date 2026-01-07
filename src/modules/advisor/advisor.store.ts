import { create } from "zustand";
import type { AdvisorData, AdvisorItem, CompletedItem } from "./types";

// Mocked advisor data
const MOCK_DATA: AdvisorData = {
  summary: {
    location: "Seattle, WA",
    riskLevel: "High Risk.",
    pollenLevel: "Pollen 8.5.",
    windSpeed: "Wind 12mph.",
  },
  items: [
    {
      id: "1",
      type: "alert",
      title: "High Pollen Count",
      description:
        "Pollen levels are peaking today. Keep windows closed and verify your inhaler is nearby before heading out.",
      timestamp: new Date().toISOString(),
    },
    {
      id: "2",
      type: "reminder",
      title: "Morning Inhaler",
      dueTime: "8:00 AM",
      isOverdue: true,
      timestamp: new Date().toISOString(),
    },
    {
      id: "3",
      type: "nutrition",
      title: "Anti-inflammatory Focus",
      description:
        "Consider adding ginger or turmeric tea to your routine today. These ingredients may help reduce systemic inflammation during high pollen days.",
      timestamp: new Date().toISOString(),
    },
    {
      id: "4",
      type: "lifestyle",
      title: "Protect Your Eyes",
      description:
        "Wind is carrying dust from the north. Wearing sunglasses outside can create a barrier against irritants.",
      timestamp: new Date().toISOString(),
    },
  ],
  completedItems: [
    {
      id: "c1",
      title: "Antihistamine",
      completedAt: "7:30 AM",
    },
  ],
};

interface AdvisorState {
  data: AdvisorData;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchAdvisorData: () => Promise<void>;
  dismissAlert: (id: string) => void;
  snoozeReminder: (id: string) => void;
  markReminderTaken: (id: string) => void;
  saveAdvice: (id: string) => void;
  dismissAdvice: (id: string) => void;
}

export const useAdvisorStore = create<AdvisorState>((set, get) => ({
  data: MOCK_DATA,
  isLoading: false,
  error: null,

  fetchAdvisorData: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({ data: MOCK_DATA, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch advisor data", isLoading: false });
    }
  },

  dismissAlert: (id: string) => {
    const currentData = get().data;
    const updatedItems = currentData.items.filter((item) => item.id !== id);
    set({
      data: {
        ...currentData,
        items: updatedItems,
      },
    });
  },

  snoozeReminder: (id: string) => {
    const currentData = get().data;
    const updatedItems = currentData.items.map((item) =>
      item.id === id && item.type === "reminder" ? { ...item, snoozed: true } : item
    );
    set({
      data: {
        ...currentData,
        items: updatedItems,
      },
    });
  },

  markReminderTaken: (id: string) => {
    const currentData = get().data;
    const reminder = currentData.items.find((item) => item.id === id);

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
          ...currentData,
          items: currentData.items.filter((item) => item.id !== id),
          completedItems: [...currentData.completedItems, completedItem],
        },
      });
    }
  },

  saveAdvice: (id: string) => {
    const currentData = get().data;
    const updatedItems = currentData.items.map((item) =>
      item.id === id && (item.type === "nutrition" || item.type === "lifestyle")
        ? { ...item, saved: true }
        : item
    );
    set({
      data: {
        ...currentData,
        items: updatedItems,
      },
    });
  },

  dismissAdvice: (id: string) => {
    const currentData = get().data;
    const updatedItems = currentData.items.filter((item) => item.id !== id);
    set({
      data: {
        ...currentData,
        items: updatedItems,
      },
    });
  },
}));
