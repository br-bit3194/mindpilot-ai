export interface WellnessQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const WELLNESS_QUIZ: WellnessQuestion[] = [
  {
    question:
      "What is the best response when you cannot solve a question in the first 2 minutes of a competitive exam?",
    options: [
      "Keep trying for another 10 minutes",
      "Guess randomly and move on",
      "Mark for review, solve easier questions first, return later",
      "Derive the formula from scratch on the spot",
    ],
    correctAnswer: 2,
    explanation:
      "Securing easy marks first prevents time drain and keeps stress low. Return to hard questions with a calmer mind.",
  },
  {
    question:
      "Which study technique breaks long sessions into focused intervals with short breaks?",
    options: [
      "Feynman Technique",
      "Pomodoro Technique",
      "Spaced Repetition",
      "Mind Mapping",
    ],
    correctAnswer: 1,
    explanation:
      "Pomodoro (25 min focus + 5 min break) prevents mental fatigue and sustains concentration through long prep days.",
  },
  {
    question:
      "Under acute stress, which hormone does the adrenal gland primarily release?",
    options: ["Melatonin", "Cortisol", "Thyroxine", "Serotonin"],
    correctAnswer: 1,
    explanation:
      "Cortisol spikes during stress. Recognizing this helps you pause and use breathing exercises before it hijacks focus.",
  },
  {
    question:
      "Which sleep stage is most critical for consolidating facts studied during the day?",
    options: [
      "Light Sleep",
      "Deep Sleep (Slow Wave)",
      "REM Sleep",
      "Drowsiness",
    ],
    correctAnswer: 1,
    explanation:
      "Deep sleep cements declarative memory (formulas, facts, concepts). Skipping sleep actively hurts exam recall.",
  },
  {
    question:
      "How does self-compassion affect test anxiety according to research?",
    options: [
      "It makes students lazy",
      "It reduces panic and improves logical reasoning",
      "It has no effect on performance",
      "It increases fear of failure",
    ],
    correctAnswer: 1,
    explanation:
      "Treating yourself kindly after mistakes lowers threat responses, freeing the prefrontal cortex for logical recall.",
  },
  {
    question:
      "After a disappointing mock test score, what is the healthiest first step?",
    options: [
      "Take another mock immediately to prove yourself",
      "Compare scores with coaching group chat",
      "Analyze top 3 error types and review those concepts",
      "Skip studying for the rest of the day",
    ],
    correctAnswer: 2,
    explanation:
      "Error analysis turns diagnostic data into growth. Comparing scores or rushing another mock fuels anxiety cycles.",
  },
  {
    question:
      "What is the 4-4-4-4 breathing pattern commonly called?",
    options: [
      "Diaphragmatic Breathing",
      "Box Breathing",
      "Alternate Nostril",
      "Wim Hof Method",
    ],
    correctAnswer: 1,
    explanation:
      "Box breathing (inhale 4s, hold 4s, exhale 4s, hold 4s) quickly activates the parasympathetic nervous system.",
  },
  {
    question:
      "When feeling overwhelmed by syllabus backlog, what helps most?",
    options: [
      "Study everything at once without breaks",
      "Mute comparison triggers and focus on one chapter today",
      "Quit the exam prep entirely",
      "Study only what friends are studying",
    ],
    correctAnswer: 1,
    explanation:
      "One focused chapter beats scattered panic. Reducing social comparison removes a major hidden stress trigger.",
  },
];
