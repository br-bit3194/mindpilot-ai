'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStudentData } from '@/hooks/useStudentData';
import { StudentProfile, MentalDNA } from '@/lib/types';
import { BrainCircuit, Sparkles, HeartHandshake, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OnboardingPage() {
  const router = useRouter();
  const { onboardStudent } = useStudentData();
  
  const [step, setStep] = useState(1);
  const handleNext = () => setStep((s) => Math.min(3, s + 1));
  const handlePrev = () => setStep((s) => Math.max(1, s - 1));
  
  // 1. Exam Target
  const [examType, setExamType] = useState<'JEE' | 'NEET' | 'UPSC' | 'CAT' | 'GATE' | 'CUET'>('JEE');
  const [studentName, setStudentName] = useState('Pilot');

  // 2. Psychological Diagnostic Choices
  const [mockReaction, setMockReaction] = useState<string>('c');
  const [backlogReaction, setBacklogReaction] = useState<string>('a');
  const [familyDynamic, setFamilyDynamic] = useState<string>('b');

  // 3. Emotional State slider
  const [anxietySelf, setAnxietySelf] = useState(6);

  const examOptions = ['JEE', 'NEET', 'UPSC', 'CAT', 'GATE', 'CUET'];

  // Psychological Questions
  const mockOptions = [
    { value: 'a', label: 'I feel demotivated and avoid analyzing it. It feels like a verdict on my intelligence.' },
    { value: 'b', label: 'I feel frustrated but immediately review the concepts to find what went wrong.' },
    { value: 'c', label: 'I panic, worry about my parents\' reaction, and feel high pressure to cover it up.' }
  ];

  const backlogOptions = [
    { value: 'a', label: 'I study late into the night, sleeping under 5 hours to force-cover the topics.' },
    { value: 'b', label: 'I feel guilty and overwhelmed, which makes me avoid studying the subject entirely.' },
    { value: 'c', label: 'I break the backlog into 3 small daily blocks and switch to an easier subject to build momentum.' }
  ];

  const familyOptions = [
    { value: 'a', label: 'They compare my ranks to other peers/cousins, which makes me feel high performance dread.' },
    { value: 'b', label: 'They are supportive but ask me for details daily, which adds secondary pressure.' },
    { value: 'c', label: 'They support my breaks and tell me they are proud of me regardless of test scores.' }
  ];

  const getEmotionalLabel = (level: number) => {
    if (level <= 3) return { label: 'Calm / Focused', emoji: '😌', color: 'text-success' };
    if (level <= 6) return { label: 'Moderate Stress', emoji: '😐', color: 'text-primary' };
    if (level <= 8) return { label: 'Overloaded', emoji: '😰', color: 'text-warning' };
    return { label: 'Severe Panic', emoji: '😫', color: 'text-error' };
  };

  const emotion = getEmotionalLabel(anxietySelf);

  // Generate initial DNA based on psychological profiles
  const calculateMentalDNA = () => {
    // 1. Confidence Pattern
    let confidencePattern = 'Mock Test Dependent';
    if (mockReaction === 'b') confidencePattern = 'Consistency-Driven';
    if (mockReaction === 'c') confidencePattern = 'Volatile / Vulnerable';

    // 2. Recovery Style & Preferred Intervention
    let recoveryStyle = 'Action-Oriented';
    let preferredStyle: 'Action Plan' | 'Mindfulness & Grounding' | 'Empathetic Listening' | 'Re-framing' = 'Action Plan';
    if (backlogReaction === 'a') {
      recoveryStyle = 'Nervous System Rest';
      preferredStyle = 'Mindfulness & Grounding';
    } else if (backlogReaction === 'b') {
      recoveryStyle = 'Reflection-Needed';
      preferredStyle = 'Empathetic Listening';
    }

    // 3. Motivation Style
    let motivationType = 'Intrinsic Mastery';
    if (familyDynamic === 'a') motivationType = 'Extrinsic Pressure';
    if (familyDynamic === 'b') motivationType = 'Fear Avoidance';

    // 4. Burnout Susceptibility
    let burnoutSusceptibility: 'Low' | 'Medium' | 'High' = 'Medium';
    if (backlogReaction === 'a' && anxietySelf > 6) {
      burnoutSusceptibility = 'High';
    } else if (backlogReaction === 'c' && anxietySelf < 5) {
      burnoutSusceptibility = 'Low';
    }

    // 5. Resilience Score
    let emotionalResilience = 60;
    if (mockReaction === 'b') emotionalResilience += 15;
    if (backlogReaction === 'c') emotionalResilience += 10;
    if (familyDynamic === 'c') emotionalResilience += 10;
    if (anxietySelf > 7) emotionalResilience -= 15;
    if (backlogReaction === 'a') emotionalResilience -= 10;
    
    emotionalResilience = Math.max(30, Math.min(95, emotionalResilience));

    // 6. Stressors
    const stressors = ['General Exam Prep'];
    if (backlogReaction === 'a' || backlogReaction === 'b') stressors.push('Backlog Pressure');
    if (familyDynamic === 'a' || familyDynamic === 'b') stressors.push('Parent Expectations');
    if (mockReaction === 'a' || mockReaction === 'c') stressors.push('Mock Test Drops');
    
    // Clean and take top 3
    const finalStressors = stressors.length > 1 ? stressors.slice(1) : stressors;

    return {
      primaryStressors: finalStressors.map(s => s.charAt(0).toUpperCase() + s.slice(1)),
      confidencePattern,
      recoveryStyle,
      motivationType,
      burnoutSusceptibility,
      emotionalResilience,
      preferredInterventionStyle: preferredStyle
    };
  };

  const getDefaultsForExam = (exam: string) => {
    const today = new Date();
    const defaultDate = new Date(today.setMonth(today.getMonth() + 3)).toISOString().split('T')[0];
    switch (exam) {
      case 'JEE': return { score: '280', date: defaultDate, study: 11, sleep: 5.5, coaching: 'Offline Coaching' as const };
      case 'NEET': return { score: '680', date: defaultDate, study: 12, sleep: 5.5, coaching: 'Online Coaching' as const };
      case 'UPSC': return { score: '115', date: defaultDate, study: 10, sleep: 6.0, coaching: 'Self Study' as const };
      case 'CAT': return { score: '99.5%ile', date: defaultDate, study: 8, sleep: 6.5, coaching: 'Online Coaching' as const };
      case 'GATE': return { score: '750', date: defaultDate, study: 9, sleep: 6.0, coaching: 'Self Study' as const };
      default: return { score: '780', date: defaultDate, study: 7, sleep: 7.0, coaching: 'Online Coaching' as const };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const defaults = getDefaultsForExam(examType);
    const initialDNA = calculateMentalDNA();

    const profile: StudentProfile = {
      name: studentName.trim() || 'Pilot',
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
        primaryStressorSources: initialDNA.primaryStressors,
        anxietyLevelSelfAssessment: anxietySelf,
        supportSystemRating: familyDynamic === 'c' ? 8 : familyDynamic === 'b' ? 6 : 4
      },
      createdAt: new Date().toISOString()
    };

    onboardStudent(profile, initialDNA);
    router.push('/');
  };

  return (
    <div 
      className="flex-1 flex items-center justify-center max-w-xl mx-auto py-8 animate-in fade-in duration-300"
      role="main"
      aria-label="MindPilot AI Psychological Onboarding Page"
    >
      <div className="glass-panel rounded-3xl p-6 md:p-8 w-full flex flex-col justify-between relative shadow-2xl border border-card-border/80 min-h-[520px]">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/5 rounded-t-3xl overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
            role="progressbar"
            aria-valuenow={step}
            aria-valuemin={1}
            aria-valuemax={3}
            aria-label={`Step ${step} of 3`}
          />
        </div>

        <div className="pt-4">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white">
              <BrainCircuit size={18} />
            </div>
            <span className="text-xs uppercase font-extrabold text-primary tracking-widest">
              MindPilot AI / Diagnostic Profile
            </span>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-5"
              >
                <div className="text-center space-y-1">
                  <h2 className="text-lg font-black text-foreground">Select Target Examination</h2>
                  <p className="text-xs text-text-muted">Choose your high-stakes exam to load performance defaults.</p>
                </div>

                <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Select exam type">
                  {examOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setExamType(opt as any)}
                      className={`py-3 px-3 rounded-xl border text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                        examType === opt 
                          ? 'bg-primary/20 border-primary text-foreground' 
                          : 'bg-white/5 border-card-border text-text-muted hover:bg-white/10'
                      }`}
                      role="radio"
                      aria-checked={examType === opt}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
 
                {/* Student Name Input */}
                <div className="space-y-2 mt-6 text-left">
                  <label htmlFor="student-name-input" className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                    What is your name, Pilot?
                  </label>
                  <input
                    id="student-name-input"
                    type="text"
                    required
                    placeholder="e.g. Bhavesh, Rahul..."
                    value={studentName === 'Pilot' ? '' : studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full bg-black/20 border border-card-border text-xs rounded-xl px-3.5 py-2.5 focus:ring-1 focus:ring-primary focus:outline-none placeholder-text-muted/40 text-foreground"
                    aria-label="Student name input"
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-5"
              >
                <div className="text-center space-y-1">
                  <h2 className="text-lg font-black text-foreground">Psychological Assessment</h2>
                  <p className="text-xs text-text-muted">Answer honestly. MindPilot constructs your Copilot based on these patterns.</p>
                </div>

                {/* Q1: Mock test reaction */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                    1. When I score lower than expected on a mock test:
                  </label>
                  <div className="space-y-1.5" role="radiogroup">
                    {mockOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setMockReaction(opt.value)}
                        className={`w-full text-left p-3 rounded-xl border text-xs leading-relaxed transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                          mockReaction === opt.value
                            ? 'bg-secondary/15 border-secondary text-foreground font-semibold'
                            : 'bg-white/5 border-card-border text-text-muted hover:bg-white/10'
                        }`}
                        role="radio"
                        aria-checked={mockReaction === opt.value}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q2: Backlog reaction */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                    2. When backlog piles up or I get stuck on a topic (e.g. Physics):
                  </label>
                  <div className="space-y-1.5" role="radiogroup">
                    {backlogOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setBacklogReaction(opt.value)}
                        className={`w-full text-left p-3 rounded-xl border text-xs leading-relaxed transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                          backlogReaction === opt.value
                            ? 'bg-secondary/15 border-secondary text-foreground font-semibold'
                            : 'bg-white/5 border-card-border text-text-muted hover:bg-white/10'
                        }`}
                        role="radio"
                        aria-checked={backlogReaction === opt.value}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-5"
              >
                <div className="text-center space-y-1">
                  <h2 className="text-lg font-black text-foreground">Family Dynamic & Stress Scale</h2>
                  <p className="text-xs text-text-muted">Final inputs to finalize your Mental DNA parameters.</p>
                </div>

                {/* Q3: Family Support */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                    3. How does your family view your exam preparation?
                  </label>
                  <div className="space-y-1.5" role="radiogroup">
                    {familyOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFamilyDynamic(opt.value)}
                        className={`w-full text-left p-3 rounded-xl border text-xs leading-relaxed transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                          familyDynamic === opt.value
                            ? 'bg-secondary/15 border-secondary text-foreground font-semibold'
                            : 'bg-white/5 border-card-border text-text-muted hover:bg-white/10'
                        }`}
                        role="radio"
                        aria-checked={familyDynamic === opt.value}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Anxiety level */}
                <div className="bg-white/5 border border-card-border p-4 rounded-2xl">
                  <div className="flex justify-between items-center text-xs font-semibold mb-3">
                    <span className="text-text-muted uppercase tracking-wider font-bold">4. Current Stress Level?</span>
                    <span className={`font-bold flex items-center gap-1 ${emotion.color}`}>
                      <span className="text-lg" aria-hidden="true">{emotion.emoji}</span>
                      {emotion.label} ({anxietySelf}/10)
                    </span>
                  </div>
                  
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={anxietySelf}
                    onChange={(e) => setAnxietySelf(parseInt(e.target.value))}
                    className="w-full accent-primary bg-slate-800 h-1.5 rounded"
                    aria-label="Stress level assessment scale 1 to 10"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-card-border pt-4 mt-6">
          {step > 1 ? (
            <button
              onClick={handlePrev}
              className="flex items-center gap-1 bg-white/5 hover:bg-white/10 text-foreground font-bold px-4 py-2 rounded-xl border border-card-border transition-all focus:ring-2 focus:ring-primary outline-none"
              aria-label="Back to previous page"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          ) : (
            <span />
          )}

          {step < 3 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1 bg-primary text-white font-bold px-4 py-2 rounded-xl hover:opacity-90 transition-all focus:ring-2 focus:ring-primary outline-none"
              aria-label="Proceed to next page"
            >
              Continue
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-1.5 bg-gradient-to-r from-primary to-secondary text-white font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all focus:ring-2 focus:ring-primary outline-none cursor-pointer"
              aria-label="Complete psychological assessment and enter dashboard"
            >
              <HeartHandshake size={16} />
              Unlock Resilience Core
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
