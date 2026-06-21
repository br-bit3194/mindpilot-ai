// components/MeditationHub.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Compass,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Wind,
  Award,
  Plus,
  Trash2,
  GraduationCap,
  Target,
  ChevronRight,
  BookMarked,
} from "lucide-react";
import { playAmbientSound, stopAmbientSound, type SoundId } from "@/lib/ambientSounds";

interface MeditationHubProps {
  onAddXp: (amount: number) => void;
}

type MeditationType = "quick_calm" | "anxiety_reset" | "deep_focus" | "sleep";
type InnerTab = "meditate" | "exam_focus" | "my_exams";

interface SessionInfo {
  id: MeditationType;
  title: string;
  duration: number;
  description: string;
  theme: string;
  xp: number;
}

interface ExamProfile {
  id: string;
  name: string;
  isCustom: boolean;
  stressTrigger: string;
  recommendedSessions: MeditationType[];
  tips: string[];
}

const SESSIONS: SessionInfo[] = [
  {
    id: "quick_calm",
    title: "2-Min Quick Calm",
    duration: 120,
    description: "Ideal before entering an exam hall. Lowers immediate flight-or-fight heart rate.",
    theme: "from-teal-500 to-emerald-400",
    xp: 100,
  },
  {
    id: "anxiety_reset",
    title: "5-Min Anxiety Reset",
    duration: 300,
    description: "For sudden panic, mock test shocks, or feeling overwhelmed by a tough topic.",
    theme: "from-sky-500 to-indigo-400",
    xp: 250,
  },
  {
    id: "deep_focus",
    title: "10-Min Deep Focus",
    duration: 600,
    description: "Prime your brain before starting a heavy physics or math problem-solving session.",
    theme: "from-violet-500 to-purple-400",
    xp: 400,
  },
  {
    id: "sleep",
    title: "Sleep Meditation",
    duration: 900,
    description: "Calms brainwaves to transition into deep, memory-consolidating sleep cycles.",
    theme: "from-slate-600 to-indigo-950",
    xp: 350,
  },
];

const DEFAULT_EXAMS: ExamProfile[] = [
  {
    id: "jee",
    name: "JEE (Main & Advanced)",
    isCustom: false,
    stressTrigger: "Physics derivations & math problem pressure",
    recommendedSessions: ["deep_focus", "quick_calm", "anxiety_reset"],
    tips: [
      "10-Min Deep Focus before Physics problem-solving sessions",
      "2-Min Quick Calm before entering the exam hall",
      "5-Min Anxiety Reset after negative mock test results",
    ],
  },
  {
    id: "neet",
    name: "NEET (UG)",
    isCustom: false,
    stressTrigger: "Vast Biology syllabus & memory overload",
    recommendedSessions: ["deep_focus", "sleep", "anxiety_reset"],
    tips: [
      "Sleep Meditation consolidates Biology mnemonics overnight",
      "Deep Focus primes recall of taxonomy and organ systems",
      "Anxiety Reset between paper shifts (Chem → Bio)",
    ],
  },
  {
    id: "upsc",
    name: "UPSC (CSE)",
    isCustom: false,
    stressTrigger: "Multi-year prep fatigue & current affairs overload",
    recommendedSessions: ["sleep", "deep_focus", "anxiety_reset"],
    tips: [
      "Sleep Meditation critical after 12+ hour study days",
      "Deep Focus before Answer Writing practice sessions",
      "Anxiety Reset after negative Mains mock evaluations",
    ],
  },
  {
    id: "cat",
    name: "CAT (MBA)",
    isCustom: false,
    stressTrigger: "Time pressure & VARC section anxiety",
    recommendedSessions: ["quick_calm", "deep_focus", "anxiety_reset"],
    tips: [
      "Quick Calm for time-pressure simulation in mock CATs",
      "Deep Focus before RC passage practice sets",
      "Box breathing lowers reactivity during tricky DI-LR sets",
    ],
  },
  {
    id: "gate",
    name: "GATE",
    isCustom: false,
    stressTrigger: "Technical depth & rank-list anxiety",
    recommendedSessions: ["deep_focus", "quick_calm", "sleep"],
    tips: [
      "10-Min Deep Focus before core engineering subjects",
      "Quick Calm before mock GATE full-length tests",
      "Sleep Meditation for signal-processing memory consolidation",
    ],
  },
  {
    id: "cuet",
    name: "CUET (UG)",
    isCustom: false,
    stressTrigger: "Multi-domain syllabus & university cutoff anxiety",
    recommendedSessions: ["anxiety_reset", "quick_calm", "deep_focus"],
    tips: [
      "Anxiety Reset after comparing domain-wise mock percentiles",
      "Quick Calm before switching between language and domain papers",
      "Deep Focus before lengthy reading-comprehension sections",
    ],
  },
  {
    id: "boards",
    name: "Class 12 Boards",
    isCustom: false,
    stressTrigger: "Parental expectations & marking-scheme stress",
    recommendedSessions: ["anxiety_reset", "sleep", "quick_calm"],
    tips: [
      "Anxiety Reset after comparing prep levels with classmates",
      "Sleep Meditation the night before each board paper",
      "Quick Calm 5 mins before entering the exam hall",
    ],
  },
  {
    id: "cds",
    name: "CDS / NDA",
    isCustom: false,
    stressTrigger: "Physical + academic dual preparation fatigue",
    recommendedSessions: ["quick_calm", "anxiety_reset", "deep_focus"],
    tips: [
      "Quick Calm after physical training before GK study blocks",
      "Deep Focus for SSB interview mental preparation",
      "Anxiety Reset after practice GD rounds",
    ],
  },
];

const sounds = [
  { id: "none" as const, name: "Silent" },
  { id: "rain" as const, name: "Cozy Rain" },
  { id: "waves" as const, name: "Ocean Waves" },
  { id: "beats" as const, name: "Binaural Beats" },
];

type SoundIdLocal = SoundId;

function loadCustomExams(): ExamProfile[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("mindmate_custom_exams");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export default function MeditationHub({ onAddXp }: MeditationHubProps) {
  const [innerTab, setInnerTab] = useState<InnerTab>("meditate");

  // Meditate tab state
  const [activeSession, setActiveSession] = useState<SessionInfo>(SESSIONS[0]);
  const [timeLeft, setTimeLeft] = useState(SESSIONS[0].duration);
  const [isPlaying, setIsPlaying] = useState(false);
  const [breathState, setBreathState] = useState<"Inhale" | "Hold" | "Exhale" | "Rest">("Inhale");
  const [breathCounter, setBreathCounter] = useState(4);
  const [ambientSound, setAmbientSound] = useState<SoundIdLocal>("none");
  const [completed, setCompleted] = useState(false);

  // Exam Focus tab state
  const [selectedExamId, setSelectedExamId] = useState<string>("jee");

  // My Exams tab state
  const [customExams, setCustomExams] = useState<ExamProfile[]>([]);
  const [newExamName, setNewExamName] = useState("");
  const [addError, setAddError] = useState("");

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const breathTimerRef = useRef<NodeJS.Timeout | null>(null);
  const onAddXpRef = useRef(onAddXp);

  useEffect(() => {
    onAddXpRef.current = onAddXp;
  }, [onAddXp]);

  useEffect(() => {
    setCustomExams(loadCustomExams());
  }, []);

  const allExams = [...DEFAULT_EXAMS, ...customExams];
  const selectedExam = allExams.find((e) => e.id === selectedExamId) ?? allExams[0];

  // Ambient sound playback
  useEffect(() => {
    if (isPlaying && ambientSound !== "none") {
      playAmbientSound(ambientSound);
    } else {
      stopAmbientSound();
    }
    return () => stopAmbientSound();
  }, [isPlaying, ambientSound]);

  const handleSoundChange = (soundId: SoundIdLocal) => {
    setAmbientSound(soundId);
  };

  const selectSession = useCallback((session: SessionInfo) => {
    setIsPlaying(false);
    setCompleted(false);
    setActiveSession(session);
    setTimeLeft(session.duration);
    setBreathState("Inhale");
    setBreathCounter(4);
  }, []);

  // Timer loop — onAddXp via ref to avoid resetting interval
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      setIsPlaying(false);
      setCompleted(true);
      onAddXpRef.current(activeSession.xp);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, timeLeft, activeSession]);

  // Box breathing loop
  useEffect(() => {
    if (!isPlaying) return;
    breathTimerRef.current = setInterval(() => {
      setBreathCounter((prev) => {
        if (prev <= 1) {
          setBreathState((cur) => {
            if (cur === "Inhale") return "Hold";
            if (cur === "Hold") return "Exhale";
            if (cur === "Exhale") return "Rest";
            return "Inhale";
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (breathTimerRef.current) clearInterval(breathTimerRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying((p) => !p);
    setCompleted(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCompleted(false);
    setTimeLeft(activeSession.duration);
    setBreathState("Inhale");
    setBreathCounter(4);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const getCircleScaleClass = () => {
    if (!isPlaying) return "scale-75";
    switch (breathState) {
      case "Inhale":
        return "scale-110 duration-[4000ms] transition-transform ease-out";
      case "Hold":
        return "scale-110 shadow-lg shadow-indigo-500/20";
      case "Exhale":
        return "scale-75 duration-[4000ms] transition-transform ease-in";
      default:
        return "scale-75";
    }
  };

  const handleAddExam = () => {
    const trimmed = newExamName.trim();
    if (!trimmed) {
      setAddError("Exam name cannot be empty.");
      return;
    }
    const duplicate = allExams.some(
      (e) => e.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) {
      setAddError("Exam already exists.");
      return;
    }
    const newExam: ExamProfile = {
      id: `custom_${Date.now()}`,
      name: trimmed,
      isCustom: true,
      stressTrigger: "General exam pressure",
      recommendedSessions: ["quick_calm", "anxiety_reset", "deep_focus"],
      tips: [
        "Use 2-Min Quick Calm before starting timed mock tests.",
        "5-Min Anxiety Reset when overwhelmed by syllabus.",
        "Sleep Meditation night before exam day.",
      ],
    };
    const updated = [...customExams, newExam];
    setCustomExams(updated);
    localStorage.setItem("mindmate_custom_exams", JSON.stringify(updated));
    setNewExamName("");
    setAddError("");
  };

  const handleDeleteExam = (id: string) => {
    const updated = customExams.filter((e) => e.id !== id);
    setCustomExams(updated);
    localStorage.setItem("mindmate_custom_exams", JSON.stringify(updated));
    if (selectedExamId === id) setSelectedExamId("jee");
  };

  const launchExamSession = (sessionId: MeditationType) => {
    const session = SESSIONS.find((s) => s.id === sessionId);
    if (session) {
      selectSession(session);
      setInnerTab("meditate");
    }
  };

  const tabs: { id: InnerTab; label: string; icon: React.ReactNode }[] = [
    { id: "meditate", label: "Meditate", icon: <Wind className="w-3.5 h-3.5" /> },
    { id: "exam_focus", label: "Exam Focus", icon: <Target className="w-3.5 h-3.5" /> },
    { id: "my_exams", label: "My Exams", icon: <GraduationCap className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Inner Tab Bar */}
      <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setInnerTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              innerTab === tab.id
                ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── MEDITATE TAB ── */}
      {innerTab === "meditate" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Session Selection */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-base text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-500" />
              Meditation Program
            </h3>
            <div className="space-y-3">
              {SESSIONS.map((session) => {
                const isSelected = activeSession.id === session.id;
                return (
                  <button
                    key={session.id}
                    onClick={() => selectSession(session)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 transform active:scale-[0.99] relative overflow-hidden ${
                      isSelected
                        ? "bg-white dark:bg-zinc-900 border-indigo-500 shadow-md"
                        : "bg-zinc-50/50 dark:bg-zinc-950/20 border-zinc-200/60 dark:border-zinc-800/60 hover:bg-white dark:hover:bg-zinc-900"
                    }`}
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${session.theme}`} />
                    <div className="pl-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-zinc-800 dark:text-zinc-100">
                          {session.title}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-amber-500 font-extrabold">
                            +{session.xp} XP
                          </span>
                          <span className="text-[10px] text-zinc-400 font-extrabold uppercase bg-zinc-200/50 dark:bg-zinc-800/80 px-2 py-0.5 rounded-full">
                            {session.duration / 60} Min
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                        {session.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Ambient Sound Mixer */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-4 shadow-sm">
              <h4 className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-3 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-indigo-500" /> Calm Ambient Sounds
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {sounds.map((sound) => {
                  const isActive = ambientSound === sound.id;
                  return (
                    <button
                      key={sound.id}
                      onClick={() => handleSoundChange(sound.id)}
                      className={`text-xs py-2 px-3 rounded-xl border font-semibold text-center transition-all ${
                        isActive
                          ? "bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                          : "bg-zinc-50/50 dark:bg-zinc-950/20 border-zinc-200 dark:border-zinc-800/80 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100"
                      }`}
                    >
                      {sound.name}
                    </button>
                  );
                })}
              </div>
              {ambientSound !== "none" && (
                <p className="text-[10px] text-emerald-500 font-bold mt-3 text-center flex items-center justify-center gap-1">
                  {isPlaying ? (
                    <>
                      <Volume2 className="w-3 h-3 animate-pulse" /> Playing {sounds.find((s) => s.id === ambientSound)?.name}...
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3 h-3" /> Sound ready — starts when session plays
                    </>
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Breathing Visualizer */}
          <div className="lg:col-span-2 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl p-6 shadow-sm flex flex-col justify-between items-center min-h-[480px]">
            <div className="text-center w-full">
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
                {activeSession.title}
              </h3>
              <p className="text-xs text-zinc-400 font-semibold uppercase mt-0.5 tracking-wider">
                Guided Breath Focus
              </p>
            </div>

            <div className="relative flex flex-col items-center justify-center h-64 w-64 my-6">
              <div
                className={`w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-[4000ms] text-white shadow-2xl relative z-10 ${
                  isPlaying
                    ? "bg-gradient-to-tr from-violet-600/90 to-indigo-500/90"
                    : "bg-gradient-to-tr from-zinc-400 to-zinc-500"
                } ${getCircleScaleClass()}`}
              >
                {isPlaying ? (
                  <>
                    <Wind className="w-6 h-6 animate-pulse" />
                    <span className="font-extrabold text-sm tracking-wide mt-1.5 uppercase">
                      {breathState === "Rest" ? "Hold Out" : breathState}
                    </span>
                    <span className="text-[10px] font-bold opacity-70 mt-0.5">{breathCounter}s</span>
                  </>
                ) : completed ? (
                  <>
                    <Award className="w-7 h-7 text-amber-300 animate-bounce" />
                    <span className="font-bold text-xs uppercase tracking-wider mt-1 text-zinc-100">
                      Done
                    </span>
                  </>
                ) : (
                  <>
                    <Play className="w-8 h-8 cursor-pointer ml-1" onClick={togglePlay} />
                    <span className="font-bold text-[10px] uppercase tracking-wider mt-1.5 text-zinc-200">
                      Ready
                    </span>
                  </>
                )}
              </div>
              {isPlaying && (
                <div className="absolute inset-0 rounded-full border border-indigo-500/30 animate-ping opacity-20 w-44 h-44 m-auto pointer-events-none" />
              )}
            </div>

            <div className="w-full flex flex-col items-center gap-4">
              {completed ? (
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 py-3 px-6 rounded-2xl text-center shadow">
                  <p className="text-xs font-bold flex items-center gap-1.5 justify-center">
                    <Award className="w-4 h-4" /> Session Complete!
                  </p>
                  <p className="text-[10px] font-semibold mt-1">
                    +{activeSession.xp} XP awarded to mental fitness streak.
                  </p>
                </div>
              ) : (
                <div className="text-4xl font-extrabold font-mono text-zinc-800 dark:text-zinc-100 tracking-tight">
                  {formatTime(timeLeft)}
                </div>
              )}

              <div className="flex gap-4 items-center">
                <button
                  onClick={handleReset}
                  className="p-3 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 text-zinc-600 dark:text-zinc-300 rounded-xl transition transform active:scale-95 flex items-center justify-center shadow-sm"
                  title="Reset"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={togglePlay}
                  className={`py-3 px-8 rounded-xl font-bold transition transform active:scale-95 shadow-md flex items-center gap-2 text-white ${
                    isPlaying
                      ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20"
                      : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20"
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-white" />
                      <span>Pause Session</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Start Session</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-zinc-400 italic text-center leading-relaxed">
                Follow the circle: expand on Inhale, hold full on Hold, contract on Exhale, hold empty on Rest.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── EXAM FOCUS TAB ── */}
      {innerTab === "exam_focus" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Exam List */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-base text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-500" />
              Select Your Exam
            </h3>
            <div className="space-y-2">
              {allExams.map((exam) => (
                <button
                  key={exam.id}
                  onClick={() => setSelectedExamId(exam.id)}
                  className={`w-full text-left px-4 py-3 rounded-2xl border text-sm font-semibold transition-all flex items-center justify-between ${
                    selectedExamId === exam.id
                      ? "bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                      : "bg-zinc-50/50 dark:bg-zinc-950/20 border-zinc-200/60 dark:border-zinc-800/60 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-900"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {exam.isCustom && (
                      <span className="text-[9px] font-extrabold uppercase bg-violet-500/15 text-violet-600 dark:text-violet-400 px-1.5 py-0.5 rounded-full border border-violet-500/20">
                        Custom
                      </span>
                    )}
                    {exam.name}
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              ))}
            </div>
            <p className="text-[10px] text-zinc-400 text-center pt-1">
              Add custom exams in the <strong>My Exams</strong> tab.
            </p>
          </div>

          {/* Exam Profile Panel */}
          {selectedExam && (
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/20 border border-indigo-200/60 dark:border-indigo-800/40 rounded-3xl p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-zinc-800 dark:text-zinc-100">
                      {selectedExam.name}
                    </h3>
                    <p className="text-xs text-rose-500 font-semibold mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
                      Stress trigger: {selectedExam.stressTrigger}
                    </p>
                  </div>
                  <GraduationCap className="w-8 h-8 text-indigo-400 opacity-60 flex-shrink-0" />
                </div>

                {/* Recommended Sessions */}
                <div className="mb-5">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
                    Recommended Sessions
                  </h4>
                  <div className="space-y-2">
                    {selectedExam.recommendedSessions.map((sessionId, i) => {
                      const session = SESSIONS.find((s) => s.id === sessionId);
                      if (!session) return null;
                      return (
                        <div
                          key={session.id}
                          className="flex items-center justify-between bg-white dark:bg-zinc-900 rounded-2xl px-4 py-3 border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold flex items-center justify-center">
                              {i + 1}
                            </span>
                            <div>
                              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                                {session.title}
                              </p>
                              <p className="text-[10px] text-zinc-400">{session.duration / 60} min · +{session.xp} XP</p>
                            </div>
                          </div>
                          <button
                            onClick={() => launchExamSession(session.id)}
                            className="text-[11px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl transition flex items-center gap-1"
                          >
                            <Play className="w-3 h-3 fill-white" /> Start
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tips */}
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 flex items-center gap-1.5">
                    <BookMarked className="w-3.5 h-3.5" /> Exam-Specific Tips
                  </h4>
                  <ul className="space-y-2">
                    {selectedExam.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── MY EXAMS TAB ── */}
      {innerTab === "my_exams" && (
        <div className="max-w-2xl space-y-6">
          <div>
            <h3 className="font-extrabold text-base text-zinc-800 dark:text-zinc-100 flex items-center gap-2 mb-1">
              <GraduationCap className="w-5 h-5 text-indigo-500" />
              Add Your Exam
            </h3>
            <p className="text-xs text-zinc-400">
              Custom exams appear in Exam Focus with general meditation recommendations.
            </p>
          </div>

          {/* Add form */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-5 shadow-sm">
            <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 block mb-2">
              Exam Name
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={newExamName}
                onChange={(e) => {
                  setNewExamName(e.target.value);
                  setAddError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleAddExam()}
                placeholder="e.g. CLAT, CA Foundation, KVPY..."
                className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
              />
              <button
                onClick={handleAddExam}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-1.5 transition active:scale-95 shadow-sm shadow-indigo-500/20"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            {addError && (
              <p className="text-xs text-rose-500 font-semibold mt-2">{addError}</p>
            )}
          </div>

          {/* Custom exam list */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
              Your Custom Exams ({customExams.length})
            </h4>
            {customExams.length === 0 ? (
              <div className="text-center py-10 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700">
                <GraduationCap className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
                <p className="text-sm text-zinc-400 font-semibold">No custom exams yet.</p>
                <p className="text-xs text-zinc-400 mt-1">Add one above to get tailored meditation recommendations.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {customExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl px-4 py-3 shadow-sm"
                  >
                    <div>
                      <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{exam.name}</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">Custom · General meditation plan</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedExamId(exam.id);
                          setInnerTab("exam_focus");
                        }}
                        className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline px-2 py-1"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteExam(exam.id)}
                        className="p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Built-in exam list (read-only reference) */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
              Built-in Exams
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {DEFAULT_EXAMS.map((exam) => (
                <div
                  key={exam.id}
                  className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400"
                >
                  {exam.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
