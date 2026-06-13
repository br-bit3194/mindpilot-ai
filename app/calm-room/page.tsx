'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Compass, Eye, Heart, Volume2, VolumeX, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

class AmbientSynthesizer {
  private ctx: AudioContext | null = null;
  private binauralOscLeft: OscillatorNode | null = null;
  private binauralOscRight: OscillatorNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private chimeInterval: any = null;

  start(theme: 'Ocean Waves' | 'Rainfall' | 'Binaural Beats') {
    this.stop();
    
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    try {
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.25; // soft master volume
      this.masterGain.connect(this.ctx.destination);

      if (theme === 'Binaural Beats') {
        this.playBinauralBeats();
      } else if (theme === 'Ocean Waves') {
        this.playOceanWaves();
      } else if (theme === 'Rainfall') {
        this.playRainfall();
      }

      // Start background chimes on top of any theme
      this.startChimes();
    } catch (e) {
      console.error("Audio Context failed to start: ", e);
    }
  }

  private playBinauralBeats() {
    if (!this.ctx || !this.masterGain) return;
    
    // Left ear oscillator
    const oscLeft = this.ctx.createOscillator();
    oscLeft.type = 'sine';
    oscLeft.frequency.value = 150; // 150Hz base hum

    // Right ear oscillator
    const oscRight = this.ctx.createOscillator();
    oscRight.type = 'sine';
    oscRight.frequency.value = 156; // 6Hz difference (Theta frequency for anxiety reduction)

    const gainLeft = this.ctx.createGain();
    const gainRight = this.ctx.createGain();
    gainLeft.gain.value = 0.45;
    gainRight.gain.value = 0.45;

    const merger = this.ctx.createChannelMerger(2);
    oscLeft.connect(gainLeft).connect(merger, 0, 0);
    oscRight.connect(gainRight).connect(merger, 0, 1);

    // Also create a low frequency filter to make the hum warmer
    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 180;

    merger.connect(lowpass).connect(this.masterGain);

    oscLeft.start();
    oscRight.start();

    this.binauralOscLeft = oscLeft;
    this.binauralOscRight = oscRight;
  }

  private playOceanWaves() {
    if (!this.ctx || !this.masterGain) return;

    // Generate White Noise Buffer
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    // Apply Lowpass filter to shape waves
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 320; // base frequency
    filter.Q.value = 1.0;

    // Modulate cutoff frequency using LFO (Low Frequency Oscillator) to simulate waves swelling
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.07; // ~14 seconds per wave cycle

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 220; // modulation depth (320Hz +- 220Hz)

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    // Modulate gain slightly with same LFO so swell is louder
    const ampMod = this.ctx.createGain();
    ampMod.gain.value = 0.45;

    const ampLfoGain = this.ctx.createGain();
    ampLfoGain.gain.value = 0.2;
    lfo.connect(ampLfoGain);
    ampLfoGain.connect(ampMod.gain);

    noise.connect(filter).connect(ampMod).connect(this.masterGain);
    
    lfo.start();
    noise.start();

    this.noiseSource = noise;
    this.noiseFilter = filter;
    this.lfo = lfo;
    this.lfoGain = lfoGain;
  }

  private playRainfall() {
    if (!this.ctx || !this.masterGain) return;

    // Generate Noise Buffer
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    // Shorter high pass for raindrops
    const highpass = this.ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 450;

    // Soft low pass to filter out harsh crackles
    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 1300;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.3;

    noise.connect(highpass).connect(lowpass).connect(gain).connect(this.masterGain);
    noise.start();

    this.noiseSource = noise;
  }

  private startChimes() {
    if (!this.ctx) return;
    
    const playSingleChime = () => {
      if (!this.ctx || this.ctx.state === 'closed') return;

      // Pentatonic chime notes (C4, E4, G4, A4, C5, D5, E5)
      const frequencies = [261.63, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
      const freq = frequencies[Math.floor(Math.random() * frequencies.length)];

      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const oscOvertone = this.ctx.createOscillator();
      oscOvertone.type = 'triangle';
      oscOvertone.frequency.value = freq * 1.5; // perfect fifth overtone for bell richness

      const gain = this.ctx.createGain();
      const gainOvertone = this.ctx.createGain();
      
      const now = this.ctx.currentTime;

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.1); // soft attack
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.0); // long decay

      gainOvertone.gain.setValueAtTime(0, now);
      gainOvertone.gain.linearRampToValueAtTime(0.01, now + 0.05);
      gainOvertone.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
      if (panner) {
        panner.pan.value = Math.random() * 1.6 - 0.8; // pan randomly left/right
        osc.connect(gain).connect(panner);
        oscOvertone.connect(gainOvertone).connect(panner);
        panner.connect(this.ctx.destination);
      } else {
        osc.connect(gain).connect(this.ctx.destination);
        oscOvertone.connect(gainOvertone).connect(this.ctx.destination);
      }

      osc.start(now);
      osc.stop(now + 5.2);
      oscOvertone.start(now);
      oscOvertone.stop(now + 2.2);
    };

    // Play one chime immediately
    playSingleChime();

    // Trigger chimes periodically every 8 to 15 seconds
    this.chimeInterval = setInterval(() => {
      playSingleChime();
    }, 8000 + Math.random() * 7000);
  }

  stop() {
    if (this.chimeInterval) {
      clearInterval(this.chimeInterval);
      this.chimeInterval = null;
    }

    if (this.binauralOscLeft) {
      try { this.binauralOscLeft.stop(); } catch (e) {}
      this.binauralOscLeft.disconnect();
      this.binauralOscLeft = null;
    }
    if (this.binauralOscRight) {
      try { this.binauralOscRight.stop(); } catch (e) {}
      this.binauralOscRight.disconnect();
      this.binauralOscRight = null;
    }
    if (this.noiseSource) {
      try { this.noiseSource.stop(); } catch (e) {}
      this.noiseSource.disconnect();
      this.noiseSource = null;
    }
    if (this.noiseFilter) {
      this.noiseFilter.disconnect();
      this.noiseFilter = null;
    }
    if (this.lfo) {
      try { this.lfo.stop(); } catch (e) {}
      this.lfo.disconnect();
      this.lfo = null;
    }
    if (this.lfoGain) {
      this.lfoGain.disconnect();
      this.lfoGain = null;
    }
    if (this.masterGain) {
      this.masterGain.disconnect();
      this.masterGain = null;
    }
    if (this.ctx && this.ctx.state !== 'closed') {
      this.ctx.close();
      this.ctx = null;
    }
  }
 
  playPunchSound() {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    try {
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;
      
      // Low-frequency thud
      const oscThud = ctx.createOscillator();
      oscThud.type = 'sine';
      oscThud.frequency.setValueAtTime(130, now);
      oscThud.frequency.exponentialRampToValueAtTime(35, now + 0.12);
      
      const gainThud = ctx.createGain();
      gainThud.gain.setValueAtTime(0.5, now);
      gainThud.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      
      oscThud.connect(gainThud).connect(ctx.destination);
      oscThud.start(now);
      oscThud.stop(now + 0.18);
 
      // Short slap crack noise
      const bufferSize = ctx.sampleRate * 0.08;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 650;
      filter.Q.value = 2.5;
 
      const gainNoise = ctx.createGain();
      gainNoise.gain.setValueAtTime(0.15, now);
      gainNoise.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
 
      noise.connect(filter).connect(gainNoise).connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.08);
    } catch (e) {
      console.error(e);
    }
  }
}

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

  const synthRef = useRef<AmbientSynthesizer | null>(null);

  useEffect(() => {
    synthRef.current = new AmbientSynthesizer();
    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (synthRef.current) {
      if (isAudioPlaying) {
        synthRef.current.start(ambientTheme);
      } else {
        synthRef.current.stop();
      }
    }
  }, [isAudioPlaying, ambientTheme]);
 
  // Calm Mode Switcher
  const [calmMode, setCalmMode] = useState<'mindful' | 'anger'>('mindful');
  
  // Anger Cushion States
  const [angerTension, setAngerTension] = useState(100);
  const [punchesLanded, setPunchesLanded] = useState(0);
  const [floatingTexts, setFloatingTexts] = useState<{ id: number; text: string; x: number; y: number }[]>([]);
  const [angerSuccess, setAngerSuccess] = useState(false);
 
  const handlePunch = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (angerSuccess) return;
 
    // Play synthesized thud/slap
    if (synthRef.current) {
      synthRef.current.playPunchSound();
    }
 
    // Spawn floating hit words
    const hitWords = ['BAM!', 'POW!', 'SMASH!', 'RELEASE!', 'LET IT OUT!', 'CRACK!', 'OOMPH!', 'ARRGH!'];
    const randomWord = hitWords[Math.floor(Math.random() * hitWords.length)];
    
    // Get mouse offset relative to button boundary
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newId = Date.now() + Math.random();
    setFloatingTexts((prev) => [...prev, { id: newId, text: randomWord, x, y }]);
    
    // Remove floating text after 1s
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((t) => t.id !== newId));
    }, 1000);
 
    const newTension = Math.max(0, angerTension - 5);
    setAngerTension(newTension);
    setPunchesLanded((p) => p + 1);
 
    if (newTension === 0) {
      setAngerSuccess(true);
      // Reward +10 XP in local storage
      try {
        const currentXPStr = localStorage.getItem('mindpilot-xp') || '0';
        const newXP = parseInt(currentXPStr) + 10;
        localStorage.setItem('mindpilot-xp', String(newXP));
      } catch (err) {
        console.error(err);
      }
    }
  };
 
  const handleResetAnger = () => {
    setAngerTension(100);
    setPunchesLanded(0);
    setFloatingTexts([]);
    setAngerSuccess(false);
  };

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
 
      {/* Calm Mode Selector Tabs */}
      <div className="flex bg-white/5 p-1 rounded-2xl border border-card-border max-w-sm w-full mx-auto" role="tablist">
        <button
          role="tab"
          aria-selected={calmMode === 'mindful'}
          onClick={() => setCalmMode('mindful')}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition-all focus:outline-none cursor-pointer ${
            calmMode === 'mindful' 
              ? 'bg-primary text-white shadow' 
              : 'text-text-muted hover:text-foreground'
          }`}
        >
          Mindfulness Reset 🧘
        </button>
        <button
          role="tab"
          aria-selected={calmMode === 'anger'}
          onClick={() => setCalmMode('anger')}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition-all focus:outline-none cursor-pointer ${
            calmMode === 'anger' 
              ? 'bg-error text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
              : 'text-text-muted hover:text-foreground hover:bg-white/5'
          }`}
        >
          Anger Release 🥊
        </button>
      </div>
 
      {/* Dynamic Content: Mindfulness (Breathing/Grounding) vs Anger Release */}
      {calmMode === 'mindful' ? (
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
      ) : (
        /* Anger Release Cushion Workspace */
        <div className="glass-panel rounded-3xl p-6 md:p-8 w-full max-w-md mx-auto flex flex-col items-center justify-between min-h-[420px] animate-in fade-in duration-300 relative overflow-hidden border border-error/20 bg-gradient-to-tr from-error/[0.03] to-transparent">
          {/* Floating Impact text words overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <AnimatePresence>
              {floatingTexts.map((txt) => (
                <motion.span
                  key={txt.id}
                  initial={{ opacity: 1, scale: 0.8, y: txt.y, x: txt.x }}
                  animate={{ opacity: 0, scale: 1.4, y: txt.y - 120, x: txt.x + (Math.random() * 40 - 20) }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="absolute text-sm font-black text-error drop-shadow-[0_0_8px_rgba(239,68,68,0.6)] uppercase"
                >
                  {txt.text}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
 
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-error flex items-center gap-1.5">
                <ShieldAlert size={16} />
                Anger Release Cushion
              </h2>
              <span className="text-[10px] text-text-muted font-bold">
                Punches: {punchesLanded}
              </span>
            </div>
 
            <p className="text-xs text-text-muted mb-6">
              When study pressure or parent expectations make you want to hit something, vent it here. Tap/click the cushion rapidly to release physical tension.
            </p>
 
            {/* Anger Tension bar */}
            <div className="space-y-1 mb-6">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-error uppercase tracking-wider">Anger Tension Level</span>
                <span className="text-foreground">{angerTension}%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-card-border">
                <div 
                  className="h-full bg-gradient-to-r from-error to-warning transition-all duration-300 rounded-full" 
                  style={{ width: `${angerTension}%` }}
                />
              </div>
            </div>
          </div>
 
          {/* Interactive Cushion */}
          <div className="my-4 relative flex items-center justify-center min-h-[160px]">
            <AnimatePresence mode="wait">
              {angerSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-4"
                >
                  <motion.span 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-6xl block"
                  >
                    😌✨
                  </motion.span>
                  <div className="space-y-1">
                    <span className="text-sm text-success font-black block">Tension Released!</span>
                    <span className="text-[10px] text-text-muted block max-w-xs leading-relaxed">
                      Now take a slow, deep breath. You are back in control of your focus. +10 XP has been added to your resilience core.
                    </span>
                  </div>
                  <button
                    onClick={handleResetAnger}
                    className="bg-white/5 border border-card-border hover:bg-white/10 text-foreground text-xs font-bold px-4 py-2 rounded-xl focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
                  >
                    Vent Again
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  key="cushion"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.88, rotate: Math.random() * 6 - 3 }}
                  onClick={handlePunch}
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-error to-red-800 border-4 border-error/50 flex flex-col items-center justify-center text-white font-black shadow-[0_10px_35px_rgba(239,68,68,0.4)] hover:shadow-[0_12px_45px_rgba(239,68,68,0.6)] focus:outline-none transition-shadow relative cursor-pointer"
                  aria-label="Punch cushion to release anger"
                >
                  <span className="text-4xl">🥊</span>
                  <span className="text-[8px] uppercase tracking-widest font-black opacity-80 mt-1">HIT ME</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
 
          <div className="w-full border-t border-card-border/30 pt-4 mt-6 text-[10px] text-text-muted leading-relaxed">
            *This is a physical tension release tool. Tapping activates low-frequency synthesized impact sound waves designed to simulate haptic release.*
          </div>
        </div>
      )}
 
      {/* Audio Ambient and Navigation back */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/5 border border-card-border p-4 rounded-xl">
        {/* Ambient audio synthesis */}
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
              <option value="Ocean Waves" className="bg-slate-900">Ocean Waves (Live Synthesized) 🌊</option>
              <option value="Rainfall" className="bg-slate-900">Rainfall (Live Synthesized) 🌧️</option>
              <option value="Binaural Beats" className="bg-slate-900">Binaural Focus Beats (Theta Waves) 🧠</option>
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
