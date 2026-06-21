"use client";

import React, { useState } from "react";
import { Heart, Check } from "lucide-react";
import { MoodEntry, MoodLevel, MOOD_CONFIG } from "@/lib/types";

interface MoodCheckInProps {
  moods: MoodEntry[];
  onAddMood: (mood: MoodLevel, note?: string) => void;
}

const MOOD_LEVELS: MoodLevel[] = [
  "great",
  "good",
  "okay",
  "stressed",
  "overwhelmed",
];

export default function MoodCheckIn({ moods, onAddMood }: MoodCheckInProps) {
  const [selected, setSelected] = useState<MoodLevel | null>(null);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const todayEntry = moods.find(
    (m) => new Date(m.date).toDateString() === new Date().toDateString()
  );

  const handleSave = () => {
    if (!selected) return;
    onAddMood(selected, note.trim() || undefined);
    setSaved(true);
    setNote("");
    setTimeout(() => setSaved(false), 2000);
  };

  if (todayEntry && !selected) {
    const config = MOOD_CONFIG[todayEntry.mood];
    return (
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200/60 dark:border-emerald-800/40 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{config.emoji}</span>
          <div>
            <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
              Today&apos;s mood: {config.label}
            </p>
            <p className="text-xs text-zinc-500">
              Logged at {new Date(todayEntry.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>
        <button
          onClick={() => setSelected(todayEntry.mood)}
          className="text-xs font-bold text-emerald-600 hover:underline"
        >
          Update
        </button>
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-labelledby="mood-checkin-heading"
      className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-5 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-rose-500" aria-hidden="true" />
        <h3 id="mood-checkin-heading" className="font-bold text-sm text-zinc-800 dark:text-zinc-100">
          Quick Mood Check-In
        </h3>
      </div>
      <p className="text-xs text-zinc-500 mb-4">
        How are you feeling right now? One tap helps AI track your emotional patterns.
      </p>

      <div className="flex flex-wrap gap-2 mb-4" role="radiogroup" aria-label="Select your current mood">
        {MOOD_LEVELS.map((level) => {
          const config = MOOD_CONFIG[level];
          const isActive = selected === level;
          return (
            <button
              key={level}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => setSelected(level)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition ${
                isActive
                  ? "bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              }`}
            >
              <span className="text-lg">{config.emoji}</span>
              {config.label}
            </button>
          );
        })}
      </div>

      <label htmlFor="mood-note" className="sr-only">
        Optional mood note
      </label>
      <input
        id="mood-note"
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional: one-line note (e.g. 'bad mock test')"
        aria-label="Optional mood note"
        className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
      />

      <button
        type="button"
        onClick={handleSave}
        disabled={!selected}
        aria-label="Log mood and earn 25 XP"
        className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${
          selected
            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
        }`}
      >
        {saved ? (
          <>
            <Check className="w-4 h-4" /> Saved!
          </>
        ) : (
          "Log Mood (+25 XP)"
        )}
      </button>
    </div>
  );
}
