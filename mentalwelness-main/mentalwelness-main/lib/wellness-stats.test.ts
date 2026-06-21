import { describe, it, expect } from "vitest";
import {
  aggregateStressTriggers,
  buildWellnessChartData,
  getWellnessScores,
  calculateLevel,
} from "./wellness-stats";
import { JournalEntry } from "./types";
import { JournalAnalysis } from "./ai";

const mockAnalysis = (overrides: Partial<JournalAnalysis> = {}): JournalAnalysis => ({
  mood: "Anxious",
  stress_score: 75,
  confidence_score: 50,
  burnout_risk: "Medium",
  trigger: "Mock Test Performance",
  insight: "Test insight",
  copingStrategies: ["Strategy 1", "Strategy 2", "Strategy 3"],
  ...overrides,
});

const mockJournal = (trigger: string, id = "1"): JournalEntry => ({
  id,
  date: new Date().toISOString(),
  text: "Test entry",
  analysis: mockAnalysis({ trigger }),
});

describe("aggregateStressTriggers", () => {
  it("returns empty array for no journals", () => {
    expect(aggregateStressTriggers([])).toEqual([]);
  });

  it("counts and ranks triggers by frequency", () => {
    const journals = [
      mockJournal("Mock Test Performance", "1"),
      mockJournal("Mock Test Performance", "2"),
      mockJournal("Lack of Sleep", "3"),
    ];
    const triggers = aggregateStressTriggers(journals);
    expect(triggers[0].name).toBe("Mock Test Performance");
    expect(triggers[0].count).toBe(2);
    expect(triggers[0].impact).toBe("Medium");
  });

  it("marks high impact for 3+ occurrences", () => {
    const journals = Array.from({ length: 3 }, (_, i) =>
      mockJournal("Peer Comparison", String(i))
    );
    const triggers = aggregateStressTriggers(journals);
    expect(triggers[0].impact).toBe("High");
  });
});

describe("buildWellnessChartData", () => {
  it("builds chart from journals when available", () => {
    const journals = [mockJournal("Test", "1"), mockJournal("Test", "2")];
    const data = buildWellnessChartData(journals, []);
    expect(data.length).toBe(2);
    expect(data[0]).toHaveProperty("stress");
    expect(data[0]).toHaveProperty("confidence");
  });

  it("falls back to mood data when no journals", () => {
    const moods = [
      {
        id: "1",
        date: new Date().toISOString(),
        mood: "stressed" as const,
      },
    ];
    const data = buildWellnessChartData([], moods);
    expect(data.length).toBe(1);
    expect(data[0].stress).toBe(75);
  });
});

describe("getWellnessScores", () => {
  it("prefers journal analysis over mood", () => {
    const journals = [mockJournal("Test")];
    const moods = [{ id: "1", date: new Date().toISOString(), mood: "great" as const }];
    const scores = getWellnessScores(journals, moods);
    expect(scores.mood).toBe("Anxious");
    expect(scores.stressScore).toBe(75);
  });

  it("uses mood defaults when no journals", () => {
    const moods = [{ id: "1", date: new Date().toISOString(), mood: "great" as const }];
    const scores = getWellnessScores([], moods);
    expect(scores.mood).toBe("Great");
    expect(scores.stressScore).toBe(20);
  });
});

describe("calculateLevel", () => {
  it("calculates level from XP", () => {
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(500)).toBe(2);
    expect(calculateLevel(999)).toBe(2);
    expect(calculateLevel(1000)).toBe(3);
  });
});
