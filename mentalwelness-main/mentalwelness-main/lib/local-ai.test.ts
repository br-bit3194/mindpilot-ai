import { describe, it, expect } from "vitest";
import { analyzeJournalLocal } from "./local-ai";
import { getLocalCoachResponse } from "./local-coach";

describe("analyzeJournalLocal", () => {
  it("detects mock test performance patterns", () => {
    const result = analyzeJournalLocal("My NEET mock score dropped 80 marks today", "NEET");
    expect(result.trigger).toContain("Mock");
    expect(result.hidden_patterns.length).toBeGreaterThan(0);
    expect(result.mindfulness_exercise).toBeTruthy();
    expect(result.exam_detected).toBe("NEET");
  });

  it("detects family pressure", () => {
    const result = analyzeJournalLocal("Mom keeps comparing my marks with cousin", "Boards");
    expect(result.trigger).toContain("Family");
    expect(result.hidden_patterns.some((p) => p.toLowerCase().includes("family") || p.toLowerCase().includes("guilt"))).toBe(true);
  });

  it("detects burnout with hidden patterns", () => {
    const result = analyzeJournalLocal("I want to give up, can't do this anymore");
    expect(result.burnout_risk).toBe("High");
    expect(result.hidden_patterns.length).toBe(3);
  });

  it("returns reflective default for neutral entries", () => {
    const result = analyzeJournalLocal("Had a normal study day");
    expect(result.mood).toBe("Reflective");
    expect(result.hidden_patterns.length).toBeGreaterThan(0);
  });
});

describe("getLocalCoachResponse", () => {
  it("responds to JEE physics stress", () => {
    const response = getLocalCoachResponse([], "JEE physics is destroying my confidence", "JEE");
    expect(response.toLowerCase()).toContain("physics");
  });

  it("responds to NEET biology", () => {
    const response = getLocalCoachResponse([], "NEET biology syllabus is too much", "NEET");
    expect(response.toLowerCase()).toContain("neet");
  });

  it("uses conversation history context", () => {
    const history = [
      { role: "user" as const, content: "I failed my mock test badly" },
      { role: "model" as const, content: "Mock tests are GPS updates..." },
    ];
    const response = getLocalCoachResponse(history, "I still feel terrible", "JEE");
    expect(response.toLowerCase()).toContain("mock");
  });

  it("provides default help menu", () => {
    const response = getLocalCoachResponse([], "hello", "CAT");
    expect(response).toContain("CAT");
    expect(response.toLowerCase()).toContain("mock");
  });
});
