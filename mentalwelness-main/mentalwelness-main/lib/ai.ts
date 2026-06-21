// lib/ai.ts

import { analyzeJournalLocal } from "./local-ai";
import { getLocalCoachResponse } from "./local-coach";
import { detectCrisisLanguage, getCrisisResponse } from "./safety";

export interface JournalAnalysis {
  mood: string;
  stress_score: number;
  confidence_score: number;
  burnout_risk: "Low" | "Medium" | "High";
  trigger: string;
  insight: string;
  copingStrategies: string[];
}

const getGeminiApiKey = () => process.env.GEMINI_API_KEY || "";

// Main function to call Gemini API
async function callGemini(prompt: string, jsonMode: boolean = false): Promise<string> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("No Gemini API Key found");
  }

  const model = "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: jsonMode
        ? {
            responseMimeType: "application/json",
          }
        : undefined,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textContent) {
    throw new Error("Empty response from Gemini API");
  }

  return textContent;
}

// 1. Journal Analysis
export async function analyzeJournal(text: string): Promise<JournalAnalysis> {
  try {
    const prompt = `
      You are an expert student psychologist and mental wellness coach helping competitive exam aspirants (JEE, NEET, UPSC, CAT, etc.).
      Analyze the following student daily journal entry. 
      Output a valid JSON object ONLY, adhering exactly to the following TypeScript interface:
      
      interface JournalAnalysis {
        mood: string; // The primary mood (e.g. "Anxious", "Determined", "Exhausted", "Proud", "Disappointed")
        stress_score: number; // A percentage stress rating from 0 (no stress) to 100 (extreme stress)
        confidence_score: number; // A percentage confidence rating from 0 (no confidence) to 100 (high confidence)
        burnout_risk: "Low" | "Medium" | "High";
        trigger: string; // The primary source of stress or mood (e.g., "Mock Test Performance", "Peer Comparison", "Study Hours", "Lack of Sleep", "Exam Anxiety", "Family Pressure")
        insight: string; // A 2-sentence therapeutic observation detailing the pattern and how it impacts their prep.
        copingStrategies: string[]; // 3 personalized, highly actionable coping steps (e.g. a specific breathing exercise, a shift in study strategy, a rest recommendation).
      }

      Journal Entry: "${text}"
    `;
    const jsonText = await callGemini(prompt, true);
    return JSON.parse(jsonText.trim()) as JournalAnalysis;
  } catch (error) {
    console.warn("Gemini API not available, falling back to local AI:", error);
    return analyzeJournalLocal(text);
  }
}

// Local-first journal (used when no API key — same powerful engine)
export function analyzeJournalLocalExport(text: string, examGoal?: string) {
  return analyzeJournalLocal(text, examGoal);
}

// 2. Chat Coach Response
export async function getWellnessCoachResponse(
  history: { role: "user" | "model"; content: string }[],
  currentMessage: string
): Promise<string> {
  if (detectCrisisLanguage(currentMessage)) {
    return getCrisisResponse();
  }

  try {
    const formattedHistory = history
      .map((msg) => `${msg.role === "user" ? "Student" : "MindMate Coach"}: ${msg.content}`)
      .join("\n");

    const prompt = `
      You are MindMate, a warm, highly empathetic, and encouraging AI Wellness Coach for competitive exam aspirants.
      The student is preparing for high-stakes exams (like JEE, NEET, UPSC, GATE, CAT).
      Respond to the student's message with a helpful, motivational, and practical response.
      Keep it brief, comforting, and focused on self-compassion, structured recovery, and effective stress management.
      Do not give generic advice. Be specific. If they completed a session or study task, praise their work.
      
      Conversation history:
      ${formattedHistory}
      Student: ${currentMessage}
      MindMate Coach:
    `;
    return await callGemini(prompt, false);
  } catch (error) {
    console.warn("Gemini API not available, falling back to local coach");
    return getLocalCoachResponse(history, currentMessage);
  }
}
