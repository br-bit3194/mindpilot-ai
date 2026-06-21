"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  MessageSquare,
  Send,
  Sparkles,
  Brain,
  Award,
  AlertCircle,
  WifiOff,
  ChevronDown,
} from "lucide-react";
import { getWellnessCoachResponse } from "@/lib/ai-client";
import { detectCrisisLanguage } from "@/lib/safety";
import {
  getCoachChipsForExam,
  getTopicsForExam,
  TOPIC_CATEGORIES,
} from "@/lib/wellness-topics";
import CrisisHelplineBanner from "@/components/CrisisHelplineBanner";

interface Message {
  role: "user" | "model";
  content: string;
}

interface WellnessCoachProps {
  onAddXp: (amount: number) => void;
  examGoal?: string;
}

export default function WellnessCoach({ onAddXp, examGoal = "JEE" }: WellnessCoachProps) {
  const exam = examGoal.replace(/ Prep.*/i, "").trim();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content:
        `Hello! I'm MindMate — your always-available wellness companion for ${exam}, NEET, JEE, UPSC, CAT, GATE & CUET prep.\n\n` +
        `I work **offline** — no API key needed. I analyze stress patterns, offer coping strategies, and guide mindfulness exercises tailored to your exam journey.\n\n` +
        `How are you feeling today?`,
    },
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showCrisisBanner, setShowCrisisBanner] = useState(false);
  const [topicCategory, setTopicCategory] = useState("all");
  const [showTopics, setShowTopics] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const allChips = useMemo(() => getCoachChipsForExam(exam), [exam]);

  const filteredTopics = useMemo(() => {
    const topics = getTopicsForExam(exam);
    if (topicCategory === "all") return topics;
    return topics.filter((t) => t.category === topicCategory);
  }, [exam, topicCategory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    if (detectCrisisLanguage(text)) setShowCrisisBanner(true);

    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInputMsg("");
    setShowTopics(false);
    setIsTyping(true);

    // Brief delay for natural feel — response is instant local AI
    setTimeout(() => {
      const response = getWellnessCoachResponse(history, text, exam);
      setIsTyping(false);
      setMessages((prev) => [...prev, { role: "model", content: response }]);
      onAddXp(20);
    }, 600 + Math.random() * 400);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          AI Wellness Coach
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Hyper-personalized, contextual support — coping strategies, mindfulness, and motivation. No API key required.
        </p>
      </div>

      <div
        role="region"
        aria-label="AI Wellness Coach chat"
        className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-5 shadow-sm flex flex-col"
        style={{ height: "640px" }}
      >
        {showCrisisBanner && (
          <div className="mb-4 flex-shrink-0">
            <CrisisHelplineBanner onDismiss={() => setShowCrisisBanner(false)} />
          </div>
        )}

        <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4 flex-shrink-0">
          <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-violet-500 text-white rounded-xl shadow-md">
            <MessageSquare className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h3 className="font-extrabold text-base text-zinc-800 dark:text-zinc-100 flex items-center gap-2 flex-wrap">
              MindMate Coach
              <span className="text-[9px] font-bold bg-emerald-500/10 text-emerald-600 py-0.5 px-2 rounded-full flex items-center gap-1">
                <WifiOff className="w-2.5 h-2.5" /> OFFLINE AI
              </span>
            </h3>
            <p className="text-xs text-zinc-500">
              Empathetic companion for {exam} stress, burnout, mock anxiety & exam-day nerves
            </p>
          </div>
        </div>

        <div
          className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 min-h-0"
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
        >
          {messages.map((m, idx) => {
            const isUser = m.role === "user";
            return (
              <div key={idx} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm border ${
                    isUser
                      ? "bg-gradient-to-r from-violet-600 to-indigo-500 text-white border-transparent"
                      : "bg-zinc-50 dark:bg-zinc-950/40 text-zinc-800 dark:text-zinc-100 border-zinc-100 dark:border-zinc-800"
                  }`}
                >
                  {!isUser && (
                    <p className="text-[9px] text-indigo-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Brain className="w-3 h-3" aria-hidden="true" /> MindMate
                    </p>
                  )}
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex justify-start" role="status" aria-label="Coach is typing">
              <div className="bg-zinc-50 dark:bg-zinc-950/40 border max-w-[80%] rounded-2xl px-4 py-3 text-xs flex items-center gap-1.5">
                <span className="text-[9px] text-zinc-400 font-semibold">MindMate is thinking</span>
                <span className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce" />
                <span className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <span className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 flex-shrink-0">
          {showTopics && (
            <div className="mb-4 space-y-3">
              <button
                type="button"
                onClick={() => setShowTopics(!showTopics)}
                className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                Wellness Topics for {exam}
                <ChevronDown className={`w-3 h-3 transition ${showTopics ? "rotate-180" : ""}`} />
              </button>

              <div className="flex flex-wrap gap-1.5">
                {TOPIC_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setTopicCategory(cat.id)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition ${
                      topicCategory === cat.id
                        ? "bg-indigo-500/10 border-indigo-500 text-indigo-600"
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-500"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {filteredTopics.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleSendMessage(topic.coachPrompt)}
                    className="text-[11px] text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 bg-zinc-50 dark:bg-zinc-950/30 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-left font-semibold transition"
                  >
                    {topic.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {allChips.slice(0, 4).map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(chip)}
                    className="text-[10px] text-indigo-600 bg-indigo-500/5 border border-indigo-500/20 rounded-lg px-2.5 py-1 font-semibold"
                  >
                    {chip.length > 55 ? chip.slice(0, 55) + "…" : chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!showTopics && (
            <button
              type="button"
              onClick={() => setShowTopics(true)}
              className="text-[10px] text-indigo-600 font-bold mb-3 hover:underline"
            >
              Show wellness topics
            </button>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputMsg);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              id="coach-message-input"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Share what's on your mind — mock stress, sleep, family pressure..."
              disabled={isTyping}
              aria-label="Message to wellness coach"
              className="flex-1 px-4 py-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/20 text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none"
            />
            <button
              type="submit"
              disabled={isTyping || !inputMsg.trim()}
              aria-label="Send message"
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl disabled:opacity-40"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>
          <p className="text-[10px] text-zinc-400 text-center mt-2 flex items-center justify-center gap-1">
            <Award className="w-3 h-3 text-indigo-500" aria-hidden="true" />
            Offline AI · +20 XP per conversation · Crisis helplines auto-detected
          </p>
        </div>
      </div>
    </div>
  );
}
