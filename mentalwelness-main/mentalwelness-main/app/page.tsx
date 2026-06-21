// app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import JournalAnalyzer from "@/components/JournalAnalyzer";
import WellnessCoach from "@/components/WellnessCoach";
import MeditationHub from "@/components/MeditationHub";
import StressReliefVideos from "@/components/StressReliefVideos";
import WellnessGames from "@/components/WellnessGames";
import SkipLink from "@/components/SkipLink";
import { ExtendedJournalAnalysis } from "@/lib/local-ai";
import { JournalEntry, MoodEntry, MoodLevel, TabId } from "@/lib/types";
import { calculateLevel } from "@/lib/wellness-stats";
import { Menu, X, Sun, Moon } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [examGoal, setExamGoal] = useState("JEE/NEET");

  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [moods, setMoods] = useState<MoodEntry[]>([]);

  useEffect(() => {
    setLevel(calculateLevel(xp));
  }, [xp]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedXp = localStorage.getItem("mindmate_xp");
    const storedStreak = localStorage.getItem("mindmate_streak");
    const storedJournals = localStorage.getItem("mindmate_journals");
    const storedMoods = localStorage.getItem("mindmate_moods");
    const storedTheme = localStorage.getItem("mindmate_theme");
    const storedExam = localStorage.getItem("mindmate_exam_goal");

    if (storedXp) setXp(Number(storedXp));
    if (storedStreak) setStreak(Number(storedStreak));
    if (storedJournals) setJournals(JSON.parse(storedJournals));
    if (storedMoods) setMoods(JSON.parse(storedMoods));
    if (storedExam) setExamGoal(storedExam);
    setDarkMode(storedTheme !== "light");
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("mindmate_theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("mindmate_theme", "light");
    }
  }, [darkMode]);

  const addXp = (amount: number) => {
    setXp((prev) => {
      const next = prev + amount;
      localStorage.setItem("mindmate_xp", next.toString());
      return next;
    });
  };

  const incrementStreak = () => {
    setStreak((prev) => {
      const next = prev + 1;
      localStorage.setItem("mindmate_streak", next.toString());
      return next;
    });
  };

  const handleAddJournal = (text: string, analysis: ExtendedJournalAnalysis) => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      text,
      analysis,
    };
    const updated = [newEntry, ...journals];
    setJournals(updated);
    localStorage.setItem("mindmate_journals", JSON.stringify(updated));
    addXp(100);
    incrementStreak();
  };

  const handleAddMood = (mood: MoodLevel, note?: string) => {
    const filtered = moods.filter(
      (m) => new Date(m.date).toDateString() !== new Date().toDateString()
    );
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood,
      note,
    };
    const updated = [newEntry, ...filtered];
    setMoods(updated);
    localStorage.setItem("mindmate_moods", JSON.stringify(updated));
    addXp(25);
    incrementStreak();
  };

  return (
    <>
      <SkipLink />
      <div className="flex min-h-screen bg-zinc-50 dark:bg-black font-sans text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <div
        className={`fixed inset-y-0 left-0 z-50 transform lg:translate-x-0 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:relative lg:flex"
        }`}
        aria-hidden={!sidebarOpen ? undefined : false}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSidebarOpen(false);
          }}
          xp={xp}
          streak={streak}
          level={level}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-800 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-30" role="banner">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={sidebarOpen}
              aria-controls="sidebar-nav"
              className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 lg:hidden transition"
            >
              {sidebarOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
            <h2 className="font-extrabold text-lg text-zinc-800 dark:text-zinc-100 tracking-tight hidden lg:block">
              MindMate AI — Exam Wellness
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <label htmlFor="exam-goal-select" className="sr-only">
              Select target exam
            </label>
            <select
              id="exam-goal-select"
              value={examGoal}
              onChange={(e) => {
                setExamGoal(e.target.value);
                localStorage.setItem("mindmate_exam_goal", e.target.value);
              }}
              aria-label="Select target exam"
              className="text-xs font-bold bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-zinc-700 dark:text-zinc-300 hidden sm:block"
            >
              {["JEE", "NEET", "UPSC", "CAT", "GATE", "CUET", "Boards"].map((e) => (
                <option key={e} value={e}>
                  {e} Prep
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 transition"
            >
              {darkMode ? <Sun className="w-4.5 h-4.5" aria-hidden="true" /> : <Moon className="w-4.5 h-4.5" aria-hidden="true" />}
            </button>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white font-extrabold text-xs shadow-md">
                A
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Aspirant</p>
                <p className="text-[10px] text-zinc-400 font-semibold tracking-wide uppercase">
                  {examGoal} Prep
                </p>
              </div>
            </div>
          </div>
        </header>

        <main id="main-content" role="main" aria-label="MindMate wellness content" className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {activeTab === "dashboard" && (
            <Dashboard
              journals={journals}
              moods={moods}
              onAddMood={handleAddMood}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}
          {activeTab === "journal" && (
            <JournalAnalyzer
              journals={journals}
              onAddJournal={handleAddJournal}
              examGoal={examGoal}
            />
          )}
          {activeTab === "coach" && <WellnessCoach onAddXp={addXp} examGoal={examGoal} />}
          {activeTab === "meditation" && <MeditationHub onAddXp={addXp} />}
          {activeTab === "videos" && <StressReliefVideos onAddXp={addXp} />}
          {activeTab === "games" && (
            <WellnessGames onAddXp={addXp} onUpdateStreak={incrementStreak} />
          )}
        </main>
      </div>

      {sidebarOpen && (
        <div
          role="presentation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
        />
      )}
    </div>
    </>
  );
}
