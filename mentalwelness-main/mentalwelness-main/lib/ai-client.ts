import { JournalAnalysis } from "./ai";
import { analyzeJournalLocal, ExtendedJournalAnalysis } from "./local-ai";
import { getLocalCoachResponse } from "./local-coach";

export type { JournalAnalysis, ExtendedJournalAnalysis };

/** Local AI — works instantly, no API key required */
export function analyzeJournal(
  text: string,
  examGoal = "JEE"
): ExtendedJournalAnalysis {
  return analyzeJournalLocal(text, examGoal);
}

/** Local coach chat — works instantly, no API key required */
export function getWellnessCoachResponse(
  history: { role: "user" | "model"; content: string }[],
  currentMessage: string,
  examGoal = "JEE"
): string {
  return getLocalCoachResponse(history, currentMessage, examGoal);
}
