import { describe, it, expect } from "vitest";
import { detectCrisisLanguage, getCrisisResponse, CRISIS_HELPLINES } from "./safety";

describe("detectCrisisLanguage", () => {
  it("detects suicidal ideation", () => {
    expect(detectCrisisLanguage("I want to kill myself")).toBe(true);
    expect(detectCrisisLanguage("having suicidal thoughts")).toBe(true);
  });

  it("detects self-harm language", () => {
    expect(detectCrisisLanguage("I want to hurt myself")).toBe(true);
    expect(detectCrisisLanguage("thinking about self harm")).toBe(true);
  });

  it("returns false for normal exam stress", () => {
    expect(detectCrisisLanguage("I am stressed about my NEET mock test")).toBe(false);
    expect(detectCrisisLanguage("Feeling anxious before JEE")).toBe(false);
  });
});

describe("getCrisisResponse", () => {
  it("includes helpline references", () => {
    const response = getCrisisResponse();
    expect(response).toContain("14416");
    expect(response).toContain("1860-2662-345");
  });
});

describe("CRISIS_HELPLINES", () => {
  it("lists at least 3 helplines", () => {
    expect(CRISIS_HELPLINES.length).toBeGreaterThanOrEqual(3);
    CRISIS_HELPLINES.forEach((line) => {
      expect(line.name).toBeTruthy();
      expect(line.number).toBeTruthy();
    });
  });
});
