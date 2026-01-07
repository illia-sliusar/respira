// Advisor types

export type AdviceType = "alert" | "reminder" | "nutrition" | "lifestyle";

export interface AlertItem {
  id: string;
  type: "alert";
  title: string;
  description: string;
  timestamp: string;
  dismissed?: boolean;
}

export interface ReminderItem {
  id: string;
  type: "reminder";
  title: string;
  dueTime: string;
  isOverdue: boolean;
  snoozed?: boolean;
  completed?: boolean;
  timestamp: string;
}

export interface AdviceItem {
  id: string;
  type: "nutrition" | "lifestyle";
  title: string;
  description: string;
  saved?: boolean;
  dismissed?: boolean;
  timestamp: string;
}

export interface CompletedItem {
  id: string;
  title: string;
  completedAt: string;
}

export type AdvisorItem = AlertItem | ReminderItem | AdviceItem;

export interface HealthSummary {
  location: string;
  riskLevel: string;
  pollenLevel: string;
  windSpeed: string;
}

export interface AdvisorData {
  summary: HealthSummary;
  items: AdvisorItem[];
  completedItems: CompletedItem[];
}
