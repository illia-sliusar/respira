export type ComfortVerdict =
  | "Very comfortable"
  | "Mostly comfortable"
  | "Acceptable with caution"
  | "Not ideal";

export interface Destination {
  id: string;
  name: string;
  duration: string;
  score: number;
  verdict: ComfortVerdict;
  verdictIcon: "check_circle" | "thumb_up" | "info" | "cloud";
  explanations: string[]; // Max 2 short explanations
}

export interface TripForecast {
  date: string;
  from: string;
}

export type DateOption = "This weekend" | "Next week" | "Custom";
