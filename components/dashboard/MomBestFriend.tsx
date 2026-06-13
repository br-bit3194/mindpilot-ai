'use client';

import React, { useState } from 'react';
import { DailyLogEntry } from '@/lib/types';
import { Heart, Coffee, ShieldAlert, Sparkles, Smile, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudentData } from '@/hooks/useStudentData';

interface MomBestFriendProps {
  latestEntry: DailyLogEntry | undefined;
}

export default function MomBestFriend({ latestEntry }: MomBestFriendProps) {
  const { profile } = useStudentData();
  const [activePersona, setActivePersona] = useState<'mom' | 'friend'>('mom');
  const [interactiveAction, setInteractiveAction] = useState<string | null>(null);

  const getMomMessage = () => {
    const name = profile?.name || 'Beta';
    if (!latestEntry) {
      return `${name}, please make sure you are eating your meals on time. Take care of yourself first, study later.`;
    }

    const { sleepHours, studyHours, mood } = latestEntry.checkIn;
    const triggers = latestEntry.analysis.stressTriggers;

    if (sleepHours < 6) {
      return `${name}, you only slept ${sleepHours} hours! This is not healthy. No exam is more important than your sleep. I am sending you a virtual cup of warm turmeric milk 🥛. Close the books by 10 PM tonight, please. I am proud of your hard work, always.`;
    }

    if (studyHours > 12) {
      return `You have been at your study desk for ${studyHours} hours today. That's too much, ${name}. Get up right now, stretch, and eat a fruit. Your health and happiness are worth more than any rank list.`;
    }

    if (mood === 'anxious' || mood === 'exhausted') {
      return `I can feel how heavy this preparation is for you. Take a deep breath, ${name}. You are my smart child, and one mock test score cannot change that. I love you and I am standing right beside you.`;
    }

    return `${name}, you are doing wonderfully. Just make sure to drink water and take small breaks. I am always proud of you.`;
  };

  const getFriendMessage = () => {
    const name = profile?.name || 'buddy';
    if (!latestEntry) {
      return `Hey ${name}! Don't stress too much. Let's tackle this exam one day at a time. We've got this!`;
    }

    const { mood, studyHours, mockTestScore } = latestEntry.checkIn;
    const triggers = latestEntry.analysis.stressTriggers;

    const subject = triggers.find(t => ['physics', 'chemistry', 'math'].includes(t.toLowerCase())) || 'this syllabus';

    if (mockTestScore && mockTestScore < 200) {
      return `Dude, a score of ${mockTestScore} is just a temporary glitch. The coaching mock tests are set ridiculously hard on purpose. Don't let that syllabus get in your head. Let's play a round of Zen Pop, reset, and we'll review the easy questions tomorrow. Pizza is on me! 🍕`;
    }

    if (mood === 'exhausted') {
      return `${name}, studying for ${studyHours} hours is insane! You're running on empty. Shut down the books, let's play Focus Stacker, and clear our brains. We're in this marathon together, don't burn out now.`;
    }

    return `Hey ${name}, physics backlog? Honestly, rotation mechanics is a beast. Don't sweat it too much, we'll break it down into micro-cheat sheets. Let's grab a virtual coffee and conquer it tomorrow. ☕`;
  };

  const triggerAction = (actionType: string) => {
    setInteractiveAction(actionType);
    setTimeout(() => {
      setInteractiveAction(null);
    }, 3000);
  };

  return (
    <div 
      className="glass-panel rounded-3xl p-6 flex flex-col justify-between h-full bg-gradient-to-tr from-secondary/5 via-primary/5 to-transparent border border-secondary/20 relative"
      aria-label="Parent and best friend virtual support box"
    >
      <div>
        {/* Header Tabs */}
        <div className="flex items-center justify-between mb-4 border-b border-card-border/40 pb-3">
          <h2 className="text-xs uppercase tracking-widest font-black text-secondary flex items-center gap-1.5">
            <Heart size={14} className="text-error animate-pulse" />
            Comfort Space
          </h2>

          <div className="flex gap-1 bg-white/5 p-0.5 rounded-xl border border-card-border" role="tablist">
            <button
              role="tab"
              aria-selected={activePersona === 'mom'}
              onClick={() => setActivePersona('mom')}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all focus:outline-none ${
                activePersona === 'mom' 
                  ? 'bg-error text-white shadow-sm' 
                  : 'text-text-muted hover:text-foreground'
              }`}
            >
              Mom's Hug 🥣
            </button>
            <button
              role="tab"
              aria-selected={activePersona === 'friend'}
              onClick={() => setActivePersona('friend')}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all focus:outline-none ${
                activePersona === 'friend' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-text-muted hover:text-foreground'
              }`}
            >
              Best Friend 🍕
            </button>
          </div>
        </div>

        {/* Message Bubble area */}
        <div className="min-h-[110px] flex items-center justify-center p-3 rounded-2xl bg-white/2 border border-card-border/30 relative">
          <AnimatePresence mode="wait">
            {activePersona === 'mom' ? (
              <motion.div
                key="mom"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="text-center"
              >
                <span className="text-3xl block mb-2" aria-hidden="true">🥣</span>
                <p className="text-xs font-semibold text-foreground italic leading-relaxed">
                  "{getMomMessage()}"
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="friend"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="text-center"
              >
                <span className="text-3xl block mb-2" aria-hidden="true">🍕</span>
                <p className="text-xs font-semibold text-foreground italic leading-relaxed">
                  "{getFriendMessage()}"
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Interactive Micro-Actions (Agentic Visual Feedback) */}
      <div className="mt-5 pt-3 border-t border-card-border/30 space-y-3">
        <span className="text-[10px] text-text-muted uppercase tracking-wider block font-bold text-center">
          Tap for immediate virtual comfort:
        </span>
        <div className="flex justify-around gap-2 flex-wrap">
          <button
            onClick={() => triggerAction('chai')}
            disabled={interactiveAction !== null}
            className="flex-1 min-w-[70px] flex flex-col items-center p-2 rounded-xl bg-white/5 border border-card-border hover:bg-white/10 text-[10px] font-bold text-text-muted hover:text-foreground focus:outline-none transition-all cursor-pointer"
          >
            <Coffee size={16} className="text-warning mb-1" />
            Ginger Chai ☕
          </button>
          
          <button
            onClick={() => triggerAction('hug')}
            disabled={interactiveAction !== null}
            className="flex-1 min-w-[70px] flex flex-col items-center p-2 rounded-xl bg-white/5 border border-card-border hover:bg-white/10 text-[10px] font-bold text-text-muted hover:text-foreground focus:outline-none transition-all cursor-pointer"
          >
            <Heart size={16} className="text-error mb-1 animate-pulse" />
            Warm Hug 🤗
          </button>
          
          <button
            onClick={() => triggerAction('vent')}
            disabled={interactiveAction !== null}
            className="flex-1 min-w-[70px] flex flex-col items-center p-2 rounded-xl bg-white/5 border border-card-border hover:bg-white/10 text-[10px] font-bold text-text-muted hover:text-foreground focus:outline-none transition-all cursor-pointer"
          >
            <MessageCircle size={16} className="text-primary mb-1" />
            High-Five 🖐️
          </button>

          <button
            onClick={() => triggerAction('blanket')}
            disabled={interactiveAction !== null}
            className="flex-1 min-w-[70px] flex flex-col items-center p-2 rounded-xl bg-white/5 border border-card-border hover:bg-white/10 text-[10px] font-bold text-text-muted hover:text-foreground focus:outline-none transition-all cursor-pointer"
          >
            <Sparkles size={16} className="text-accent mb-1" />
            Blanket 🧣
          </button>
        </div>
 
        {/* Action Animation Layer */}
        <AnimatePresence>
          {interactiveAction && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 bg-slate-950/95 rounded-3xl flex flex-col items-center justify-center p-6 z-20 text-center border border-secondary/35"
            >
              {interactiveAction === 'chai' && (
                <>
                  <motion.span 
                    animate={{ rotate: [0, 5, -5, 0], y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-4xl block mb-2"
                  >
                    ☕✨
                  </motion.span>
                  <span className="text-xs text-foreground font-bold block">Chai time!</span>
                  <span className="text-[10px] text-text-muted mt-1 max-w-xs leading-relaxed">
                    Sipping virtual ginger tea. Take 2 minutes away from the screen. Your brain is resetting.
                  </span>
                </>
              )}
 
              {interactiveAction === 'hug' && (
                <>
                  <motion.span 
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-4xl block mb-2"
                  >
                    🤗❤️
                  </motion.span>
                  <span className="text-xs text-foreground font-bold block">Warm Hug received.</span>
                  <span className="text-[10px] text-text-muted mt-1 max-w-xs leading-relaxed">
                    Mom says: "You are doing great. No exam rank defines how much you are worth. Take a deep breath."
                  </span>
                </>
              )}
 
              {interactiveAction === 'vent' && (
                <>
                  <motion.span 
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl block mb-2"
                  >
                    🖐️🔥
                  </motion.span>
                  <span className="text-xs text-foreground font-bold block">High Five!</span>
                  <span className="text-[10px] text-text-muted mt-1 max-w-xs leading-relaxed">
                    Best Friend says: "We're going to crack this GATE/JEE syllabus, trust me. Let's crush a round of Zen Pop and get back to it."
                  </span>
                </>
              )}

              {interactiveAction === 'blanket' && (
                <>
                  <motion.span 
                    animate={{ y: [0, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-4xl block mb-2"
                  >
                    🧣🧸
                  </motion.span>
                  <span className="text-xs text-foreground font-bold block">Cozy Blanket!</span>
                  <span className="text-[10px] text-text-muted mt-1 max-w-xs leading-relaxed">
                    Mom wrapped you in a warm, cozy fleece blanket. Close your eyes and let your mind drift for a few moments. You are safe and cared for.
                  </span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
