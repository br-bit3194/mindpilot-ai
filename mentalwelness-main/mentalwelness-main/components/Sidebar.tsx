// components/Sidebar.tsx
"use client";

import React from "react";
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Compass,
  Video,
  Gamepad2,
  Flame,
  Sparkles,
} from "lucide-react";
import { TabId } from "@/lib/types";

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  xp: number;
  streak: number;
  level: number;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  xp,
  streak,
  level,
}: SidebarProps) {
  const menuItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "journal" as const, label: "AI Journal", icon: BookOpen },
    { id: "coach" as const, label: "Wellness Coach", icon: MessageSquare },
    { id: "meditation" as const, label: "Meditation Hub", icon: Compass },
    { id: "videos" as const, label: "Stress Relief Videos", icon: Video },
    { id: "games" as const, label: "Wellness Games", icon: Gamepad2 },
  ];

  const xpToNextLevel = level * 500;
  const xpPercentage = Math.min(100, Math.floor((xp / xpToNextLevel) * 100));

  return (
    <aside
      id="sidebar-nav"
      aria-label="Main navigation"
      className="w-80 border-r border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl flex flex-col justify-between p-6 h-screen sticky top-0"
    >
      <div>
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="p-2.5 bg-gradient-to-tr from-violet-600 to-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/20 text-white">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-2xl bg-gradient-to-r from-violet-600 to-indigo-500 dark:from-violet-400 dark:to-indigo-300 bg-clip-text text-transparent tracking-tight">
              MindMate AI
            </h1>
            <p className="text-[10px] text-zinc-500 font-semibold tracking-wider uppercase">
              Exam Wellness Suite
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-900/50 rounded-2xl p-4 mb-6 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-bounce" />
              <div>
                <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">
                  Active Streak
                </p>
                <p className="font-extrabold text-zinc-800 dark:text-zinc-100">
                  {streak} {streak === 1 ? "Day" : "Days"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">
                Level
              </p>
              <p className="font-extrabold text-indigo-600 dark:text-indigo-400">{level}</p>
            </div>
          </div>
          <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-violet-600 to-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2 text-[11px] text-zinc-500">
            <span>{xp} XP</span>
            <span>{xpToNextLevel} XP for Lv.{level + 1}</span>
          </div>
        </div>

        <nav className="space-y-1.5" aria-label="Wellness features">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                aria-current={isActive ? "page" : undefined}
                aria-label={item.label}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group relative ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-50 to-violet-50/50 dark:from-indigo-950/40 dark:to-violet-950/20 text-indigo-600 dark:text-indigo-400 border-l-4 border-indigo-600 dark:border-indigo-400 pl-3"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/70 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-100 border-l-4 border-transparent"
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-300 group-hover:scale-105 ${
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-zinc-400 dark:text-zinc-500"
                  }`}
                  aria-hidden="true"
                />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-zinc-200/60 dark:border-zinc-800/60 pt-4 text-center">
        <p className="text-[11px] italic text-zinc-500">
          NEET · JEE · UPSC · CAT · GATE · CUET
        </p>
      </div>
    </aside>
  );
}
