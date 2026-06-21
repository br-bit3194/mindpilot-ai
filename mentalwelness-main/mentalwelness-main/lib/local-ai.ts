import { JournalAnalysis } from "./ai";
import { detectExamFromText } from "./wellness-topics";

interface TriggerRule {
  id: string;
  keywords: string[];
  weight: number;
  mood: string;
  stress_score: number;
  confidence_score: number;
  burnout_risk: "Low" | "Medium" | "High";
  trigger: string;
  insight: string;
  hidden_patterns: string[];
  copingStrategies: string[];
  mindfulness: string;
}

const TRIGGER_RULES: TriggerRule[] = [
  {
    id: "crisis-burnout",
    keywords: ["giving up", "quit", "can't do this", "want to stop", "drop year", "no point"],
    weight: 10,
    mood: "Hopeless",
    stress_score: 92,
    confidence_score: 25,
    burnout_risk: "High",
    trigger: "Severe Burnout & Motivation Collapse",
    insight:
      "Your journal reveals emotional exhaustion beyond normal exam stress — a pattern where effort no longer produces relief. This is your nervous system asking for recovery, not evidence that you cannot succeed.",
    hidden_patterns: [
      "Effort-reward disconnect: studying more but feeling worse",
      "Catastrophic thinking about dropping or quitting",
      "Identity fused with exam outcome",
    ],
    copingStrategies: [
      "Take a full 24-hour academic detox — no books, no mocks, no rank discussions.",
      "Write 3 non-exam wins from the past month (health, relationships, skills).",
      "Start tomorrow with only ONE 25-minute Pomodoro on your easiest subject.",
    ],
    mindfulness: "10-Min Deep Focus → then 5-Min Anxiety Reset before any study",
  },
  {
    id: "sleep-deprivation",
    keywords: ["sleep", "insomnia", "tired", "exhausted", "4 hours", "can't sleep", "night", "woke up"],
    weight: 9,
    mood: "Exhausted",
    stress_score: 86,
    confidence_score: 35,
    burnout_risk: "High",
    trigger: "Sleep Deprivation & Cognitive Fatigue",
    insight:
      "Sleep loss is silently degrading your recall and emotional regulation. Standard trackers miss this because you may still log study hours — but quality of retention drops sharply below 6 hours of sleep.",
    hidden_patterns: [
      "Rumination loop: replaying chapters instead of sleeping",
      "Caffeine masking underlying fatigue",
      "Study guilt preventing rest",
    ],
    copingStrategies: [
      "Set a hard screen-off time 45 minutes before bed — use Sleep Meditation in the app.",
      "No new topics after 9 PM for the next 5 nights; only light revision.",
      "Track sleep hours in tomorrow's journal to correlate with mock performance.",
    ],
    mindfulness: "Sleep Meditation (15 min) with Ocean Waves ambient sound",
  },
  {
    id: "mock-performance",
    keywords: ["mock", "score", "marks", "percentile", "rank", "failed", "dropped", "test result"],
    weight: 8,
    mood: "Anxious",
    stress_score: 81,
    confidence_score: 38,
    burnout_risk: "Medium",
    trigger: "Mock Test Performance Shock",
    insight:
      "Mock scores are triggering an impostor syndrome loop — you are treating diagnostic data as a final verdict. Hidden pattern: stress spikes AFTER mocks, not during study, suggesting evaluation anxiety rather than knowledge gaps.",
    hidden_patterns: [
      "Score fixation over error analysis",
      "Post-mock emotional crash within 2 hours",
      "Avoidance of weak topics after bad mocks",
    ],
    copingStrategies: [
      "Create an Error Log: 3 mistakes → root concept → one revision action each.",
      "No new mocks for 48 hours — use Stress Buster Quiz to rebuild exam psychology.",
      "Watch 'Recovering from a Bad Mock Test' in Stress Relief Videos.",
    ],
    mindfulness: "5-Min Anxiety Reset immediately after mock analysis",
  },
  {
    id: "peer-comparison",
    keywords: ["peer", "friend", "coaching", "everyone", "compare", "better than", "ahead", "batch", "whatsapp"],
    weight: 7,
    mood: "Insecure",
    stress_score: 74,
    confidence_score: 32,
    burnout_risk: "Low",
    trigger: "Social Comparison & Coaching Group Pressure",
    insight:
      "Peer comparison is distorting your self-assessment — you measure progress against others' highlight reels, not your own 3-month trajectory. This is a hidden trigger standard mood trackers miss because your study hours look normal.",
    hidden_patterns: [
      "Social media / group chat triggers after study sessions",
      "Chapter-count comparison instead of concept mastery",
      "Shame spiral after seeing peers' progress posts",
    ],
    copingStrategies: [
      "Mute coaching WhatsApp groups for 48 hours.",
      "List 5 concepts you've mastered in the last 90 days.",
      "Ask Wellness Coach: 'How do I stop comparing myself to my batch?'",
    ],
    mindfulness: "2-Min Quick Calm before opening any study group chat",
  },
  {
    id: "family-pressure",
    keywords: ["parent", "mom", "dad", "family", "expectation", "fees", "invested", "disappointed", "cousin"],
    weight: 7,
    mood: "Pressured",
    stress_score: 78,
    confidence_score: 40,
    burnout_risk: "Medium",
    trigger: "Family Expectations & Financial Pressure",
    insight:
      "External expectations are adding a guilt layer on top of exam stress. You are preparing from fear of letting others down rather than intrinsic motivation — a pattern that accelerates burnout in the final months.",
    hidden_patterns: [
      "Guilt-driven overstudy to justify coaching investment",
      "Hiding mock scores from family",
      "Dinner-table rank conversations as stress triggers",
    ],
    copingStrategies: [
      "Have one honest 10-minute conversation with a parent about process, not ranks.",
      "Journal 3 things you control (effort, sleep, strategy) vs. 3 you don't (cutoff, others' scores).",
      "Use exam-day breathing exercises to separate performance from self-worth.",
    ],
    mindfulness: "Box Breathing video + 5-Min Anxiety Reset",
  },
  {
    id: "exam-day-anxiety",
    keywords: ["exam day", "exam hall", "days left", "week left", "blank out", "nervous", "panic attack", "heart race"],
    weight: 8,
    mood: "Panicked",
    stress_score: 85,
    confidence_score: 45,
    burnout_risk: "Medium",
    trigger: "Exam Day Anticipatory Anxiety",
    insight:
      "Your stress is time-anchored — it intensifies when you imagine the exam hall, not during daily revision. This is anticipatory anxiety, a distinct pattern from knowledge anxiety, and it responds well to simulation and breathing routines.",
    hidden_patterns: [
      "Catastrophic imagery: blanking on easy questions",
      "Sleep disruption increases as exam date nears",
      "Over-revision in final week from panic, not strategy",
    ],
    copingStrategies: [
      "Practice 2-Min Quick Calm daily until exam day — build muscle memory.",
      "Do one timed mock in exam-like conditions, then STOP — no post-mortem for 2 hours.",
      "Prepare an exam-day routine card: wake time, breakfast, breathing, entry checklist.",
    ],
    mindfulness: "2-Min Quick Calm every morning + exam-day video in library",
  },
  {
    id: "focus-distraction",
    keywords: ["distract", "phone", "focus", "concentrate", "reels", "instagram", "procrastinat", "can't sit"],
    weight: 6,
    mood: "Frustrated",
    stress_score: 65,
    confidence_score: 50,
    burnout_risk: "Low",
    trigger: "Attention Fragmentation & Phone Distraction",
    insight:
      "Your frustration isn't laziness — it's attention residue from micro-distractions. Each phone check costs 15-23 minutes of refocus time. Standard trackers see study hours; they miss the quality collapse from fragmented sessions.",
    hidden_patterns: [
      "Phone checks clustered in difficult topics (avoidance behavior)",
      "Guilt-procrastination loop: distract → guilt → longer study → more fatigue",
      "No structured breaks between sessions",
    ],
    copingStrategies: [
      "Start a Calm Focus Pomodoro — phone in another room for 25 minutes.",
      "Use 10-Min Deep Focus meditation before your hardest subject daily.",
      "Track distraction triggers in tomorrow's journal (which subject, what time).",
    ],
    mindfulness: "10-Min Deep Focus before Physics/Math sessions",
  },
  {
    id: "syllabus-backlog",
    keywords: ["backlog", "behind", "incomplete", "pending", "not finished", "syllabus", "left", "too much"],
    weight: 6,
    mood: "Overwhelmed",
    stress_score: 76,
    confidence_score: 42,
    burnout_risk: "Medium",
    trigger: "Syllabus Backlog Overwhelm",
    insight:
      "Backlog anxiety creates a paralysis loop — the sheer volume makes starting feel pointless. Hidden pattern: you plan for 100% completion but exam strategy needs 80% mastery of high-weightage topics.",
    hidden_patterns: [
      "Planning entire syllabus instead of prioritizing high-yield chapters",
      "Starting new chapters while old ones are half-done",
      "Backlog guilt preventing action on any single topic",
    ],
    copingStrategies: [
      "Pick ONE high-weightage chapter — finish it 80% before touching anything else.",
      "Ask Wellness Coach for a 7-day micro-plan for your weakest subject.",
      "Celebrate partial completion — 3 solid chapters beats 10 rushed ones.",
    ],
    mindfulness: "5-Min Anxiety Reset before planning study schedule",
  },
  {
    id: "self-doubt",
    keywords: ["doubt", "impostor", "not good enough", "luck", "don't deserve", "fraud", "stupid", "incapable"],
    weight: 7,
    mood: "Insecure",
    stress_score: 70,
    confidence_score: 28,
    burnout_risk: "Low",
    trigger: "Self-Doubt & Impostor Syndrome",
    insight:
      "You attribute successes to luck and failures to inherent inability — classic impostor thinking. This emotional pattern is invisible to hour-based trackers but directly predicts mock test underperformance.",
    hidden_patterns: [
      "Discounting genuine improvements as flukes",
      "Hyper-focusing on mistakes while ignoring solved problems",
      "Avoiding challenges that might 'expose' you",
    ],
    copingStrategies: [
      "Write a 'Evidence of Growth' list: 10 problems you couldn't solve 3 months ago but can now.",
      "Share one win with Wellness Coach — practice receiving encouragement.",
      "Play Stress Buster Quiz to reinforce that exam psychology is a learnable skill.",
    ],
    mindfulness: "Watch 'Make Stress Your Ally' video — reframe pressure as fuel",
  },
  {
    id: "positive-momentum",
    keywords: ["good day", "solid", "proud", "improved", "optimistic", "confident", "solved", "breakthrough", "happy"],
    weight: 5,
    mood: "Determined",
    stress_score: 35,
    confidence_score: 82,
    burnout_risk: "Low",
    trigger: "Positive Momentum & Balanced Routine",
    insight:
      "You are in a healthy preparation rhythm — balanced effort, emotional stability, and growing confidence. Protect this phase by not overloading with extra mocks or comparing to others during good weeks.",
    hidden_patterns: [
      "Sustainable study-rest balance detected",
      "Confidence building from actual problem-solving wins",
      "Low social comparison signals",
    ],
    copingStrategies: [
      "Lock in this routine: same wake time, one meditation, one Pomodoro block.",
      "Log what worked today so you can replicate it on low days.",
      "Do a light Breath Challenge game to reinforce calm focus habits.",
    ],
    mindfulness: "10-Min Deep Focus to prime tomorrow's hardest session",
  },
];

function scoreRules(text: string): { rule: TriggerRule; score: number }[] {
  const normalized = text.toLowerCase();
  return TRIGGER_RULES.map((rule) => {
    const matches = rule.keywords.filter((kw) => normalized.includes(kw)).length;
    return { rule, score: matches * rule.weight };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

export interface ExtendedJournalAnalysis extends JournalAnalysis {
  hidden_patterns: string[];
  mindfulness_exercise: string;
  exam_detected: string;
}

export function analyzeJournalLocal(text: string, examGoal = "JEE"): ExtendedJournalAnalysis {
  const scored = scoreRules(text);
  const detectedExam = detectExamFromText(text);
  const exam =
    detectedExam !== "General" ? detectedExam : examGoal.replace(/ Prep.*/i, "").trim();

  if (scored.length === 0) {
    return {
      mood: "Reflective",
      stress_score: 48,
      confidence_score: 62,
      burnout_risk: "Low",
      trigger: "General Academic Reflection",
      insight:
        "Your entry shows thoughtful self-reflection — a healthy habit that builds emotional awareness over time. Keep journaling daily to uncover patterns standard mood trackers cannot detect.",
      copingStrategies: [
        "Continue daily journaling — patterns emerge after 5-7 entries.",
        "Do a Quick Mood Check-In on the Dashboard to complement this entry.",
        "Chat with Wellness Coach about any topic from the suggestion chips.",
      ],
      hidden_patterns: [
        "Early-stage journaling — patterns will emerge with consistency",
        "Self-awareness practice already in progress",
      ],
      mindfulness_exercise: "2-Min Quick Calm to start tomorrow's study session",
      exam_detected: exam,
    };
  }

  const best = scored[0].rule;
  const examContext =
    exam !== "General"
      ? ` For ${exam} aspirants, this pattern commonly peaks during intensive revision phases.`
      : "";

  return {
    mood: best.mood,
    stress_score: best.stress_score,
    confidence_score: best.confidence_score,
    burnout_risk: best.burnout_risk,
    trigger: best.trigger,
    insight: best.insight + examContext,
    copingStrategies: best.copingStrategies,
    hidden_patterns: best.hidden_patterns,
    mindfulness_exercise: best.mindfulness,
    exam_detected: exam,
  };
}
