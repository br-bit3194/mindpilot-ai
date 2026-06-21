import { describe, it, expect } from "vitest";
import { simulateJournalAnalysis, simulateCoachResponse } from "./analysis-fallback";

describe("simulateJournalAnalysis", () => {
  it("detects burnout from exhaustion keywords", () => {
    const result = simulateJournalAnalysis("I am exhausted and can't do this anymore");
    expect(result.mood).toBe("Exhausted");
    expect(result.burnout_risk).toBe("High");
    expect(result.stress_score).toBeGreaterThan(80);
  });

  it("detects mock test anxiety", () => {
    const result = simulateJournalAnalysis("Failed my mock test today, low score");
    expect(result.mood).toBe("Anxious");
    expect(result.trigger).toBe("Mock Test Performance");
    expect(result.copingStrategies).toHaveLength(3);
  });

  it("detects social comparison stress", () => {
    const result = simulateJournalAnalysis("Everyone in coaching is better than me");
    expect(result.mood).toBe("Insecure");
    expect(result.trigger).toBe("Social Comparison");
  });

  it("returns positive default for balanced entries", () => {
    const result = simulateJournalAnalysis("Good revision day, feeling steady");
    expect(result.mood).toBe("Determined");
    expect(result.burnout_risk).toBe("Low");
  });
});

describe("simulateCoachResponse", () => {
  it("responds empathetically to giving up", () => {
    const response = simulateCoachResponse("I want to give up on JEE");
    expect(response.toLowerCase()).toContain("overwhelmed");
  });

  it("responds to mock test failure", () => {
    const response = simulateCoachResponse("I failed my mock test");
    expect(response.toLowerCase()).toContain("mock");
  });

  it("responds to sleep issues", () => {
    const response = simulateCoachResponse("I have insomnia every night");
    expect(response.toLowerCase()).toContain("sleep");
  });

  it("provides default encouragement", () => {
    const response = simulateCoachResponse("Hello coach");
    expect(response.length).toBeGreaterThan(20);
  });
});
