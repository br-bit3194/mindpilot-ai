'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStudentData } from '@/hooks/useStudentData';
import { StudentProfile } from '@/lib/types';
import { BrainCircuit, Sparkles, HeartHandshake, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OnboardingPage() {
  const router = useRouter();
  const { onboardStudent } = useStudentData();
  
  // Condense to only 3 intuitive inputs
  const [examType, setExamType] = useState<'JEE' | 'NEET' | 'UPSC' | 'CAT' | 'GATE' | 'CUET'>('JEE');
  const [stressors, setStressors] = useState<string[]>(['backlog', 'poor mock scores']);
  const [stressLevel, setStressLevel] = useState(6);

  const examOptions = ['JEE', 'NEET', 'UPSC', 'CAT', 'GATE', 'CUET'];
  const stressorOptions = [
    { value: 'backlog', label: 'Syllabus Backlog' },
    { value: 'poor mock scores', label: 'Mock Test Score Drops' },
    { value: 'parent expectations', label: 'Parent Expectations' },
    { value: 'comparison with peers', label: 'Peer Comparisons' },
    { value: 'fear of failure', label: 'Fear of Exam Day Failure' },
    { value: 'uncertainty', label: 'Preparation Uncertainty' },
  ];

  const handleStressorToggle = (value: string) => {
    setStressors(prev => 
      prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
    );
  };

  // Dynamically assign default profiles based on target exam
  const getDefaultsForExam = (exam: string) => {
    const today = new Date();
    // Default exam dates ~3 months out
    const defaultDate = new Date(today.setMonth(today.getMonth() + 3)).toISOString().split('T')[0];

    switch (exam) {
      case 'JEE':
        return { score: '280', date: defaultDate, study: 11, sleep: 5.5, coaching: 'Offline Coaching' as const };
      case 'NEET':
        return { score: '680', date: defaultDate, study: 12, sleep: 5.5, coaching: 'Online Coaching' as const };
      case 'UPSC':
        return { score: '115', date: defaultDate, study: 10, sleep: 6.0, coaching: 'Self Study' as const };
      case 'CAT':
        return { score: '99.5%ile', date: defaultDate, study: 8, sleep: 6.5, coaching: 'Online Coaching' as const };
      case 'GATE':
        return { score: '750', date: defaultDate, study: 9, sleep: 6.0, coaching: 'Self Study' as const };
      default: // CUET
        return { score: '780', date: defaultDate, study: 7, sleep: 7.0, coaching: 'Online Coaching' as const };
    }
  };

  const getEmotionalLabel = (level: number) => {
    if (level <= 3) return { label: 'Calm / Focused', emoji: '😌', color: 'text-success' };
    if (level <= 6) return { label: 'Moderate Stress', emoji: '😐', color: 'text-primary' };
    if (level <= 8) return { label: 'Overloaded', emoji: '😰', color: 'text-warning' };
    return { label: 'Severe Panic', emoji: '😫', color: 'text-error' };
  };

  const emotion = getEmotionalLabel(stressLevel);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const defaults = getDefaultsForExam(examType);

    const profile: StudentProfile = {
      academic: {
        examType,
        targetScore: defaults.score,
        examDate: defaults.date,
        studyHoursPerDay: defaults.study
      },
      lifestyle: {
        sleepHours: defaults.sleep,
        exerciseHabits: 'Occasional',
        coachingStatus: defaults.coaching
      },
      assessment: {
        primaryStressorSources: stressors.length > 0 ? stressors : ['fear of failure'],
        anxietyLevelSelfAssessment: stressLevel,
        supportSystemRating: 6
      },
      createdAt: new Date().toISOString()
    };

    onboardStudent(profile);
    router.push('/');
  };

  return (
    <div 
      className="flex-1 flex items-center justify-center max-w-lg mx-auto py-8 animate-in fade-in duration-300"
      role="main"
      aria-label="MindPilot AI Quick Student Onboarding Page"
    >
      <div className="glass-panel rounded-3xl p-6 md:p-8 w-full flex flex-col justify-between relative shadow-2xl border border-card-border/80">
        
        {/* Top Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white mx-auto shadow-lg shadow-primary/20">
            <BrainCircuit size={20} />
          </div>
          <h1 className="text-xl md:text-2xl font-black text-foreground">
            Unlock Your Mental DNA
          </h1>
          <p className="text-xs text-text-muted max-w-sm mx-auto leading-relaxed">
            MindPilot customizes your resilience dashboard based on three quick inputs. No long forms.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Exam Type Selection */}
          <div>
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2.5">
              1. Which exam are you preparing for?
            </label>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Select exam type">
              {examOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setExamType(opt as any)}
                  className={`py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                    examType === opt 
                      ? 'bg-primary/20 border-primary text-foreground scale-[1.03] shadow-md shadow-primary/15' 
                      : 'bg-white/5 border-card-border text-text-muted hover:bg-white/10'
                  }`}
                  role="radio"
                  aria-checked={examType === opt}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Stressors Checklist */}
          <div>
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2.5">
              2. What is causing the most pressure?
            </label>
            <div className="grid grid-cols-2 gap-2" role="group" aria-label="Stressor selectors">
              {stressorOptions.map((opt) => {
                const isChecked = stressors.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleStressorToggle(opt.value)}
                    className={`flex items-center text-left p-3 rounded-xl border text-xs transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                      isChecked 
                        ? 'bg-secondary/15 border-secondary text-foreground font-semibold scale-[1.01]' 
                        : 'bg-white/5 border-card-border text-text-muted hover:bg-white/10'
                    }`}
                    aria-pressed={isChecked}
                  >
                    <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center mr-2.5 ${isChecked ? 'bg-secondary border-secondary text-white' : 'border-card-border'}`} aria-hidden="true">
                      {isChecked && '✓'}
                    </span>
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Perceived Stress level dial */}
          <div className="bg-white/5 border border-card-border p-4 rounded-2xl">
            <div className="flex justify-between items-center text-xs font-semibold mb-3">
              <span className="text-text-muted uppercase tracking-wider font-bold">3. Current Stress Level?</span>
              <span className={`font-bold flex items-center gap-1 ${emotion.color}`}>
                <span className="text-lg" aria-hidden="true">{emotion.emoji}</span>
                {emotion.label} ({stressLevel}/10)
              </span>
            </div>
            
            <input
              type="range"
              min="1"
              max="10"
              value={stressLevel}
              onChange={(e) => setStressLevel(parseInt(e.target.value))}
              className="w-full accent-primary bg-slate-800 h-1.5 rounded"
              aria-label="Stress level assessment scale 1 to 10"
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3.5 rounded-2xl hover:opacity-90 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-primary outline-none mt-2 cursor-pointer"
            aria-label="Generate Mental DNA Profile and Enter Dashboard"
          >
            <HeartHandshake size={18} />
            Initialize Resilience Co-Pilot
          </button>
        </form>
      </div>
    </div>
  );
}
