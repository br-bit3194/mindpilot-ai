import { JournalAnalysis } from "./ai";
import { JournalEntry, MoodEntry, MOOD_CONFIG } from "./types";

export interface StressTrigger {
  name: string;
  count: number;
  impact: "High" | "Medium" | "Low";
}

export interface ChartPoint {
  date: string;
  stress: number;
  confidence: number;
}

export function aggregateStressTriggers(journals: JournalEntry[]): StressTrigger[] {
  if (journals.length === 0) return [];

  const counts: Record<string, number> = {};
  journals.forEach((j) => {
    const trigger = j.analysis.trigger;
    if (trigger) counts[trigger] = (counts[trigger] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([name, count]) => ({
      name,
      count,
      impact: (count >= 3 ? "High" : count >= 2 ? "Medium" : "Low") as StressTrigger["impact"],
    }))
    .sort((a, b) => b.count - a.count);
}

export function buildWellnessChartData(
  journals: JournalEntry[],
  moods: MoodEntry[]
): ChartPoint[] {
  const fromJournals = [...journals]
    .slice(0, 7)
    .reverse()
    .map((j) => ({
      date: new Date(j.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      stress: j.analysis.stress_score,
      confidence: j.analysis.confidence_score,
    }));

  if (fromJournals.length > 0) return fromJournals;

  return moods
    .slice(0, 7)
    .reverse()
    .map((m) => ({
      date: new Date(m.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      stress: MOOD_CONFIG[m.mood].stress,
      confidence: MOOD_CONFIG[m.mood].confidence,
    }));
}

export function getWellnessScores(
  journals: JournalEntry[],
  moods: MoodEntry[]
): {
  mood: string;
  stressScore: number;
  confidenceScore: number;
  burnoutRisk: JournalAnalysis["burnout_risk"];
} {
  const latestAnalysis = journals[0]?.analysis;
  const latestMood = moods[0];

  return {
    mood:
      latestAnalysis?.mood ||
      (latestMood ? MOOD_CONFIG[latestMood.mood].label : "Balanced"),
    stressScore:
      latestAnalysis?.stress_score ??
      (latestMood ? MOOD_CONFIG[latestMood.mood].stress : 40),
    confidenceScore:
      latestAnalysis?.confidence_score ??
      (latestMood ? MOOD_CONFIG[latestMood.mood].confidence : 70),
    burnoutRisk: latestAnalysis?.burnout_risk || "Low",
  };
}

export function calculateLevel(xp: number): number {
  return Math.floor(xp / 500) + 1;
}
