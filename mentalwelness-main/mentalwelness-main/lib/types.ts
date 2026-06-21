import { ExtendedJournalAnalysis } from "./local-ai";

export interface JournalEntry {
  id: string;
  date: string;
  text: string;
  analysis: ExtendedJournalAnalysis;
}

export type MoodLevel = "great" | "good" | "okay" | "stressed" | "overwhelmed";

export interface MoodEntry {
  id: string;
  date: string;
  mood: MoodLevel;
  note?: string;
}

export type TabId =
  | "dashboard"
  | "journal"
  | "coach"
  | "meditation"
  | "videos"
  | "games";

export const MOOD_CONFIG: Record<
  MoodLevel,
  { label: string; emoji: string; stress: number; confidence: number }
> = {
  great: { label: "Great", emoji: "😊", stress: 20, confidence: 90 },
  good: { label: "Good", emoji: "🙂", stress: 35, confidence: 75 },
  okay: { label: "Okay", emoji: "😐", stress: 50, confidence: 60 },
  stressed: { label: "Stressed", emoji: "😰", stress: 75, confidence: 40 },
  overwhelmed: { label: "Overwhelmed", emoji: "😞", stress: 90, confidence: 25 },
};
