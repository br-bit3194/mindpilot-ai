'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Compass, Eye, Heart, Volume2, VolumeX, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

type BreathingPhase = 'inhale' | 'hold-in' | 'exhale' | 'hold-out';

export default function CalmRoomPage() {
  // Breathing Trainer States
  const [breathingActive, setBreathingActive] = useState(false);
  const [phase, setPhase] = useState<BreathingPhase>('inhale');
  const [secondsRemaining, setSecondsRemaining] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  // Grounding states
  const [groundingStep, setGroundingStep] = useState(0);
  const [groundingInputs, setGroundingInputs] = useState<string[]>(['', '', '', '', '']);

  // Ambient sound state (simulated)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [ambientTheme, setAmbientTheme] = useState<'Ocean Waves' | 'Rainfall' | 'Binaural Beats'>('Ocean Waves');

  // Box breathing phase text
  const phaseDetails = {
    'inhale': { text: 'Inhale deeply...', scale: 1.15, color: 'bg-primary border-primary shadow-[0_0_40px_rgba(99,102,241,0.5)]' },
    'hold-in': { text: 'Hold your breath...', scale: 1.15, color: 'bg-secondary border-secondary shadow-[0_0_40px_rgba(168,85,247,0.5)]' },
    'exhale': { text: 'Exhale slowly...', scale: 0.9, color: 'bg-accent border-accent shadow-[0_0_40px_rgba(6,182,212,0.5)]' },
    'hold-out': { text: 'Pause and rest...', scale: 0.9, color: 'bg-slate-700 border-slate-600 shadow-[0_0_20px_rgba(255,255,255,0.15)]' }
  };

  // Timer loop for box breathing (4-4-4-4 cycle)
  useEffect(() => {
    if (!breathingActive) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev === 1) {
          // Move to next phase
          setPhase((currentPhase) => {
            switch (currentPhase) {
              case 'inhale': return 'hold-in';
              case 'hold-in': return 'exhale';
              case 'exhale': return 'hold-out';
              case 'hold-out':
                setCyclesCompleted(c => c + 1);
                return 'inhale';
              default: return 'inhale';
            }
          });
          return 4; // Reset to 4 seconds
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [breathingActive]);

  const groundingStages = [
    { number: 5, prompt: "What are 5 things you can SEE around you?", placeholder: "e.g. A water bottle, textbook, wall lamp...", color: 'border-primary' },
    { number: 4, prompt: "What are 4 things you can TOUCH/FEEL?", placeholder: "e.g. Laptop keys, study desk wood, cotton shirt...", color: 'border-secondary' },
    { number: 3, prompt: "What are 3 things you can HEAR?", placeholder: "e.g. Fan whirring, distant traffic, clock ticking...", color: 'border-accent' },
    { number: 2, prompt: "What are 2 things you can SMELL?", placeholder: "e.g. Coffee aroma, paper pages, fresh laundry...", color: 'border-success' },
    { number: 1, prompt: "What is 1 thing you can TASTE?", placeholder: "e.g. Mint candy, drinking water, toothpaste...", color: 'border-warning' }
  ];

  const handleGroundingInput = (idx: number, val: string) => {
    const updated = [...groundingInputs];
    updated[idx] = val;
    setGroundingInputs(updated);
  };

  const resetBreathing = () => {
    setBreathingActive(false);
    setPhase('inhale');
    setSecondsRemaining(4);
    setCyclesCompleted(0);
  };

  return (
    <div 
      className="flex-1 flex flex-col justify-center items-center py-6 space-y-8 max-w-3xl mx-auto text-center animate-in fade-in duration-500"
      role="main"
      aria-label="SOS Calm Room distraction free workspace"
    >
      {/* Calm Header */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-error uppercase tracking-widest bg-error/10 border border-error/20 px-3 py-1 rounded-full flex items-center justify-center gap-1.5 w-fit mx-auto">
          <ShieldAlert size={14} className="animate-pulse" />
          SOS Calm Room Active
        </span>
        <h1 className="text-2xl md:text-3xl font-black text-foreground">
          Take a Resiliency Break
        </h1>
        <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed">
          Slowing down your breathing and grounding your physical senses shuts down panic loops and blocks exam stress build-ups.
        </p>
      </div>

      {/* Two columns: Breathing Guide & Grounding Exercises */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Box Breathing */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-between min-h-[360px]">
          <div className="w-full flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Heart size={16} />
              Box Breathing Guide
            </h2>
            {breathingActive && (
              <span className="text-[10px] text-success font-bold bg-success/10 border border-success/20 px-2 py-0.5 rounded">
                Cycles: {cyclesCompleted}
              </span>
            )}
          </div>

          {/* Breathing Circle Container */}
          <div className="flex-1 flex items-center justify-center min-h-[200px]">
            <div className="relative flex items-center justify-center">
              {/* Outer Pulse */}
              <AnimatePresence>
                {breathingActive && (
                  <motion.div
                    className="absolute rounded-full border border-white/5 bg-white/2 shrink-0"
                    style={{
                      width: '180px',
                      height: '180px',
                    }}
                    animate={{
                      scale: phaseDetails[phase].scale * 1.15,
                    }}
                    transition={{ duration: 4, ease: 'easeInOut' }}
                  />
                )}
              </AnimatePresence>

              {/* Main Breathing Circle */}
              <motion.div
                className={`w-32 h-32 rounded-full border-2 flex flex-col items-center justify-center text-white select-none transition-colors duration-1000 ${
                  breathingActive ? phaseDetails[phase].color : 'bg-slate-800 border-slate-700'
                }`}
                animate={{
                  scale: breathingActive ? phaseDetails[phase].scale : 1,
                }}
                transition={{ duration: 4, ease: 'easeInOut' }}
              >
                {breathingActive ? (
                  <>
                    <span className="text-2xl font-black">{secondsRemaining}</span>
                    <span className="text-[9px] uppercase tracking-wider font-semibold opacity-70 mt-1">Secs</span>
                  </>
                ) : (
                  <Heart size={32} className="text-primary animate-pulse" />
                )}
              </motion.div>
            </div>
          </div>

          <div className="space-y-4 w-full">
            <p className="text-xs text-foreground font-semibold h-4">
              {breathingActive ? phaseDetails[phase].text : 'Ready to start breathing exercises?'}
            </p>

            <div className="flex gap-2 justify-center">
              {breathingActive ? (
                <button
                  onClick={resetBreathing}
                  className="bg-slate-800 hover:bg-slate-700 text-text-muted hover:text-foreground text-xs font-bold px-4 py-2 rounded-xl border border-card-border focus:ring-2 focus:ring-primary outline-none"
                >
                  Stop
                </button>
              ) : (
                <button
                  onClick={() => setBreathingActive(true)}
                  className="bg-primary hover:opacity-90 text-white text-xs font-bold px-6 py-2 rounded-xl shadow shadow-primary/20 focus:ring-2 focus:ring-primary outline-none"
                >
                  Start Box Breathing (4s)
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 5-4-3-2-1 Grounding Technique */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between min-h-[360px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
              <Compass size={16} />
              5-4-3-2-1 Grounding
            </h2>
            <span className="text-[10px] text-text-muted font-bold">
              Step {groundingStep + 1} of 5
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center py-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={groundingStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-center gap-2">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-black ${groundingStages[groundingStep].color}`}>
                    {groundingStages[groundingStep].number}
                  </div>
                </div>
                
                <h3 className="text-sm font-bold text-foreground">
                  {groundingStages[groundingStep].prompt}
                </h3>

                <input
                  type="text"
                  placeholder={groundingStages[groundingStep].placeholder}
                  value={groundingInputs[groundingStep]}
                  onChange={(e) => handleGroundingInput(groundingStep, e.target.value)}
                  className="w-full bg-black/20 border border-card-border text-xs rounded-xl px-3.5 py-2.5 focus:ring-1 focus:ring-primary focus:outline-none"
                  aria-label={`Grounding step input for ${groundingStages[groundingStep].prompt}`}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center border-t border-card-border/30 pt-4">
            <button
              onClick={() => setGroundingStep((prev) => Math.max(0, prev - 1))}
              disabled={groundingStep === 0}
              className="text-xs text-text-muted hover:text-foreground disabled:opacity-40 focus:outline-none"
            >
              Previous
            </button>

            {groundingStep < 4 ? (
              <button
                onClick={() => setGroundingStep((prev) => Math.min(4, prev + 1))}
                className="bg-white/5 border border-card-border text-text-muted hover:text-foreground text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 focus:ring-1 focus:ring-primary outline-none"
              >
                Next Step
                <ArrowRight size={12} />
              </button>
            ) : (
              <button
                onClick={() => {
                  alert("Grounding completed successfully. Take a deep breath! You are present. You are safe.");
                  setGroundingStep(0);
                  setGroundingInputs(['', '', '', '', '']);
                }}
                className="bg-success/15 border border-success/30 text-success text-xs font-bold px-4 py-1.5 rounded-lg flex items-center gap-1 focus:ring-2 focus:ring-success outline-none"
              >
                Complete
                <Check size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Audio Ambient and Navigation back */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/5 border border-card-border p-4 rounded-xl">
        {/* Ambient audio simulation */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAudioPlaying(!isAudioPlaying)}
            className={`p-2 rounded-lg border ${
              isAudioPlaying 
                ? 'bg-success/15 border-success/30 text-success' 
                : 'bg-white/5 border-card-border text-text-muted hover:text-foreground'
            } focus:outline-none`}
            title="Play calming background sounds"
            aria-label="Play calming background sounds"
          >
            {isAudioPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          
          <div className="text-left text-xs">
            <span className="text-text-muted block font-semibold">Ambient Sound</span>
            <select
              value={ambientTheme}
              onChange={(e) => setAmbientTheme(e.target.value as any)}
              className="bg-transparent text-foreground font-bold border-none focus:outline-none p-0 cursor-pointer"
              aria-label="Select ambient audio theme"
            >
              <option value="Ocean Waves" className="bg-slate-900">Ocean Waves (Simulation)</option>
              <option value="Rainfall" className="bg-slate-900">Rainfall (Simulation)</option>
              <option value="Binaural Beats" className="bg-slate-900">Binaural Beats (Simulation)</option>
            </select>
          </div>
        </div>

        <Link
          href="/"
          className="bg-slate-800 hover:bg-slate-700 text-foreground font-bold text-xs px-5 py-2.5 rounded-xl border border-card-border focus:ring-2 focus:ring-primary outline-none"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
