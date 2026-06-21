// components/Dashboard.tsx
"use client";

import React from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Brain,
  Coffee,
  Compass,
  Gamepad2,
  Heart,
  MessageSquare,
  Moon,
  TrendingUp,
  Video,
} from "lucide-react";
import { JournalEntry, MoodEntry, MoodLevel, TabId } from "@/lib/types";
import {
  aggregateStressTriggers,
  buildWellnessChartData,
  getWellnessScores,
} from "@/lib/wellness-stats";
import MoodCheckIn from "@/components/MoodCheckIn";

interface DashboardProps {
  journals: JournalEntry[];
  moods: MoodEntry[];
  onAddMood: (mood: MoodLevel, note?: string) => void;
  onNavigate: (tab: TabId) => void;
}

export default function Dashboard({ journals, moods, onAddMood, onNavigate }: DashboardProps) {
  const hasEntries = journals.length > 0;
  const { mood, stressScore, confidenceScore, burnoutRisk } = getWellnessScores(journals, moods);

  // Calculate average stats over history
  const totalEntries = journals.length;
  const averageStress = totalEntries
    ? Math.round(
        journals.reduce((sum, j) => sum + j.analysis.stress_score, 0) /
          totalEntries,
      )
    : 45;
  const averageConfidence = totalEntries
    ? Math.round(
        journals.reduce((sum, j) => sum + j.analysis.confidence_score, 0) /
          totalEntries,
      )
    : 68;

  const triggersList = React.useMemo(
    () => aggregateStressTriggers(journals),
    [journals]
  );

  // Risk Detection System warning signals
  const showsRiskAlert = stressScore > 80 || burnoutRisk === "High";

  const chartData = React.useMemo(
    () => buildWellnessChartData(journals, moods),
    [journals, moods]
  );

  // SVG Line Chart math
  const width = 500;
  const height = 180;
  const padding = 25;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const getPoints = (key: "stress" | "confidence") => {
    if (chartData.length < 2) return "";
    return chartData
      .map((d, index) => {
        const x = padding + (index / (chartData.length - 1)) * chartWidth;
        const val = d[key];
        const y = padding + chartHeight - (val / 100) * chartHeight;
        return `${x},${y}`;
      })
      .join(" ");
  };

  const stressPoints = getPoints("stress");
  const confidencePoints = getPoints("confidence");

  return (
    <div className="space-y-6">
      {/* Welcome & Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Aspirant Wellness Hub
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Track your exam readiness from a mental fitness perspective.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onNavigate("journal")}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-700 hover:to-indigo-600 text-white font-semibold py-2.5 px-4 rounded-xl shadow-md transition-all duration-300 transform active:scale-95">
            <span>Write Daily Journal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <MoodCheckIn moods={moods} onAddMood={onAddMood} />

      {/* Extreme Stress / Risk Alerts */}
      {showsRiskAlert && (
        <div className="bg-red-500/10 border border-red-500/20 dark:border-red-500/30 rounded-2xl p-4 flex gap-3 text-red-700 dark:text-red-400 animate-pulse">
          <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">
              AI Risk Alert: Elevated Stress Detected
            </h4>
            <p className="text-xs mt-1 text-red-600 dark:text-red-400/90 leading-relaxed">
              Your recent logs show stress levels above 80% with a High Burnout
              risk. We recommend taking an immediate break, pausing mock tests,
              and using our 5-minute Anxiety Reset breathing meditation. If
              stress persists, consider speaking with an academy counselor or a
              mentor.
            </p>
            <button
              onClick={() => onNavigate("meditation")}
              className="mt-3 text-xs font-bold underline flex items-center gap-1 hover:text-red-800 dark:hover:text-red-300">
              Start Anxiety Reset Meditation Now
            </button>
          </div>
        </div>
      )}

      {/* Main Status Widgets Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Emotional Health widget */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Emotional Health
              </span>
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500/10" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
                {mood}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
              Current mood detected from your latest journal entry.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold">
            <span className="text-zinc-500">Stress: {stressScore}%</span>
            <span className="text-zinc-500">
              Confidence: {confidenceScore}%
            </span>
          </div>
        </div>

        {/* Study Health widget */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Study Health
              </span>
              <Brain className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
                {Math.max(10, 100 - stressScore)}%
              </span>
              <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 py-0.5 px-2 rounded-full">
                Focus Score
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
              Calculated based on mood clarity, rest level, and burnout risk.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold">
            <span className="text-zinc-500">Consistency: High</span>
            <span className="text-zinc-500">Burnout: {burnoutRisk}</span>
          </div>
        </div>

        {/* Wellness Health widget */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Wellness Health
              </span>
              <Coffee className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
                {stressScore > 75 ? "Needs Care" : "Good"}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
              Overall health balance based on stress load and coaching feedback.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold">
            <span className="text-zinc-500 flex items-center gap-1">
              <Moon className="w-3.5 h-3.5" /> Sleep:{" "}
              {stressScore > 80 ? "Poor" : "7h avg"}
            </span>
            <span className="text-zinc-500 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> Meditation: Active
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid - Chart & Triggers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stress & Confidence Trend Chart */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-5 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-base text-zinc-800 dark:text-zinc-100">
                  Stress & Confidence Trends
                </h3>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-rose-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  Stress
                </span>
                <span className="flex items-center gap-1.5 text-indigo-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                  Confidence
                </span>
              </div>
            </div>

            {/* SVG Line Chart */}
            <div className="relative w-full h-[180px] bg-zinc-50 dark:bg-zinc-950 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
              {chartData.length < 2 ? (
                <div className="text-xs text-zinc-400 text-center p-4">
                  Log at least 2 journals to plot your wellness trend line.
                </div>
              ) : (
                <svg
                  viewBox={`0 0 ${width} ${height}`}
                  className="w-full h-full p-2">
                  <defs>
                    <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  <line
                    x1={padding}
                    y1={padding}
                    x2={width - padding}
                    y2={padding}
                    stroke="#e4e4e7"
                    strokeDasharray="3 3"
                    className="dark:stroke-zinc-800"
                  />
                  <line
                    x1={padding}
                    y1={padding + chartHeight / 2}
                    x2={width - padding}
                    y2={padding + chartHeight / 2}
                    stroke="#e4e4e7"
                    strokeDasharray="3 3"
                    className="dark:stroke-zinc-800"
                  />
                  <line
                    x1={padding}
                    y1={padding + chartHeight}
                    x2={width - padding}
                    y2={padding + chartHeight}
                    stroke="#e4e4e7"
                    className="dark:stroke-zinc-800"
                  />

                  {/* Shaded Areas */}
                  {stressPoints && (
                    <polygon
                      points={`${padding},${padding + chartHeight} ${stressPoints} ${padding + chartWidth},${padding + chartHeight}`}
                      fill="url(#stressGrad)"
                    />
                  )}
                  {confidencePoints && (
                    <polygon
                      points={`${padding},${padding + chartHeight} ${confidencePoints} ${padding + chartWidth},${padding + chartHeight}`}
                      fill="url(#confGrad)"
                    />
                  )}

                  {/* Trend Lines */}
                  {stressPoints && (
                    <polyline
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2.5"
                      points={stressPoints}
                      strokeLinecap="round"
                    />
                  )}
                  {confidencePoints && (
                    <polyline
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="2.5"
                      points={confidencePoints}
                      strokeLinecap="round"
                    />
                  )}

                  {/* Data Point Circles */}
                  {chartData.map((d, index) => {
                    const x =
                      padding + (index / (chartData.length - 1)) * chartWidth;
                    const stressY =
                      padding + chartHeight - (d.stress / 100) * chartHeight;
                    const confY =
                      padding +
                      chartHeight -
                      (d.confidence / 100) * chartHeight;

                    return (
                      <g key={index}>
                        <circle cx={x} cy={stressY} r="3.5" fill="#ef4444" />
                        <circle cx={x} cy={confY} r="3.5" fill="#6366f1" />
                        {/* Dates Labels */}
                        <text
                          x={x}
                          y={height - 5}
                          textAnchor="middle"
                          fontSize="9"
                          fill="#71717a"
                          fontWeight="bold">
                          {d.date}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>
          </div>
          <div className="mt-3 text-xs text-zinc-500 flex items-center justify-between">
            <span>
              Average Stress:{" "}
              <b className="text-zinc-800 dark:text-zinc-200">
                {averageStress}%
              </b>
            </span>
            <span>
              Average Confidence:{" "}
              <b className="text-zinc-800 dark:text-zinc-200">
                {averageConfidence}%
              </b>
            </span>
          </div>
        </div>

        {/* Hidden Stress Triggers & Insights */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-base text-zinc-800 dark:text-zinc-100">
                Hidden Stress Triggers
              </h3>
            </div>
            {journals.length === 0 ? (
              <p className="text-xs text-zinc-400 py-6 text-center leading-relaxed">
                No stress triggers identified yet. Write a journal to trigger AI
                analysis.
              </p>
            ) : (
              <div className="space-y-3">
                {triggersList.map((t, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/70 bg-zinc-50/50 dark:bg-zinc-950/20">
                    <div>
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        {t.name}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">
                        Identified {t.count} {t.count === 1 ? "time" : "times"}{" "}
                        in journal
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.impact === "High"
                          ? "bg-rose-500/10 text-rose-500"
                          : t.impact === "Medium"
                            ? "bg-amber-500/10 text-amber-600"
                            : "bg-emerald-500/10 text-emerald-600"
                      }`}>
                      {t.impact} Impact
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
            <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              AI Wellness Tip:
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
              {stressScore > 70
                ? "Your stress triggers peak after mock exams. We suggest scheduling low-intensity study sessions on exam nights."
                : "You are doing great! Keep your focus sessions to under 45 minutes with a physical stretch break."}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Access Tools Grid */}
      <div>
        <h3 className="font-extrabold text-lg text-zinc-900 dark:text-white mb-3 tracking-tight">
          Mental Training Arena
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => onNavigate("coach")}
            className="group bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-4 text-left hover:border-indigo-500/50 hover:shadow-md transition-all duration-300">
            <div className="w-10 h-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center font-bold mb-3 transition-colors group-hover:bg-indigo-500 group-hover:text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-100">
              AI Coach Chat
            </h4>
            <p className="text-xs text-zinc-500 mt-1">
              Chat 24/7 for motivation and anxiety release.
            </p>
          </button>

          <button
            onClick={() => onNavigate("meditation")}
            className="group bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-4 text-left hover:border-violet-500/50 hover:shadow-md transition-all duration-300">
            <div className="w-10 h-10 bg-violet-500/10 text-violet-500 rounded-xl flex items-center justify-center font-bold mb-3 transition-colors group-hover:bg-violet-500 group-hover:text-white">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-100">
              Guided Meditation
            </h4>
            <p className="text-xs text-zinc-500 mt-1">
              2, 5, or 10-minute sessions with visualizer.
            </p>
          </button>

          <button
            onClick={() => onNavigate("videos")}
            className="group bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-4 text-left hover:border-teal-500/50 hover:shadow-md transition-all duration-300">
            <div className="w-10 h-10 bg-teal-500/10 text-teal-500 rounded-xl flex items-center justify-center font-bold mb-3 transition-colors group-hover:bg-teal-500 group-hover:text-white">
              <Video className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-100">
              Stress Relief Videos
            </h4>
            <p className="text-xs text-zinc-500 mt-1">
              Watch curated videos to lower exam anxiety.
            </p>
          </button>

          <button
            onClick={() => onNavigate("games")}
            className="group bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-4 text-left hover:border-amber-500/50 hover:shadow-md transition-all duration-300">
            <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center font-bold mb-3 transition-colors group-hover:bg-amber-500 group-hover:text-white">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-100">
              Wellness Games
            </h4>
            <p className="text-xs text-zinc-500 mt-1">
              8 games: Quiz, Breath, Pick & Eat Cam & more.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
