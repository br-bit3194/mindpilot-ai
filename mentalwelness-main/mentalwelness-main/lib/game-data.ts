export const GRATITUDE_PROMPTS = [
  "Someone who encouraged you today",
  "One concept you understood better",
  "A small win, however tiny",
  "Something your body did well (sleep, walk, meal)",
  "A moment you stayed calm under pressure",
  "A chapter you showed up for, even when tired",
  "A tool that helped you study (notes, app, timer)",
  "One thing you're grateful to past-you for doing",
];

export interface CalmOrStressRound {
  scenario: string;
  calm: string;
  stress: string;
}

export const CALM_OR_STRESS_ROUNDS: CalmOrStressRound[] = [
  {
    scenario: "Mock test score dropped 50 marks",
    calm: "Log 3 errors and revise those concepts calmly",
    stress: "Take another full mock immediately to prove yourself",
  },
  {
    scenario: "Friend finished the syllabus before you",
    calm: "Mute group chat and focus on your next chapter",
    stress: "Speed-read 3 chapters tonight to catch up",
  },
  {
    scenario: "Couldn't solve a problem for 20 minutes",
    calm: "Mark it, move on, return after easier questions",
    stress: "Stay stuck until you solve it no matter how long",
  },
  {
    scenario: "Parents asked about your rank again",
    calm: "Share one process win (habit, chapter, sleep routine)",
    stress: "Promise a rank you can't guarantee to end the talk",
  },
  {
    scenario: "Feeling sleepy during afternoon study",
    calm: "10-min walk + water, then one 25-min Pomodoro",
    stress: "Drink more coffee and push through 4 more hours",
  },
  {
    scenario: "Exam is 7 days away and syllabus feels incomplete",
    calm: "List high-weightage topics and prioritize top 5",
    stress: "Panic-study everything randomly for 14 hours",
  },
  {
    scenario: "Made a silly mistake in today's practice",
    calm: "Add it to error log — silly mistakes are fixable",
    stress: "Tell yourself you're not smart enough for this exam",
  },
  {
    scenario: "Couldn't sleep because of exam thoughts",
    calm: "Sleep Meditation + write worries on paper, close book",
    stress: "Open books in bed and study until you fall asleep",
  },
  {
    scenario: "Skipped study break to 'save time'",
    calm: "Take a 5-min Breath Challenge, then resume fresh",
    stress: "Keep studying 3 hours straight without any break",
  },
  {
    scenario: "Compared your mock percentile to a topper",
    calm: "Compare today's you vs. you from 30 days ago",
    stress: "Decide you're not topper material and slow down",
  },
];

export const ZEN_MEMORY_PAIRS = [
  { id: "meditate", emoji: "🧘", label: "Meditate" },
  { id: "calm", emoji: "😌", label: "Stay Calm" },
  { id: "sleep", emoji: "🌙", label: "Rest" },
  { id: "focus", emoji: "🎯", label: "Focus" },
  { id: "breathe", emoji: "🌊", label: "Breathe" },
  { id: "grateful", emoji: "💚", label: "Gratitude" },
];

export const AFFIRMATIONS = [
  "I am preparing with patience, not panic.",
  "One bad mock does not define my exam day.",
  "Rest is part of my strategy, not laziness.",
  "I compare myself only to who I was yesterday.",
  "Stress is information — I listen, then I act.",
  "My effort today compounds into exam-day confidence.",
  "I deserve kindness from myself, especially now.",
  "Every chapter I attempt makes me stronger.",
];
