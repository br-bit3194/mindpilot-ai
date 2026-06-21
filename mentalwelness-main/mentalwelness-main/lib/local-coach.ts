import { detectCrisisLanguage, getCrisisResponse } from "./safety";
import { detectExamFromText } from "./wellness-topics";

interface CoachRule {
  keywords: string[];
  response: (exam: string) => string;
}

const COACH_RULES: CoachRule[] = [
  {
    keywords: ["give up", "quit", "can't do", "want to stop", "drop", "no point", "burned out", "burnout"],
    response: (exam) =>
      `I hear the exhaustion in your words, and I want you to know — feeling this way after months of ${exam} prep is not weakness, it's your body asking for rest.\n\n` +
      `Here's what we know: students who take a structured 24-hour reset often return with 30% better focus. Your worth is not your rank.\n\n` +
      `**Right now:** Step away for 15 minutes. Drink water. Walk outside.\n` +
      `**Tonight:** Sleep Meditation + no screens after 10 PM.\n` +
      `**Tomorrow:** ONE 25-minute Pomodoro on your easiest topic. That's it.\n\n` +
      `You haven't come this far to only come this far. I'm here whenever you need to talk.`,
  },
  {
    keywords: ["mock", "score", "marks", "percentile", "rank", "failed", "bad test", "low score"],
    response: (exam) =>
      `Mock tests are GPS updates, not final destinations — especially for ${exam}.\n\n` +
      `Every topper has a folder of bad mocks. What separates them is what they do NEXT:\n` +
      `1. **Error Log** — 3 mistakes → why → concept to revise\n` +
      `2. **48-hour mock pause** — revise weak areas, don't punish yourself with another test\n` +
      `3. **5-Min Anxiety Reset** — clear the emotional residue before studying again\n\n` +
      `Your score today measures today's conditions, not your exam-day potential. What was the hardest section? Let's break it down.`,
  },
  {
    keywords: ["sleep", "insomnia", "can't sleep", "tired", "exhausted", "4 hour", "night", "wake up"],
    response: () =>
      `Sleep is the ultimate memory consolidation tool — cutting it to study more actually reduces recall by up to 40%.\n\n` +
      `**Tonight's wind-down protocol:**\n` +
      `• No screens 45 min before bed\n` +
      `• Sleep Meditation (15 min) with Ocean Waves sound\n` +
      `• Write tomorrow's ONE priority on paper — then close the book\n\n` +
      `**Hidden pattern:** Students who sleep 7+ hours outperform sleep-deprived grinders in the final month. Rest is strategy, not laziness.\n\n` +
      `How many hours did you sleep last night?`,
  },
  {
    keywords: ["overwhelm", "too much", "backlog", "behind", "syllabus", "incomplete", "pending"],
    response: (exam) =>
      `Backlog overwhelm is the #1 hidden stress trigger for ${exam} aspirants — and it's solvable.\n\n` +
      `**The 80/20 reset:**\n` +
      `• Pick ONE high-weightage chapter you haven't finished\n` +
      `• Commit to 80% mastery — not perfection\n` +
      `• Ignore everything else for 3 days\n\n` +
      `You don't need 100% syllabus completion. You need deep mastery of what matters most.\n\n` +
      `Which subject feels heaviest right now? I'll help you pick the highest-yield chapter.`,
  },
  {
    keywords: ["peer", "friend", "compare", "everyone", "coaching", "batch", "ahead", "whatsapp", "group"],
    response: () =>
      `Comparison is the thief of preparation joy — and coaching groups amplify it artificially.\n\n` +
      `**What others post:** their best day. **What you see:** your every day.\n\n` +
      `**48-hour comparison detox:**\n` +
      `• Mute coaching WhatsApp groups\n` +
      `• Write 5 concepts YOU've improved in 90 days\n` +
      `• Measure yourself against yesterday's you, not today's batch topper\n\n` +
      `Hidden pattern: students who mute groups in the final 60 days report 25% lower stress. Try it — you can always rejoin.`,
  },
  {
    keywords: ["parent", "family", "mom", "dad", "expectation", "pressure", "fees", "disappoint"],
    response: (exam) =>
      `Family pressure adds a guilt layer that standard stress trackers completely miss.\n\n` +
      `Your parents invested in your ${exam} dream because they believe in you — but rank conversations can feel like conditional love. That's the stress talking, not reality.\n\n` +
      `**Try this:**\n` +
      `• Tell them ONE specific thing you improved this week (a concept, a habit)\n` +
      `• Ask for process support, not score updates: "Please ask how my revision went, not my rank"\n` +
      `• Journal what YOU control vs. what you don't\n\n` +
      `You are preparing a life skill, not just writing an exam.`,
  },
  {
    keywords: ["exam day", "exam hall", "week left", "days left", "blank", "nervous", "panic", "heart"],
    response: (exam) =>
      `Exam-day nerves are anticipatory anxiety — your brain simulating worst-case scenarios. It's treatable.\n\n` +
      `**Your exam-day toolkit:**\n` +
      `• **Daily:** 2-Min Quick Calm every morning until exam day\n` +
      `• **Night before:** Sleep Meditation, no new topics\n` +
      `• **Hall entry:** Box breathing (4-4-4-4) at the gate\n` +
      `• **During exam:** If panic hits — close eyes, 3 deep breaths, move to next question\n\n` +
      `Watch "Calm Your Mind Before Exams" in Stress Relief Videos.\n\n` +
      `How many days until your ${exam} exam?`,
  },
  {
    keywords: ["focus", "distract", "phone", "concentrate", "reels", "procrastinat", "can't sit"],
    response: () =>
      `Focus isn't willpower — it's environment design.\n\n` +
      `**The distraction fix:**\n` +
      `• Phone in another room (not silenced — physically away)\n` +
      `• Calm Focus Pomodoro: 25 min study, 5 min guilt-free break\n` +
      `• 10-Min Deep Focus meditation BEFORE your hardest subject\n\n` +
      `Hidden pattern: you likely distract most during difficult topics — that's avoidance, not laziness. Name the subject that triggers it.\n\n` +
      `Start one Pomodoro right now. Just one. I'll be here when you finish.`,
  },
  {
    keywords: ["doubt", "impostor", "not good enough", "luck", "stupid", "incapable", "don't deserve"],
    response: (exam) =>
      `Impostor syndrome is incredibly common among ${exam} aspirants — especially high performers who hold themselves to impossible standards.\n\n` +
      `**Reality check:**\n` +
      `• Luck doesn't solve 50 problems in a row — skill does\n` +
      `• You've survived every bad day so far — 100% track record\n` +
      `• Self-doubt is a symptom of caring deeply, not evidence of inability\n\n` +
      `**Exercise:** Write 10 problems you couldn't solve 3 months ago but can now. That's evidence.\n\n` +
      `What recent win are you dismissing as "luck"?`,
  },
  {
    keywords: ["neet", "biology", "medical", "doctor", "mbbs"],
    response: () =>
      `NEET biology is a volume game — and feeling overwhelmed by the syllabus is the norm, not a personal failing.\n\n` +
      `**NEET-specific strategy:**\n` +
      `• Group chapters by systems (not random order)\n` +
      `• Use active recall flashcards — not passive re-reading\n` +
      `• 60% NCERT mastery beats 40% of everything\n\n` +
      `**Wellness:** Sleep Meditation helps consolidate biology mnemonics overnight.\n\n` +
      `Which biology unit is causing the most stress?`,
  },
  {
    keywords: ["jee", "physics", "advanced", "iit", "problem", "numerical"],
    response: () =>
      `JEE physics pressure is unique — it's not about reading, it's about problem-solving speed under stress.\n\n` +
      `**JEE-specific tips:**\n` +
      `• 10-Min Deep Focus before every physics session\n` +
      `• Solve 5 easy problems first to build momentum, then tackle hard ones\n` +
      `• Speed comes from pattern recognition, not rushing\n\n` +
      `**Hidden pattern:** JEE stress peaks after mechanics/electrostatics sessions — schedule meditation right after.\n\n` +
      `Which physics chapter triggered today's frustration?`,
  },
  {
    keywords: ["upsc", "mains", "optional", "answer writing", "cse", "ias", "prelims"],
    response: () =>
      `UPSC is a multi-year emotional marathon — burnout here looks different from JEE/NEET sprint stress.\n\n` +
      `**UPSC-specific wellness:**\n` +
      `• Schedule one full rest day per week — non-negotiable\n` +
      `• Answer writing anxiety? Practice ONE question timed, then review — not 10\n` +
      `• Current affairs overload? Limit news to 90 minutes daily\n\n` +
      `**Remember:** Every successful candidate had multiple attempts. Your timeline is your own.\n\n` +
      `Are you in Prelims, Mains, or full-cycle prep right now?`,
  },
  {
    keywords: ["cat", "varc", "rc passage", "di-lr", "mba", "iim", "time pressure"],
    response: () =>
      `CAT is as much an emotional regulation test as an aptitude test — time pressure triggers panic that costs easy marks.\n\n` +
      `**CAT-specific strategy:**\n` +
      `• Quick Calm before every timed mock — build the habit now\n` +
      `• VARC: read the question first, then passage (saves 2 min/passage)\n` +
      `• Left a section? Move on guilt-free — CAT rewards smart skipping\n\n` +
      `Watch "Handling Time Pressure" in Stress Relief Videos.\n\n` +
      `Which CAT section triggers the most panic?`,
  },
  {
    keywords: ["gate", "psu", "engineering", "technical"],
    response: () =>
      `GATE technical depth stress is real — knowing when to stop going deeper is a skill.\n\n` +
      `**GATE-specific tips:**\n` +
      `• 80% depth on high-weightage topics > 100% on everything\n` +
      `• Previous year papers are your wellness anchor — they define the actual depth needed\n` +
      `• Rank anxiety? Focus on marks improvement week-over-week, not absolute rank\n\n` +
      `Which engineering subject feels bottomless right now?`,
  },
  {
    keywords: ["cuet", "domain", "university", "cutoff", "ug"],
    response: () =>
      `CUET's multi-domain structure creates unique switching fatigue — your brain pays a tax every time you change subjects.\n\n` +
      `**CUET-specific strategy:**\n` +
      `• Block schedule: mornings for domain, afternoons for language, evenings for general test\n` +
      `• 5-Min Anxiety Reset between subject switches\n` +
      `• Don't compare domain percentiles with peers in different subjects\n\n` +
      `Which CUET section drains you most?`,
  },
  {
    keywords: ["board", "cbse", "class 12", "12th", "practical", "parents"],
    response: () =>
      `Board exam stress carries a unique family dimension — marks feel public, permanent, and compared at every relative gathering.\n\n` +
      `**Board-specific wellness:**\n` +
      `• Anxious about comparison? Anxiety Reset after every family dinner conversation\n` +
      `• Sleep Meditation the night before each paper — non-negotiable\n` +
      `• Quick Calm 5 minutes before entering the hall\n\n` +
      `Boards test consistency, not genius. Steady daily effort wins.\n\n` +
      `Which subject paper is worrying you most?`,
  },
  {
    keywords: ["good day", "solid", "proud", "improved", "optimistic", "confident", "happy", "momentum"],
    response: (exam) =>
      `This is wonderful to hear! Positive days are worth protecting — many ${exam} aspirants rush to do MORE after a good day and accidentally burn out.\n\n` +
      `**Lock in this momentum:**\n` +
      `• Write down exactly what you did today (wake time, subjects, breaks, mood)\n` +
      `• Repeat the same structure tomorrow — don't add extra hours\n` +
      `• Log this in your journal so we can find the pattern on low days\n\n` +
      `Celebrating progress is a skill. You just practiced it. 🌟`,
  },
  {
    keywords: ["stress", "anxious", "anxiety", "worried", "scared", "tension"],
    response: (exam) =>
      `Anxiety before ${exam} is your nervous system trying to protect you — it's not the enemy.\n\n` +
      `**Immediate relief:**\n` +
      `• 5-Min Anxiety Reset (box breathing) — do it now while we chat\n` +
      `• Name the specific fear: is it syllabus, mock scores, exam day, or family?\n` +
      `• One small action beats one big worry\n\n` +
      `I'm here 24/7. Tell me the specific thought looping in your head right now.`,
  },
  {
    keywords: ["motivat", "demotivat", "lost", "purpose", "why am i", "meaning"],
    response: (exam) =>
      `Losing motivation mid-prep is so common that it has a name: "the middle slump." You're not broken — you're in the hardest phase.\n\n` +
      `**Reconnect with your why:**\n` +
      `• Why did you choose ${exam}? Write one sentence — not for parents, for YOU\n` +
      `• Watch "Make Stress Your Ally" — motivation follows action, not the reverse\n` +
      `• Do ONE thing today that future-you will thank you for\n\n` +
      `What made you start this journey originally?`,
  },
];

function pickRule(message: string): CoachRule | null {
  const normalized = message.toLowerCase();
  let best: { rule: CoachRule; matches: number } | null = null;

  for (const rule of COACH_RULES) {
    const matches = rule.keywords.filter((kw) => normalized.includes(kw)).length;
    if (matches > 0 && (!best || matches > best.matches)) {
      best = { rule, matches };
    }
  }
  return best?.rule ?? null;
}

function getContextFromHistory(
  history: { role: "user" | "model"; content: string }[]
): string {
  const userMessages = history
    .filter((m) => m.role === "user")
    .map((m) => m.content.toLowerCase());

  const themes: string[] = [];
  if (userMessages.some((m) => m.includes("mock") || m.includes("score"))) themes.push("mock test stress");
  if (userMessages.some((m) => m.includes("sleep") || m.includes("tired"))) themes.push("sleep issues");
  if (userMessages.some((m) => m.includes("family") || m.includes("parent"))) themes.push("family pressure");
  if (userMessages.some((m) => m.includes("give up") || m.includes("quit"))) themes.push("burnout risk");

  return themes.length > 0 ? themes[themes.length - 1] : "";
}

export function getLocalCoachResponse(
  history: { role: "user" | "model"; content: string }[],
  message: string,
  examGoal = "JEE"
): string {
  if (detectCrisisLanguage(message)) {
    return getCrisisResponse();
  }

  const exam =
    detectExamFromText(message) !== "General"
      ? detectExamFromText(message)
      : examGoal.replace(/ Prep.*/i, "").trim();

  const rule = pickRule(message);
  const context = getContextFromHistory(history);

  if (rule) {
    let response = rule.response(exam);
    if (context && history.length > 2) {
      response =
        `I remember you mentioned ${context} earlier — this is connected. Let's address it holistically.\n\n` +
        response;
    }
    return response;
  }

  // Contextual default using history
  if (context) {
    return (
      `I notice ${context} has come up in our conversation. That tells me you're carrying a real weight, not just having a bad hour.\n\n` +
      `For ${exam} preparation, the most powerful move right now is a small one:\n` +
      `• **Breathe:** 5-Min Anxiety Reset in Meditation Hub\n` +
      `• **Write:** Log today's feelings in AI Journal — I'll find hidden patterns\n` +
      `• **Act:** One 25-minute Pomodoro on a single topic\n\n` +
      `What's the ONE thing bothering you most right now? Be specific — I'm listening.`
    );
  }

  return (
    `I'm MindMate, your wellness companion for ${exam} and beyond. I'm here 24/7 — no judgment, no generic advice.\n\n` +
    `I can help with:\n` +
    `• **Mock test anxiety** and score recovery\n` +
    `• **Sleep, burnout,** and study-life balance\n` +
    `• **Peer comparison** and family pressure\n` +
    `• **Exam-day nerves** and focus problems\n` +
    `• **Subject-specific stress** (Physics, Biology, VARC, etc.)\n\n` +
    `Tap a topic chip below or tell me exactly what's on your mind. How are you feeling right now?`
  );
}
