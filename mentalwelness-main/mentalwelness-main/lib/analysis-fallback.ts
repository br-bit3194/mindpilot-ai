import { JournalAnalysis } from "./ai";

export function simulateJournalAnalysis(text: string): JournalAnalysis {
  const normalizedText = text.toLowerCase();

  if (
    normalizedText.includes("exhausted") ||
    normalizedText.includes("tired") ||
    normalizedText.includes("burnout") ||
    normalizedText.includes("giving up") ||
    normalizedText.includes("can't do this") ||
    normalizedText.includes("sleep")
  ) {
    return {
      mood: "Exhausted",
      stress_score: 88,
      confidence_score: 38,
      burnout_risk: "High",
      trigger: "Study Burnout & Lack of Sleep",
      insight:
        "You are studying long hours with diminishing returns and critical physical exhaustion. Your brain is signaling a desperate need for reset.",
      copingStrategies: [
        "Take a mandatory 30-minute off-screen transition break right now.",
        "Perform a 10-minute Sleep Meditation before bed tonight.",
        "Set an absolute shutdown alarm: No studying after 10:30 PM for the next 3 days.",
      ],
    };
  }

  if (
    normalizedText.includes("mock") ||
    normalizedText.includes("test") ||
    normalizedText.includes("score") ||
    normalizedText.includes("marks") ||
    normalizedText.includes("failed") ||
    normalizedText.includes("solve")
  ) {
    return {
      mood: "Anxious",
      stress_score: 79,
      confidence_score: 42,
      burnout_risk: "Medium",
      trigger: "Mock Test Performance",
      insight:
        "Your stress levels are directly tied to recent mock examination scores, triggering an impostor syndrome cycle. You are conflating current diagnostics with final capability.",
      copingStrategies: [
        "Create an 'Error Logbook': list 3 mistakes you made and rewrite the concepts behind them.",
        "Execute a 5-minute Anxiety Reset breathing session immediately.",
        "Do not take another mock test for 48 hours; prioritize small, high-confidence topic revisions.",
      ],
    };
  }

  if (
    normalizedText.includes("peer") ||
    normalizedText.includes("friend") ||
    normalizedText.includes("coaching") ||
    normalizedText.includes("everyone") ||
    normalizedText.includes("compare") ||
    normalizedText.includes("better than")
  ) {
    return {
      mood: "Insecure",
      stress_score: 72,
      confidence_score: 31,
      burnout_risk: "Low",
      trigger: "Social Comparison",
      insight:
        "Comparing your chapter completion rates to peers is fueling a feeling of falling behind, ignoring your own personal trajectory.",
      copingStrategies: [
        "Mute coaching-group chats and social media forums for the next 24 hours.",
        "Write down 3 chapters or concepts you have mastered compared to 3 months ago.",
        "Team up with a peer specifically for collaborative, non-competitive flash revision.",
      ],
    };
  }

  return {
    mood: "Determined",
    stress_score: 45,
    confidence_score: 74,
    burnout_risk: "Low",
    trigger: "General Revision & Routine",
    insight:
      "You are maintaining a balanced study rhythm and sound confidence. This stability is the key to endurance during competitive prep.",
    copingStrategies: [
      "Keep this momentum by playing a Stress Buster Quiz to reinforce healthy exam habits.",
      "Watch a short stress-relief video from the Wellness Library.",
      "Engage in a 10-minute Deep Focus meditation before your next study sprint.",
    ],
  };
}

export function simulateCoachResponse(msg: string): string {
  const normalizedMsg = msg.toLowerCase();

  if (
    normalizedMsg.includes("give up") ||
    normalizedMsg.includes("can't do this") ||
    normalizedMsg.includes("too hard")
  ) {
    return "I hear you, and it is completely understandable to feel overwhelmed when facing exams like these. But let's pause and take a deep breath. You are carrying a heavy load, and feeling tired is not a sign of failure—it is a sign that you need rest. Remember, your mock test scores and study hours do not define your worth. Let's make a deal: step away from the desk for just 15 minutes, grab a glass of water, and then come back. We can tackle just one small, easy topic together.";
  }

  if (
    normalizedMsg.includes("mock") ||
    normalizedMsg.includes("score") ||
    normalizedMsg.includes("test") ||
    normalizedMsg.includes("failed")
  ) {
    return "Mock tests are not the final judgment; they are simply GPS updates telling you which turns to make. Every wrong answer in a mock test is a gift—it is one less mistake you will make in the actual exam! Instead of focusing on the overall score, celebrate finding the gaps. Shall we write down the top 3 mistakes and review them calmly? You have got this!";
  }

  if (
    normalizedMsg.includes("sleep") ||
    normalizedMsg.includes("insomnia") ||
    normalizedMsg.includes("night")
  ) {
    return "Sleep is the ultimate cheat code for exam preparation. While studying, your brain encodes memory; during sleep, it cements them. Cutting sleep to study actually hurts your recall. Let's aim to wind down 30 minutes before bed. No screens, just deep breathing or listening to calming sounds. Try our Guided Sleep Meditation tonight!";
  }

  if (
    normalizedMsg.includes("focus") ||
    normalizedMsg.includes("distract") ||
    normalizedMsg.includes("concentrate")
  ) {
    return "Focus is like a muscle. When you try to focus for 8 hours straight, it tears. Try using the Pomodoro technique in our Focus tab: study with full dedication for 25 minutes, then enjoy a guilt-free 5-minute break. This prevents mental fatigue and keeps distractions at bay. Would you like to start a Focus Pomodoro session now?";
  }

  return "I am here to support you! Preparing for competitive exams is a marathon, not a sprint. Remember to celebrate your small daily efforts—whether it's writing this message, solving a hard problem, or taking a break. What's one small goal we can focus on right now?";
}
