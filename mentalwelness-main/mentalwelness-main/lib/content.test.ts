import { describe, it, expect } from "vitest";
import { WELLNESS_QUIZ } from "./wellnessQuiz";
import { STRESS_VIDEOS } from "./stressVideos";
import { MOOD_CONFIG } from "./types";

describe("WELLNESS_QUIZ", () => {
  it("has valid question structure", () => {
    expect(WELLNESS_QUIZ.length).toBeGreaterThanOrEqual(5);
    WELLNESS_QUIZ.forEach((q) => {
      expect(q.question).toBeTruthy();
      expect(q.options).toHaveLength(4);
      expect(q.correctAnswer).toBeGreaterThanOrEqual(0);
      expect(q.correctAnswer).toBeLessThan(4);
      expect(q.explanation).toBeTruthy();
    });
  });
});

describe("STRESS_VIDEOS", () => {
  it("covers major exams", () => {
    const allExams = STRESS_VIDEOS.flatMap((v) => v.exams);
    expect(allExams).toContain("JEE");
    expect(allExams).toContain("NEET");
    expect(allExams).toContain("UPSC");
    expect(allExams).toContain("CUET");
  });

  it("has valid youtube IDs", () => {
    STRESS_VIDEOS.forEach((v) => {
      expect(v.youtubeId).toMatch(/^[a-zA-Z0-9_-]+$/);
      expect(v.title).toBeTruthy();
    });
  });
});

describe("MOOD_CONFIG", () => {
  it("has all mood levels with valid scores", () => {
    const levels = ["great", "good", "okay", "stressed", "overwhelmed"] as const;
    levels.forEach((level) => {
      expect(MOOD_CONFIG[level].stress).toBeGreaterThanOrEqual(0);
      expect(MOOD_CONFIG[level].stress).toBeLessThanOrEqual(100);
      expect(MOOD_CONFIG[level].confidence).toBeGreaterThanOrEqual(0);
      expect(MOOD_CONFIG[level].confidence).toBeLessThanOrEqual(100);
    });
  });
});
