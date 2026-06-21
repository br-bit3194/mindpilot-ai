// components/JournalAnalyzer.tsx
"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Calendar,
  Smile,
  ShieldAlert,
  Flame,
  Award,
  Activity,
  Heart,
  ChevronRight,
  TrendingUp,
  Search,
} from "lucide-react";
import { analyzeJournal, ExtendedJournalAnalysis } from "@/lib/ai-client";
import { detectCrisisLanguage } from "@/lib/safety";
import CrisisHelplineBanner from "@/components/CrisisHelplineBanner";
import { JournalEntry } from "@/lib/types";
import {
  getTopicsForExam,
  TOPIC_CATEGORIES,
  WellnessTopic,
} from "@/lib/wellness-topics";
import { WifiOff, Lightbulb, Wind } from "lucide-react";

interface JournalAnalyzerProps {
  journals: JournalEntry[];
  onAddJournal: (text: string, analysis: ExtendedJournalAnalysis) => void;
  examGoal?: string;
}

export default function JournalAnalyzer({
  journals,
  onAddJournal,
  examGoal = "JEE",
}: JournalAnalyzerProps) {
  const exam = examGoal.replace(/ Prep.*/i, "").trim();
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<ExtendedJournalAnalysis | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCrisisBanner, setShowCrisisBanner] = useState(false);
  const [topicCategory, setTopicCategory] = useState("all");

  const journalTopics = getTopicsForExam(exam).filter(
    (t) => topicCategory === "all" || t.category === topicCategory
  );

  const applyTopic = (topic: WellnessTopic) => {
    setInputText(topic.journalPrompt);
  };

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    if (detectCrisisLanguage(inputText)) setShowCrisisBanner(true);
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = analyzeJournal(inputText, exam);
      setCurrentAnalysis(result);
      onAddJournal(inputText, result);
      setInputText("");
      setIsAnalyzing(false);
    }, 800);
  };

  const filteredJournals = journals.filter(
    (j) =>
      j.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.analysis.mood.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.analysis.trigger.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" role="region" aria-label="AI Journal Analyzer">
      <div className="lg:col-span-2 space-y-6">
        {showCrisisBanner && (
          <CrisisHelplineBanner onDismiss={() => setShowCrisisBanner(false)} />
        )}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500" aria-hidden="true" />
              <h3 className="font-bold text-base text-zinc-800 dark:text-zinc-100">
                Daily Wellness Journal
              </h3>
            </div>
            <span className="text-[9px] font-bold bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full flex items-center gap-1">
              <WifiOff className="w-2.5 h-2.5" /> Offline AI
            </span>
          </div>
          <p className="text-xs text-zinc-500 mb-3 leading-relaxed">
            Open-ended journaling for {exam} prep. MindMate AI uncovers hidden stress triggers and emotional patterns that standard mood trackers miss — no API key needed.
          </p>

          {/* Journal topic prompts */}
          <div className="mb-4 space-y-2">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Start with a topic — or write freely
            </p>
            <div className="flex flex-wrap gap-1.5">
              {TOPIC_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setTopicCategory(cat.id)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition ${
                    topicCategory === cat.id
                      ? "bg-violet-500/10 border-violet-500 text-violet-600"
                      : "border-zinc-200 dark:border-zinc-800 text-zinc-500"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {journalTopics.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => applyTopic(topic)}
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-indigo-500/10 hover:text-indigo-600 transition"
                >
                  {topic.label}
                </button>
              ))}
            </div>
          </div>
          <label htmlFor="journal-entry" className="sr-only">
            Daily journal entry
          </label>
          <textarea
            id="journal-entry"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isAnalyzing}
            aria-label="Write your daily journal entry for AI stress analysis"
            aria-busy={isAnalyzing}
            placeholder="e.g., Today was tough. I spent 8 hours on organic chemistry sn1/sn2 reactions but solved only half of the practice paper correctly. I feel like I'm falling behind compared to my mock test mates, and I couldn't sleep well last night thinking about the NEET cutoff..."
            className="w-full min-h-[160px] p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-sm text-zinc-800 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/80 outline-none resize-y transition"
          />
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[11px] text-zinc-400 font-semibold" aria-live="polite">
              {inputText.length} characters
            </span>
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !inputText.trim()}
              aria-label={isAnalyzing ? "Analyzing journal entry" : "Analyze and log journal entry"}
              className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-700 hover:to-indigo-600 text-white font-semibold py-2.5 px-5 rounded-xl shadow-md transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none transform active:scale-95 text-sm"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>AI Analyzing...</span>
                </>
              ) : (
                <span>Analyze & Log Entry</span>
              )}
            </button>
          </div>
        </div>

        {/* AI Analysis Result Display */}
        {currentAnalysis && (
          <div className="bg-gradient-to-tr from-violet-500/5 to-indigo-500/5 dark:from-violet-500/10 dark:to-indigo-500/5 border border-indigo-500/20 dark:border-indigo-500/30 rounded-2xl p-5 shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2 mb-4">
              <Smile className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-base text-indigo-600 dark:text-indigo-400">
                MindMate AI Pattern Analysis
              </h3>
              <span className="text-[10px] font-bold bg-emerald-500/15 text-emerald-500 px-2 py-0.5 rounded-full ml-auto flex items-center gap-1">
                <Award className="w-3 h-3" /> +100 XP Earned
              </span>
            </div>

            {/* Statistics Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
              <div className="bg-white/70 dark:bg-zinc-900/60 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Detected Mood</p>
                <p className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">{currentAnalysis.mood}</p>
              </div>

              <div className="bg-white/70 dark:bg-zinc-900/60 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Stress Score</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className={`text-lg font-extrabold ${currentAnalysis.stress_score > 70 ? "text-rose-500" : "text-emerald-500"}`}>
                    {currentAnalysis.stress_score}%
                  </span>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-zinc-900/60 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Confidence</p>
                <p className="text-lg font-extrabold text-teal-600 dark:text-teal-400 mt-1">{currentAnalysis.confidence_score}%</p>
              </div>

              <div className="bg-white/70 dark:bg-zinc-900/60 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Burnout Risk</p>
                <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full mt-2 ${
                  currentAnalysis.burnout_risk === "High"
                    ? "bg-rose-500/10 text-rose-500"
                    : currentAnalysis.burnout_risk === "Medium"
                    ? "bg-amber-500/10 text-amber-500"
                    : "bg-emerald-500/10 text-emerald-500"
                }`}>
                  {currentAnalysis.burnout_risk} Risk
                </span>
              </div>
            </div>

            {/* Analysis details */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50">
                <div className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200 font-bold text-xs">
                  <Activity className="w-4 h-4 text-violet-500" />
                  Primary Stress Trigger: <span className="text-indigo-600 dark:text-indigo-400">{currentAnalysis.trigger}</span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-450 mt-1.5 leading-relaxed">
                  {currentAnalysis.insight}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-xs text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1">
                  <Lightbulb className="w-4 h-4 text-amber-500" aria-hidden="true" />
                  Hidden Patterns (standard trackers miss these):
                </h4>
                <ul className="space-y-1.5">
                  {"hidden_patterns" in currentAnalysis &&
                    currentAnalysis.hidden_patterns?.map((pattern, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-zinc-500 bg-amber-500/5 border border-amber-500/10 p-2 rounded-lg flex gap-2"
                      >
                        <span className="text-amber-500 font-bold">•</span>
                        {pattern}
                      </li>
                    ))}
                </ul>
              </div>

              {"mindfulness_exercise" in currentAnalysis && currentAnalysis.mindfulness_exercise && (
                <div className="p-3 rounded-xl bg-sky-500/5 border border-sky-500/15 flex items-start gap-2">
                  <Wind className="w-4 h-4 text-sky-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-[10px] font-bold text-sky-600 uppercase">Recommended Mindfulness</p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                      {currentAnalysis.mindfulness_exercise}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-bold text-xs text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-1">
                  <Heart className="w-4 h-4 text-rose-500" aria-hidden="true" /> Tailored Coping Strategies:
                </h4>
                <ul className="space-y-2">
                  {currentAnalysis.copingStrategies.map((strategy, idx) => (
                    <li key={idx} className="flex gap-2 text-xs text-zinc-500 leading-relaxed bg-white/40 dark:bg-zinc-900/20 p-2.5 rounded-lg border border-zinc-200/40 dark:border-zinc-700/40">
                      <ChevronRight className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                      <span>{strategy}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* History panel */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-5 shadow-sm h-[600px] flex flex-col">
        <div className="flex items-center gap-2 mb-4 flex-shrink-0">
          <Calendar className="w-5 h-5 text-indigo-500" />
          <h3 className="font-bold text-base text-zinc-800 dark:text-zinc-100">
            Journal History
          </h3>
        </div>

        {/* Search bar */}
        <div className="relative mb-4 flex-shrink-0">
          <input
            type="text"
            placeholder="Search logs or triggers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/20 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/80 outline-none"
          />
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filteredJournals.length === 0 ? (
            <p className="text-xs text-zinc-400 text-center py-12">
              {journals.length === 0 ? "Your journal logs will appear here." : "No matching journals found."}
            </p>
          ) : (
            filteredJournals.map((item) => (
              <div
                key={item.id}
                onClick={() => setCurrentAnalysis(item.analysis)}
                className="p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800/60 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 bg-zinc-50/30 dark:bg-zinc-950/10 hover:bg-white dark:hover:bg-zinc-900/50 shadow-sm hover:shadow transition cursor-pointer group"
              >
                <div className="flex justify-between items-center text-[10px] text-zinc-400 font-bold mb-1">
                  <span>{new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  <span className={`px-1.5 py-0.5 rounded-full ${
                    item.analysis.burnout_risk === "High"
                      ? "bg-rose-500/10 text-rose-500"
                      : item.analysis.burnout_risk === "Medium"
                      ? "bg-amber-500/10 text-amber-500"
                      : "bg-emerald-500/10 text-emerald-500"
                  }`}>
                    {item.analysis.mood}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                  {item.text}
                </p>
                <div className="mt-2 text-[10px] text-zinc-500 flex items-center justify-between pt-2 border-t border-dashed border-zinc-100 dark:border-zinc-800/60 group-hover:border-indigo-500/20">
                  <span className="font-semibold text-indigo-500">Trigger: {item.analysis.trigger}</span>
                  <span>Stress: {item.analysis.stress_score}%</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
