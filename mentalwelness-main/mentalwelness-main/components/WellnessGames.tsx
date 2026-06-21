"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Award,
  Flame,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Wind,
  CircleCheck,
  CircleAlert,
  Sparkles,
  Brain,
  Heart,
  Scale,
  Layers,
  Quote,
  Gamepad2,
  Camera,
} from "lucide-react";
import { WELLNESS_QUIZ } from "@/lib/wellnessQuiz";
import {
  GRATITUDE_PROMPTS,
  CALM_OR_STRESS_ROUNDS,
  ZEN_MEMORY_PAIRS,
  AFFIRMATIONS,
} from "@/lib/game-data";
import FunnyCameraPickEat from "@/components/FunnyCameraPickEat";

interface WellnessGamesProps {
  onAddXp: (amount: number) => void;
  onUpdateStreak: () => void;
}

type GameId = "quiz" | "breath" | "pomodoro" | "gratitude" | "calmstress" | "memory" | "affirmation" | "pickEat";

const GAMES: { id: GameId; label: string; desc: string; icon: React.ElementType; color: string; xp: string }[] = [
  { id: "quiz", label: "Stress Quiz", desc: "Exam psychology MCQs", icon: Brain, color: "from-indigo-500 to-violet-500", xp: "+50–200" },
  { id: "breath", label: "Breath Challenge", desc: "8 box-breathing cycles", icon: Wind, color: "from-sky-500 to-cyan-500", xp: "+200" },
  { id: "pomodoro", label: "Calm Focus", desc: "25-min Pomodoro timer", icon: Timer, color: "from-violet-500 to-purple-500", xp: "+150" },
  { id: "gratitude", label: "Gratitude Sprint", desc: "60s positivity boost", icon: Heart, color: "from-rose-500 to-pink-500", xp: "+120" },
  { id: "calmstress", label: "Calm or Stress?", desc: "Pick healthy responses", icon: Scale, color: "from-emerald-500 to-teal-500", xp: "+100" },
  { id: "memory", label: "Zen Memory", desc: "Match wellness cards", icon: Layers, color: "from-amber-500 to-orange-500", xp: "+180" },
  { id: "affirmation", label: "Affirmation Flip", desc: "Collect 5 affirmations", icon: Quote, color: "from-fuchsia-500 to-purple-500", xp: "+80" },
  { id: "pickEat", label: "Pick & Eat Cam", desc: "Funny Q&A food picks", icon: Camera, color: "from-orange-500 to-rose-500", xp: "+200" },
];

export default function WellnessGames({ onAddXp, onUpdateStreak }: WellnessGamesProps) {
  const [activeGame, setActiveGame] = useState<GameId>("quiz");

  // Quiz
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizState, setQuizState] = useState<"idle" | "playing" | "done">("idle");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  // Breath
  const [breathState, setBreathState] = useState<"idle" | "playing" | "done">("idle");
  const [breathPhase, setBreathPhase] = useState<"Inhale" | "Hold" | "Exhale" | "Rest">("Inhale");
  const [breathScore, setBreathScore] = useState(0);
  const [breathRound, setBreathRound] = useState(0);
  const [breathCounter, setBreathCounter] = useState(4);
  const breathTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Pomodoro
  const [pomoState, setPomoState] = useState<"stopped" | "running" | "paused">("stopped");
  const [pomoMinutes, setPomoMinutes] = useState(25);
  const [pomoSeconds, setPomoSeconds] = useState(0);
  const pomoTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Gratitude Sprint
  const [gratitudeState, setGratitudeState] = useState<"idle" | "playing" | "done">("idle");
  const [gratitudeIndex, setGratitudeIndex] = useState(0);
  const [gratitudeScore, setGratitudeScore] = useState(0);
  const [gratitudeTimer, setGratitudeTimer] = useState(60);
  const gratitudeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Calm or Stress
  const [calmState, setCalmState] = useState<"idle" | "playing" | "done">("idle");
  const [calmIndex, setCalmIndex] = useState(0);
  const [calmScore, setCalmScore] = useState(0);
  const [calmFeedback, setCalmFeedback] = useState<string | null>(null);

  // Zen Memory
  type MemCard = { id: number; pairId: string; emoji: string; flipped: boolean; matched: boolean };
  const [memoryState, setMemoryState] = useState<"idle" | "playing" | "done">("idle");
  const [memCards, setMemCards] = useState<MemCard[]>([]);
  const [memFlipped, setMemFlipped] = useState<number[]>([]);
  const [memMoves, setMemMoves] = useState(0);

  // Affirmation Flip
  const [affState, setAffState] = useState<"idle" | "playing" | "done">("idle");
  const [affCollected, setAffCollected] = useState<string[]>([]);
  const [affDeck, setAffDeck] = useState<string[]>([]);
  const [affFlipped, setAffFlipped] = useState<number | null>(null);

  const questions = WELLNESS_QUIZ.slice(0, 5);
  const calmRounds = CALM_OR_STRESS_ROUNDS.slice(0, 8);

  const startQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    setHasAnswered(false);
    setQuizState("playing");
  };

  const handleQuizAnswer = (idx: number) => {
    if (hasAnswered) return;
    setSelectedAnswer(idx);
    setHasAnswered(true);
    if (idx === questions[quizIndex].correctAnswer) setQuizScore((s) => s + 1);
  };

  const nextQuizQuestion = () => {
    if (quizIndex < questions.length - 1) {
      setQuizIndex((i) => i + 1);
      setSelectedAnswer(null);
      setHasAnswered(false);
    } else {
      setQuizState("done");
      onAddXp(quizScore * 30 + 50);
    }
  };

  useEffect(() => {
    if (breathState !== "playing") return;
    breathTimerRef.current = setInterval(() => {
      setBreathCounter((prev) => {
        if (prev <= 1) {
          setBreathPhase((cur) => {
            const next = cur === "Inhale" ? "Hold" : cur === "Hold" ? "Exhale" : cur === "Exhale" ? "Rest" : "Inhale";
            if (next === "Inhale" && cur === "Rest") {
              setBreathRound((r) => {
                const nr = r + 1;
                if (nr >= 8) { setBreathState("done"); onAddXp(200); }
                return nr;
              });
            }
            return next;
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (breathTimerRef.current) clearInterval(breathTimerRef.current); };
  }, [breathState, onAddXp]);

  useEffect(() => {
    if (pomoState === "running") {
      pomoTimerRef.current = setInterval(() => {
        if (pomoSeconds > 0) setPomoSeconds((s) => s - 1);
        else if (pomoMinutes > 0) { setPomoMinutes((m) => m - 1); setPomoSeconds(59); }
        else {
          setPomoState("stopped");
          onAddXp(150);
          onUpdateStreak();
          setPomoMinutes(25);
          setPomoSeconds(0);
        }
      }, 1000);
    }
    return () => { if (pomoTimerRef.current) clearInterval(pomoTimerRef.current); };
  }, [pomoState, pomoMinutes, pomoSeconds, onAddXp, onUpdateStreak]);

  const gratitudeScoreRef = useRef(0);

  useEffect(() => {
    if (gratitudeState !== "playing") return;
    gratitudeTimerRef.current = setInterval(() => {
      setGratitudeTimer((t) => {
        if (t <= 1) {
          setGratitudeState("done");
          onAddXp(gratitudeScoreRef.current * 15 + 30);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (gratitudeTimerRef.current) clearInterval(gratitudeTimerRef.current); };
  }, [gratitudeState, onAddXp]);

  const startMemory = useCallback(() => {
    const pairs = ZEN_MEMORY_PAIRS.slice(0, 6);
    const cards: MemCard[] = [];
    pairs.forEach((p, i) => {
      cards.push({ id: i * 2, pairId: p.id, emoji: p.emoji, flipped: false, matched: false });
      cards.push({ id: i * 2 + 1, pairId: p.id, emoji: p.emoji, flipped: false, matched: false });
    });
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    setMemCards(cards);
    setMemFlipped([]);
    setMemMoves(0);
    setMemoryState("playing");
  }, []);

  const handleMemClick = (cardId: number) => {
    if (memoryState !== "playing") return;
    const card = memCards.find((c) => c.id === cardId);
    if (!card || card.matched || card.flipped || memFlipped.length >= 2) return;

    const newFlipped = [...memFlipped, cardId];
    setMemCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, flipped: true } : c)));
    setMemFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMemMoves((m) => m + 1);
      const [a, b] = newFlipped;
      const cardA = memCards.find((c) => c.id === a)!;
      const cardB = memCards.find((c) => c.id === b)!;
      const match = cardA.pairId === cardB.pairId;

      setTimeout(() => {
        setMemCards((prev) => {
          const updated = prev.map((c) => {
            if (c.id === a || c.id === b) {
              return match ? { ...c, matched: true, flipped: true } : { ...c, flipped: false };
            }
            return c;
          });
          if (updated.every((c) => c.matched)) {
            setMemoryState("done");
            onAddXp(180);
          }
          return updated;
        });
        setMemFlipped([]);
      }, 700);
    }
  };

  const startAffirmation = () => {
    const shuffled = [...AFFIRMATIONS].sort(() => Math.random() - 0.5).slice(0, 8);
    setAffDeck(shuffled);
    setAffCollected([]);
    setAffFlipped(null);
    setAffState("playing");
  };

  const handleAffClick = (idx: number) => {
    if (affState !== "playing" || affFlipped !== null) return;
    setAffFlipped(idx);
    setTimeout(() => {
      const text = affDeck[idx];
      setAffCollected((prev) => {
        const next = [...prev, text];
        if (next.length >= 5) { setAffState("done"); onAddXp(80); }
        return next;
      });
      setAffFlipped(null);
    }, 600);
  };

  const cardClass = "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
          <Gamepad2 className="w-7 h-7 text-indigo-500" aria-hidden="true" />
          Wellness Games
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          8 stress-reduction games for exam aspirants — build healthy habits while earning XP.
        </p>
      </div>

      {/* Game picker grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {GAMES.map((g) => {
          const Icon = g.icon;
          const active = activeGame === g.id;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => setActiveGame(g.id)}
              className={`text-left p-4 rounded-2xl border transition-all ${
                active
                  ? "border-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/10 shadow-md"
                  : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-indigo-300 dark:hover:border-indigo-700"
              }`}
            >
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${g.color} flex items-center justify-center text-white mb-2`}>
                <Icon className="w-4.5 h-4.5" aria-hidden="true" />
              </div>
              <p className="text-xs font-bold text-zinc-800 dark:text-zinc-100">{g.label}</p>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">{g.desc}</p>
              <p className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">{g.xp} XP</p>
            </button>
          );
        })}
      </div>

      {/* QUIZ */}
      {activeGame === "quiz" && (
        <div className={`${cardClass} min-h-[400px]`}>
          {quizState === "idle" && (
            <div className="text-center py-12 max-w-md mx-auto space-y-5">
              <Brain className="w-12 h-12 text-indigo-500 mx-auto" />
              <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white">Stress Buster Quiz</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">5 questions on exam psychology and healthy study habits.</p>
              <button type="button" onClick={startQuiz} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl text-sm">Start Quiz</button>
            </div>
          )}
          {quizState === "playing" && (
            <div className="space-y-5 max-w-2xl mx-auto">
              <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">Q{quizIndex + 1} / {questions.length}</span>
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{questions[quizIndex].question}</p>
              <div className="space-y-2">
                {questions[quizIndex].options.map((opt, idx) => {
                  const isCorrect = idx === questions[quizIndex].correctAnswer;
                  const isSelected = selectedAnswer === idx;
                  let style = "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300";
                  if (hasAnswered) {
                    if (isCorrect) style = "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
                    else if (isSelected) style = "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400";
                    else style += " opacity-50";
                  }
                  return (
                    <button key={idx} type="button" onClick={() => handleQuizAnswer(idx)} disabled={hasAnswered}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold transition flex justify-between ${style}`}>
                      {opt}
                      {hasAnswered && isCorrect && <CircleCheck className="w-4 h-4" />}
                      {hasAnswered && isSelected && !isCorrect && <CircleAlert className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
              {hasAnswered && (
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-3">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">{questions[quizIndex].explanation}</p>
                  <button type="button" onClick={nextQuizQuestion} className="w-full bg-zinc-900 dark:bg-indigo-600 text-white font-bold py-2.5 rounded-xl text-xs">
                    {quizIndex < questions.length - 1 ? "Next Question" : "See Results"}
                  </button>
                </div>
              )}
            </div>
          )}
          {quizState === "done" && (
            <div className="text-center py-12 space-y-4">
              <Award className="w-12 h-12 text-amber-500 mx-auto" />
              <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white">Quiz Complete!</h3>
              <p className="text-sm text-zinc-500">Score: {quizScore}/{questions.length}</p>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 justify-center"><Sparkles className="w-3.5 h-3.5" /> +{quizScore * 30 + 50} XP</span>
              <button type="button" onClick={startQuiz} className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl text-sm">Play Again</button>
            </div>
          )}
        </div>
      )}

      {/* BREATH */}
      {activeGame === "breath" && (
        <div className={`${cardClass} min-h-[400px] flex flex-col items-center justify-center`}>
          {breathState === "idle" && (
            <div className="text-center space-y-5">
              <Wind className="w-12 h-12 text-sky-500 mx-auto" />
              <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white">Breath Challenge</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">8 box-breathing cycles. Tap during Inhale & Exhale to score sync points.</p>
              <button type="button" onClick={() => { setBreathState("playing"); setBreathRound(0); setBreathScore(0); setBreathPhase("Inhale"); setBreathCounter(4); }}
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-8 rounded-xl text-sm">Start</button>
            </div>
          )}
          {(breathState === "playing" || breathState === "done") && (
            <div className="text-center space-y-6">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase">Round {Math.min(breathRound + 1, 8)} / 8 · Sync: {breathScore}</p>
              <button type="button" onClick={() => { if (breathState === "playing" && (breathPhase === "Inhale" || breathPhase === "Exhale")) setBreathScore((s) => s + 1); }}
                disabled={breathState === "done"}
                className={`w-40 h-40 rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-all duration-[4000ms] ${
                  breathPhase === "Inhale" || breathPhase === "Hold" ? "scale-110 bg-gradient-to-tr from-sky-500 to-indigo-500" : "scale-75 bg-gradient-to-tr from-indigo-600 to-violet-600"
                }`}>
                <Wind className="w-6 h-6" /><span className="font-bold text-sm mt-1">{breathPhase}</span><span className="text-[10px] opacity-70">{breathCounter}s</span>
              </button>
              {breathState === "done" && (
                <div className="space-y-2">
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Complete! +200 XP</p>
                  <button type="button" onClick={() => setBreathState("idle")} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 underline">Play Again</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* POMODORO */}
      {activeGame === "pomodoro" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`${cardClass} flex flex-col items-center justify-center text-center min-h-[340px]`}>
            <h3 className="font-bold text-zinc-800 dark:text-zinc-200">Calm Focus Pomodoro</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 mb-8">25 min focus + guilt-free break</p>
            <div className="w-44 h-44 rounded-full border-4 border-indigo-500/20 dark:border-indigo-500/30 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold font-mono text-zinc-900 dark:text-white">{pomoMinutes}:{pomoSeconds < 10 ? "0" : ""}{pomoSeconds}</span>
              <span className="text-[10px] text-zinc-500 uppercase font-bold mt-1">{pomoState === "running" ? "Focusing" : pomoState === "paused" ? "Paused" : "Ready"}</span>
            </div>
            <div className="flex gap-3 mt-8">
              <button type="button" onClick={() => { setPomoState("stopped"); setPomoMinutes(25); setPomoSeconds(0); }} className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-600 dark:text-zinc-300"><RotateCcw className="w-4 h-4" /></button>
              <button type="button" onClick={() => setPomoState(pomoState === "running" ? "paused" : "running")}
                className={`py-3 px-8 rounded-xl font-bold text-white flex items-center gap-2 ${pomoState === "running" ? "bg-rose-500" : "bg-indigo-600"}`}>
                {pomoState === "running" ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4 fill-white" /> Start</>}
              </button>
            </div>
          </div>
          <div className={`${cardClass} space-y-3`}>
            <h4 className="text-xs font-bold uppercase text-zinc-500 flex items-center gap-1.5"><Flame className="w-4 h-4 text-amber-500" /> Why It Helps</h4>
            {["Prevents marathon-study burnout", "Natural break points for breathing", "Builds exam-day focus stamina", "+150 XP & streak on completion"].map((tip, i) => (
              <div key={i} className="flex gap-2.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700">
                <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GRATITUDE SPRINT */}
      {activeGame === "gratitude" && (
        <div className={`${cardClass} min-h-[400px] flex flex-col items-center justify-center`}>
          {gratitudeState === "idle" && (
            <div className="text-center space-y-5">
              <Heart className="w-12 h-12 text-rose-500 mx-auto" />
              <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white">Gratitude Sprint</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">60 seconds — tap whenever a gratitude prompt resonates. Builds positive emotion that buffers exam stress.</p>
              <button type="button" onClick={() => { setGratitudeState("playing"); setGratitudeIndex(0); setGratitudeScore(0); gratitudeScoreRef.current = 0; setGratitudeTimer(60); }}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-8 rounded-xl text-sm">Start Sprint</button>
            </div>
          )}
          {gratitudeState === "playing" && (
            <div className="text-center space-y-6 w-full max-w-md">
              <div className="flex justify-between text-xs font-bold text-zinc-500">
                <span>{gratitudeTimer}s left</span><span>Collected: {gratitudeScore}</span>
              </div>
              <div className="p-6 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20">
                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">I&apos;m grateful for...</p>
                <p className="text-lg font-extrabold text-rose-600 dark:text-rose-400 mt-2">{GRATITUDE_PROMPTS[gratitudeIndex % GRATITUDE_PROMPTS.length]}</p>
              </div>
              <button type="button" onClick={() => { setGratitudeScore((s) => { const n = s + 1; gratitudeScoreRef.current = n; return n; }); setGratitudeIndex((i) => i + 1); }}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-10 rounded-xl text-sm">This resonates 💚</button>
            </div>
          )}
          {gratitudeState === "done" && (
            <div className="text-center space-y-4">
              <Heart className="w-10 h-10 text-rose-500 mx-auto" />
              <p className="text-lg font-bold text-zinc-900 dark:text-white">{gratitudeScore} gratitudes in 60s!</p>
              <p className="text-xs text-emerald-600 font-bold">+{gratitudeScore * 15 + 30} XP</p>
              <button type="button" onClick={() => setGratitudeState("idle")} className="text-xs font-bold text-indigo-600 underline">Play Again</button>
            </div>
          )}
        </div>
      )}

      {/* CALM OR STRESS */}
      {activeGame === "calmstress" && (
        <div className={`${cardClass} min-h-[400px]`}>
          {calmState === "idle" && (
            <div className="text-center py-12 space-y-5">
              <Scale className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white">Calm or Stress?</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">8 exam scenarios — pick the healthy coping response. Trains your stress reflex for real situations.</p>
              <button type="button" onClick={() => { setCalmState("playing"); setCalmIndex(0); setCalmScore(0); setCalmFeedback(null); }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl text-sm">Start</button>
            </div>
          )}
          {calmState === "playing" && calmIndex < calmRounds.length && (
            <div className="space-y-5 max-w-xl mx-auto">
              <span className="text-[10px] font-bold text-zinc-500">{calmIndex + 1} / {calmRounds.length}</span>
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{calmRounds[calmIndex].scenario}</p>
              {calmFeedback ? (
                <div className="space-y-3">
                  <p className={`text-xs font-semibold p-3 rounded-xl ${calmFeedback.startsWith("✓") ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"}`}>{calmFeedback}</p>
                  <button type="button" onClick={() => {
                    setCalmFeedback(null);
                    const next = calmIndex + 1;
                    if (next >= calmRounds.length) {
                      setCalmState("done");
                      onAddXp(calmScore * 12 + 20);
                    } else {
                      setCalmIndex(next);
                    }
                  }}
                    className="w-full bg-zinc-900 dark:bg-indigo-600 text-white font-bold py-2.5 rounded-xl text-xs">Next</button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button type="button" onClick={() => { setCalmScore((s) => s + 1); setCalmFeedback("✓ Healthy choice! This reduces cortisol and builds exam resilience."); }}
                    className="w-full text-left p-4 rounded-xl border-2 border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Calm: </span>{calmRounds[calmIndex].calm}
                  </button>
                  <button type="button" onClick={() => { setCalmFeedback("✗ Stress trap! This spikes anxiety and hurts long-term performance. Try the calm option next time."); }}
                    className="w-full text-left p-4 rounded-xl border-2 border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    <span className="text-rose-600 dark:text-rose-400 font-bold">Stress: </span>{calmRounds[calmIndex].stress}
                  </button>
                </div>
              )}
            </div>
          )}
          {calmState === "done" && (
            <div className="text-center py-12 space-y-4">
              <Award className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white">{calmScore}/{calmRounds.length} calm choices!</h3>
              <p className="text-xs text-emerald-600 font-bold">+{calmScore * 12 + 20} XP</p>
              <button type="button" onClick={() => setCalmState("idle")} className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl text-sm">Play Again</button>
            </div>
          )}
        </div>
      )}

      {/* ZEN MEMORY */}
      {activeGame === "memory" && (
        <div className={`${cardClass} min-h-[400px]`}>
          {memoryState === "idle" && (
            <div className="text-center py-12 space-y-5">
              <Layers className="w-12 h-12 text-amber-500 mx-auto" />
              <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white">Zen Memory</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Match 6 wellness emoji pairs. A calming break that sharpens focus.</p>
              <button type="button" onClick={startMemory} className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-xl text-sm">Start</button>
            </div>
          )}
          {memoryState === "playing" && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-500 text-center font-bold">Moves: {memMoves}</p>
              <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
                {memCards.map((card) => (
                  <button key={card.id} type="button" onClick={() => handleMemClick(card.id)}
                    className={`aspect-square rounded-xl border-2 text-2xl flex items-center justify-center transition ${
                      card.matched ? "border-emerald-500 bg-emerald-500/10 opacity-60"
                        : card.flipped ? "border-indigo-500 bg-indigo-500/10"
                        : "border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:border-indigo-400"
                    }`}>
                    {card.flipped || card.matched ? card.emoji : "?"}
                  </button>
                ))}
              </div>
            </div>
          )}
          {memoryState === "done" && (
            <div className="text-center py-12 space-y-4">
              <Sparkles className="w-10 h-10 text-amber-500 mx-auto" />
              <p className="text-lg font-bold text-zinc-900 dark:text-white">All matched in {memMoves} moves!</p>
              <p className="text-xs text-emerald-600 font-bold">+180 XP</p>
              <button type="button" onClick={() => setMemoryState("idle")} className="text-xs font-bold text-indigo-600 underline">Play Again</button>
            </div>
          )}
        </div>
      )}

      {/* PICK & EAT CAMERA */}
      {activeGame === "pickEat" && (
        <FunnyCameraPickEat onAddXp={onAddXp} />
      )}

      {/* AFFIRMATION FLIP */}
      {activeGame === "affirmation" && (
        <div className={`${cardClass} min-h-[400px]`}>
          {affState === "idle" && (
            <div className="text-center py-12 space-y-5">
              <Quote className="w-12 h-12 text-fuchsia-500 mx-auto" />
              <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white">Affirmation Flip</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">Flip cards to collect 5 exam wellness affirmations. Counter self-doubt with evidence-based positivity.</p>
              <button type="button" onClick={startAffirmation} className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-3 px-8 rounded-xl text-sm">Start</button>
            </div>
          )}
          {affState === "playing" && (
            <div className="space-y-5">
              <p className="text-xs text-center font-bold text-zinc-500">Collected: {affCollected.length} / 5</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
                {affDeck.map((text, idx) => (
                  <button key={idx} type="button" onClick={() => handleAffClick(idx)} disabled={affCollected.includes(text)}
                    className={`min-h-[80px] p-3 rounded-xl border text-xs font-semibold transition ${
                      affCollected.includes(text) ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 opacity-60"
                        : affFlipped === idx ? "border-fuchsia-500 bg-fuchsia-500/10 text-zinc-800 dark:text-zinc-100"
                        : "border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:border-fuchsia-400"
                    }`}>
                    {affCollected.includes(text) || affFlipped === idx ? text : "Tap to flip ✨"}
                  </button>
                ))}
              </div>
              {affCollected.length > 0 && (
                <div className="max-w-md mx-auto p-3 rounded-xl bg-fuchsia-500/5 border border-fuchsia-500/15">
                  <p className="text-[10px] font-bold text-fuchsia-600 mb-1">Latest:</p>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 italic">&ldquo;{affCollected[affCollected.length - 1]}&rdquo;</p>
                </div>
              )}
            </div>
          )}
          {affState === "done" && (
            <div className="text-center py-8 space-y-4">
              <Quote className="w-10 h-10 text-fuchsia-500 mx-auto" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">5 Affirmations Collected!</h3>
              <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1 max-w-md mx-auto text-left">
                {affCollected.map((a, i) => <li key={i} className="italic">&ldquo;{a}&rdquo;</li>)}
              </ul>
              <p className="text-xs text-emerald-600 font-bold">+80 XP</p>
              <button type="button" onClick={() => setAffState("idle")} className="bg-fuchsia-600 text-white font-bold py-2 px-6 rounded-xl text-sm">Play Again</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
