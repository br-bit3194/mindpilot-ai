export type ExamType = "JEE" | "NEET" | "UPSC" | "CAT" | "GATE" | "CUET" | "Boards" | "General";

export interface WellnessTopic {
  id: string;
  category: "stress" | "burnout" | "confidence" | "sleep" | "focus" | "exam-day" | "family";
  exam: ExamType[];
  label: string;
  journalPrompt: string;
  coachPrompt: string;
}

export const WELLNESS_TOPICS: WellnessTopic[] = [
  // NEET
  {
    id: "neet-bio-overload",
    category: "burnout",
    exam: ["NEET"],
    label: "Biology syllabus overload",
    journalPrompt:
      "The NEET biology syllabus feels endless. Today I tried to revise human physiology but forgot topics I studied last week. I feel my memory is failing me.",
    coachPrompt: "I'm drowning in NEET biology — too many chapters, can't retain anything",
  },
  {
    id: "neet-cutoff",
    category: "exam-day",
    exam: ["NEET"],
    label: "NEET cutoff anxiety",
    journalPrompt:
      "Everyone says cutoff will be 650+ this year. My last mock was 520. I keep calculating how many more marks I need and it's making me panic.",
    coachPrompt: "NEET cutoff stress is eating me alive — my mock score feels too low",
  },
  // JEE
  {
    id: "jee-physics",
    category: "stress",
    exam: ["JEE"],
    label: "Physics problem-solving pressure",
    journalPrompt:
      "Spent 3 hours on JEE Advanced mechanics problems and solved only 4. My friends solve 15 in the same time. I feel stupid and slow.",
    coachPrompt: "JEE physics is destroying my confidence — I can't solve problems fast enough",
  },
  {
    id: "jee-rank",
    category: "confidence",
    exam: ["JEE"],
    label: "Rank & percentile obsession",
    journalPrompt:
      "Checked my predicted rank again. It's in the 50k range. Parents don't say anything but I know they're worried. I can't stop thinking about it.",
    coachPrompt: "I keep obsessing over my JEE predicted rank and it's ruining my focus",
  },
  // UPSC
  {
    id: "upsc-marathon",
    category: "burnout",
    exam: ["UPSC"],
    label: "Multi-year prep fatigue",
    journalPrompt:
      "This is my second attempt at UPSC Mains. I've been preparing for 3 years. Friends are getting jobs and I'm still reading newspapers at 5 AM feeling stuck.",
    coachPrompt: "UPSC prep feels like a never-ending marathon — I'm exhausted after 2 attempts",
  },
  {
    id: "upsc-answer-writing",
    category: "stress",
    exam: ["UPSC"],
    label: "Answer writing anxiety",
    journalPrompt:
      "Tried answer writing practice today. The evaluator said my structure was weak. I know content but can't express it under time pressure.",
    coachPrompt: "UPSC answer writing under time pressure makes me freeze up completely",
  },
  // CAT
  {
    id: "cat-time",
    category: "exam-day",
    exam: ["CAT"],
    label: "CAT time pressure",
    journalPrompt:
      "Did a timed CAT mock — left 8 questions unattempted in QA. The clock anxiety made me misread two easy DI sets. I panic when the timer turns red.",
    coachPrompt: "CAT time pressure makes me panic and misread questions I know",
  },
  {
    id: "cat-varc",
    category: "stress",
    exam: ["CAT"],
    label: "VARC section anxiety",
    journalPrompt:
      "RC passages take me 12 minutes each when others finish in 7. I re-read paragraphs and still get inference questions wrong. VARC is my nightmare.",
    coachPrompt: "CAT VARC passages make me anxious — I read slowly and still get them wrong",
  },
  // GATE
  {
    id: "gate-depth",
    category: "stress",
    exam: ["GATE"],
    label: "Technical depth stress",
    journalPrompt:
      "GATE engineering maths is brutal. Every topic has 3 levels of depth and I don't know when to stop. Rank list anxiety is constant.",
    coachPrompt: "GATE technical depth feels impossible — how deep should I go in each topic?",
  },
  // CUET
  {
    id: "cuet-multi",
    category: "stress",
    exam: ["CUET"],
    label: "Multi-domain juggling",
    journalPrompt:
      "Preparing for CUET domain + language + general test simultaneously. Switching between subjects leaves me mentally drained by afternoon.",
    coachPrompt: "CUET multi-domain prep is overwhelming — I can't balance all sections",
  },
  // Boards
  {
    id: "boards-parents",
    category: "family",
    exam: ["Boards"],
    label: "Parental expectations",
    journalPrompt:
      "Mom keeps comparing my pre-board scores with cousin who got 95%. I study harder but the comparison makes me want to hide my marksheets.",
    coachPrompt: "Board exam parental pressure and comparison with cousins is crushing me",
  },
  // Universal
  {
    id: "mock-failure",
    category: "confidence",
    exam: ["General", "JEE", "NEET", "CAT", "GATE", "CUET", "UPSC", "Boards"],
    label: "Mock test setback",
    journalPrompt:
      "Today's mock test was my worst in 2 months. Score dropped 80 marks. I studied the same hours but performed terribly. Self-doubt is back.",
    coachPrompt: "I failed my mock test badly today and feel like I'm not cut out for this exam",
  },
  {
    id: "sleep-loss",
    category: "sleep",
    exam: ["General", "JEE", "NEET", "CAT", "GATE", "CUET", "UPSC", "Boards"],
    label: "Sleep deprivation",
    journalPrompt:
      "Slept only 4 hours. Kept waking up thinking about incomplete chapters. Tried coffee but felt jittery during morning study. Eyes burn by noon.",
    coachPrompt: "I can't sleep because my mind runs formulas all night — only 4 hours rest",
  },
  {
    id: "peer-compare",
    category: "stress",
    exam: ["General", "JEE", "NEET", "CAT", "GATE", "CUET", "UPSC", "Boards"],
    label: "Peer comparison trap",
    journalPrompt:
      "Coaching WhatsApp group shows everyone finished 3 chapters today. I did 1. Spent an hour scrolling and now feel I'm the only one falling behind.",
    coachPrompt: "Everyone in my coaching batch seems ahead of me — comparison is killing my mood",
  },
  {
    id: "self-doubt",
    category: "confidence",
    exam: ["General", "JEE", "NEET", "CAT", "GATE", "CUET", "UPSC", "Boards"],
    label: "Self-doubt & impostor syndrome",
    journalPrompt:
      "Sometimes I solve a hard problem and think it was luck, not skill. Good days feel like accidents. I don't trust my own preparation.",
    coachPrompt: "I feel like an impostor — good mock days feel like luck, not real ability",
  },
  {
    id: "exam-day-nerves",
    category: "exam-day",
    exam: ["General", "JEE", "NEET", "CAT", "GATE", "CUET", "UPSC", "Boards"],
    label: "Exam day nerves",
    journalPrompt:
      "Exam is 10 days away. Heart races when I think about the hall. Practiced breathing but still imagine blanking out on easy questions.",
    coachPrompt: "My exam is next week and I can't stop imagining blanking out in the hall",
  },
  {
    id: "family-pressure",
    category: "family",
    exam: ["General", "JEE", "NEET", "Boards"],
    label: "Family expectations",
    journalPrompt:
      "Dad invested so much in my coaching fees. Every dinner conversation turns to ranks and colleges. I love them but the weight is unbearable.",
    coachPrompt: "Family expectations and coaching fees investment make me terrified of failing",
  },
  {
    id: "burnout-give-up",
    category: "burnout",
    exam: ["General", "JEE", "NEET", "CAT", "GATE", "CUET", "UPSC", "Boards"],
    label: "Burnout & wanting to quit",
    journalPrompt:
      "Studied 10 hours daily for 3 weeks straight. Today I stared at the book for an hour and absorbed nothing. Feel empty. Wondering if I should take a drop or quit.",
    coachPrompt: "I'm burned out and thinking of giving up — studied 10 hours daily with zero results",
  },
  {
    id: "focus-drift",
    category: "focus",
    exam: ["General", "JEE", "NEET", "CAT", "GATE", "CUET", "UPSC", "Boards"],
    label: "Focus & distraction",
    journalPrompt:
      "Picked up phone for 2 minutes, lost 40 minutes to reels. Happens 5 times a day. Guilt after each session but can't break the cycle.",
    coachPrompt: "I keep getting distracted by my phone and can't focus for even 30 minutes",
  },
  {
    id: "positive-day",
    category: "confidence",
    exam: ["General", "JEE", "NEET", "CAT", "GATE", "CUET", "UPSC", "Boards"],
    label: "Good study day",
    journalPrompt:
      "Actually had a solid day. Finished thermodynamics revision, solved 20 problems, took a walk. Feeling cautiously optimistic for the first time in weeks.",
    coachPrompt: "I had a surprisingly good study day today — want to keep this momentum going",
  },
];

export const TOPIC_CATEGORIES = [
  { id: "all", label: "All Topics" },
  { id: "stress", label: "Exam Stress" },
  { id: "burnout", label: "Burnout" },
  { id: "confidence", label: "Self-Doubt" },
  { id: "sleep", label: "Sleep" },
  { id: "focus", label: "Focus" },
  { id: "exam-day", label: "Exam Day" },
  { id: "family", label: "Family Pressure" },
] as const;

export function getTopicsForExam(exam: string): WellnessTopic[] {
  const normalized = exam.toUpperCase().replace(/ PREP.*/i, "").trim();
  return WELLNESS_TOPICS.filter(
    (t) => t.exam.includes("General") || t.exam.includes(normalized as ExamType)
  );
}

export function getCoachChipsForExam(exam: string): string[] {
  return getTopicsForExam(exam)
    .slice(0, 8)
    .map((t) => t.coachPrompt);
}

export function detectExamFromText(text: string): ExamType {
  const t = text.toLowerCase();
  if (t.includes("neet")) return "NEET";
  if (t.includes("jee")) return "JEE";
  if (t.includes("upsc") || t.includes("cse") || t.includes("ias")) return "UPSC";
  if (t.includes("cat") || t.includes("mba") || t.includes("iim")) return "CAT";
  if (t.includes("gate")) return "GATE";
  if (t.includes("cuet")) return "CUET";
  if (t.includes("board") || t.includes("cbse") || t.includes("class 12")) return "Boards";
  return "General";
}
