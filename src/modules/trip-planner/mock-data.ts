import type { Destination, DateOption } from "./types";

export const MOCK_DESTINATIONS: Destination[] = [
  {
    id: "1",
    name: "Portland, OR",
    duration: "3 hr drive",
    score: 9.8,
    verdict: "Very comfortable",
    verdictIcon: "check_circle",
    explanations: ["Low pollen expected", "Clean air throughout the weekend"],
  },
  {
    id: "2",
    name: "Vancouver, BC",
    duration: "2.5 hr drive",
    score: 8.5,
    verdict: "Mostly comfortable",
    verdictIcon: "thumb_up",
    explanations: ["Fresh ocean breeze", "Evening humidity may trigger symptoms"],
  },
  {
    id: "3",
    name: "Leavenworth",
    duration: "2 hr drive",
    score: 7.2,
    verdict: "Acceptable with caution",
    verdictIcon: "info",
    explanations: ["Dry air and dust likely", "Best for indoor activities"],
  },
  {
    id: "4",
    name: "Spokane, WA",
    duration: "4.5 hr drive",
    score: 6.1,
    verdict: "Not ideal",
    verdictIcon: "cloud",
    explanations: ["High grass pollen", "Consider postponing if sensitive"],
  },
];

export const DATE_OPTIONS: DateOption[] = ["This weekend", "Next week"];

export const DEFAULT_FORECAST = {
  date: "This weekend" as DateOption,
  from: "Seattle, WA",
};
