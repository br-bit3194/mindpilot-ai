'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, BookOpen, Gamepad2, Play, Flame, X, ArrowRight, ArrowLeft, Check } from 'lucide-react';

export default function GuidedTour() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const showTour = localStorage.getItem('mindpilot-show-tour');
    if (showTour === 'true') {
      setActive(true);
    }
  }, []);

  const handleClose = () => {
    setActive(false);
    localStorage.removeItem('mindpilot-show-tour');
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  if (!active) return null;

  const tourSteps = [
    {
      title: "Welcome to MindPilot AI! 🌿",
      desc: "Your personal mental resilience co-pilot tailored for competitive exam prep. We are here to help you study smart, manage stress, and protect your mental health.",
      icon: Brain,
      color: "text-primary"
    },
    {
      title: "Resilience Dashboard 📊",
      desc: "This is your cockpit. Complete daily check-ins here to calculate your Daily Fitness Score, track your Burnout Risk index, and review customized student-counselor action plans.",
      icon: BookOpen,
      color: "text-secondary"
    },
    {
      title: "AI Resilience Companion 🧸",
      desc: "Your empathetic venting partner. Chat here whenever backlog pressures build up, parents are pushing hard, or you feel panic mock scores drop. Switch between friend or coaching vibes.",
      icon: Sparkles,
      color: "text-amber-500"
    },
    {
      title: "Relaxation Room & Games 🎮",
      desc: "To decompress your threat-sensing amygdala, play low-stress micro-games like Zen Bubble Popper or webcam filter camera games. BUT watch out: games can be addictive!",
      icon: Gamepad2,
      color: "text-red-500"
    },
    {
      title: "Focus Co-pilot & Play Credits ⏳",
      desc: "To keep a balanced routine, games lock during studies. Complete 30-minute Pomodoro study cycles using the floating Focus Widget (bottom-right) to earn break play time credits!",
      icon: Flame,
      color: "text-orange-500"
    }
  ];

  const CurrentIcon = tourSteps[step - 1].icon;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -15 }}
          transition={{ duration: 0.3 }}
          className="glass-panel w-full max-w-md bg-slate-900/95 border border-card-border p-6 rounded-3xl shadow-2xl relative text-center text-white"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/10 transition-all"
            aria-label="Skip Tutorial"
          >
            <X size={16} />
          </button>

          {/* Tour Step Indicator */}
          <span className="text-[10px] text-primary uppercase font-bold tracking-widest block mb-4">
            Platform Tour: Step {step} of 5
          </span>

          {/* Illustrated Icon */}
          <div className="w-16 h-16 rounded-full bg-white/5 border border-card-border flex items-center justify-center mx-auto mb-5 shadow-inner">
            <CurrentIcon size={30} className={tourSteps[step - 1].color} />
          </div>

          {/* Title & Description */}
          <h2 className="text-lg font-black text-white leading-snug mb-2">
            {tourSteps[step - 1].title}
          </h2>
          <p className="text-xs text-text-muted leading-relaxed max-w-sm mx-auto mb-6">
            {tourSteps[step - 1].desc}
          </p>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t border-card-border/40 pt-4">
            {step > 1 ? (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 text-xs text-text-muted hover:text-white font-bold py-2 px-3.5 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
              >
                <ArrowLeft size={14} />
                Back
              </button>
            ) : (
              <span />
            )}

            {/* Pagination Dots */}
            <div className="flex gap-1.5 justify-center">
              {[1, 2, 3, 4, 5].map(i => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-4 bg-primary' : 'w-1.5 bg-white/20'}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-1 bg-primary hover:bg-primary/95 text-white font-bold text-xs py-2 px-4 rounded-xl shadow shadow-primary/10 cursor-pointer"
            >
              {step === 5 ? (
                <>
                  Get Started
                  <Check size={14} />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
