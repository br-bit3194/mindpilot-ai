'use client';
 
import React, { useState, useEffect } from 'react';
import { useStudentData } from '@/hooks/useStudentData';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { Compass, Sparkles, RefreshCw, AlertTriangle, ArrowUpRight, CheckCircle2, ShieldAlert, BookOpen, Brain, Zap } from 'lucide-react';
import Link from 'next/link';
 
export default function SimulatorPage() {
  const { history, loading } = useStudentData();
 
  // Slider & Button States
  const [scheduledHours, setScheduledHours] = useState(10);
  const [sleep, setSleep] = useState(6.5);
  const [stress, setStress] = useState(6);
  const [reviewStyle, setReviewStyle] = useState<'none' | 'skim' | 'deep'>('skim');
  const [mounted, setMounted] = useState(false);
 
  // Initialize sliders with user's latest actual data if available
  useEffect(() => {
    setMounted(true);
    if (history.length > 0) {
      const latest = history[history.length - 1];
      setSleep(latest.checkIn.sleepHours);
      setStress(latest.checkIn.stressLevel);
      setScheduledHours(latest.checkIn.studyHours);
    }
  }, [history]);
 
  // Core ROI calculations
  const roiMetrics = React.useMemo(() => {
    let base = 100;
 
    // Sleep penalty
    let sleepPenalty = 0;
    if (sleep >= 7.5) sleepPenalty = 0;
    else if (sleep >= 6.5) sleepPenalty = -15;
    else if (sleep >= 5.5) sleepPenalty = -35;
    else sleepPenalty = -55; // severe sleep debt
 
    // Stress penalty
    let stressPenalty = 0;
    if (stress <= 3) stressPenalty = 0;
    else if (stress <= 6) stressPenalty = -10;
    else if (stress <= 8) stressPenalty = -25;
    else stressPenalty = -45; // extreme cortisol overload
 
    // Review bonus/penalty
    let reviewAdjustment = 0;
    if (reviewStyle === 'none') reviewAdjustment = -15;
    else if (reviewStyle === 'skim') reviewAdjustment = 0;
    else reviewAdjustment = 10;
 
    const retention = Math.max(15, Math.min(98, base + sleepPenalty + stressPenalty + reviewAdjustment));
    
    // Effective hours
    const effectiveHours = (scheduledHours * retention) / 100;
    const wastedHours = scheduledHours - effectiveHours;
 
    // Weekly marks loss simulation (silly errors due to sleep debt + unresolved concepts)
    const sleepDebt = Math.max(0, 7.5 - sleep);
    const weeklyMarksWasted = Math.round(
      (wastedHours * 1.5) + 
      (sleepDebt * 8) + 
      (reviewStyle === 'none' ? 18 : reviewStyle === 'skim' ? 6 : 0)
    );
 
    return {
      retention,
      effectiveHours,
      wastedHours,
      weeklyMarksWasted
    };
  }, [scheduledHours, sleep, stress, reviewStyle]);
 
  // Scenario comparisons for the chart
  const comparisonData = React.useMemo(() => {
    // 1. Burnout Path (Cramming)
    const burnoutRetention = 35; // Sleep 5 hrs, Stress 9, No review
    const burnoutScheduled = 14;
    const burnoutEffective = (burnoutScheduled * burnoutRetention) / 100;
 
    // 2. Current Path (From Sliders)
    const currentScheduled = scheduledHours;
    const currentEffective = roiMetrics.effectiveHours;
 
    // 3. Calibrated Path (Optimal balance)
    const optimalRetention = 95; // Sleep 8 hrs, Stress 2, Deep review
    const optimalScheduled = 8.5;
    const optimalEffective = (optimalScheduled * optimalRetention) / 100;
 
    return [
      {
        name: 'Burnout (Cramming)',
        'Scheduled Hours': burnoutScheduled,
        'Effective Hours (ROI)': Math.round(burnoutEffective * 10) / 10,
        color: '#ef4444'
      },
      {
        name: 'Your Current Model',
        'Scheduled Hours': currentScheduled,
        'Effective Hours (ROI)': Math.round(currentEffective * 10) / 10,
        color: '#6366f1'
      },
      {
        name: 'Resilient (Calibrated)',
        'Scheduled Hours': optimalScheduled,
        'Effective Hours (ROI)': Math.round(optimalEffective * 10) / 10,
        color: '#10b981'
      }
    ];
  }, [scheduledHours, roiMetrics]);
 
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="animate-spin text-primary" size={32} />
          <p className="text-sm text-text-muted font-medium">Bootstrapping cognitive simulation...</p>
        </div>
      </div>
    );
  }
 
  return (
    <div className="space-y-6 animate-in fade-in duration-300" role="main" aria-label="Study ROI Calculator Page">
      {/* Page Header */}
      <div className="bg-white/5 border border-card-border p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2">
            <Compass size={24} className="text-accent" />
            Study ROI & Efficiency Loss Calculator
          </h1>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            Discover your true study efficiency. High scheduled hours mean nothing if sleep debt and stress trigger severe cognitive decay.
          </p>
        </div>
        <Link
          href="/"
          className="bg-slate-800 hover:bg-slate-700 text-foreground font-bold text-xs px-4 py-2 rounded-xl border border-card-border transition-all focus:ring-2 focus:ring-primary outline-none"
        >
          Return to Dashboard
        </Link>
      </div>
 
      {/* Sliders and Visual Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Sliders */}
        <div className="lg:col-span-1 glass-panel rounded-2xl p-6 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-accent flex items-center gap-2">
            <Sparkles size={16} />
            Input Study Profile
          </h2>
 
          <div className="space-y-5">
            {/* Scheduled Hours Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-2">
                <span className="text-text-muted">Scheduled Daily Study</span>
                <span className="text-primary font-bold">{scheduledHours} Hours</span>
              </div>
              <input 
                type="range" 
                min="4" 
                max="16" 
                step="0.5"
                value={scheduledHours}
                onChange={(e) => setScheduledHours(parseFloat(e.target.value))}
                className="w-full accent-primary bg-slate-800 h-1.5 rounded"
                aria-label="Daily scheduled study hours slider"
              />
              <span className="text-[10px] text-text-muted mt-1 block">
                Total hours you sit at your study desk.
              </span>
            </div>
 
            {/* Sleep Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-2">
                <span className="text-text-muted">Sleep Duration</span>
                <span className="text-secondary font-bold">{sleep} Hours/Night</span>
              </div>
              <input 
                type="range" 
                min="4" 
                max="9" 
                step="0.5"
                value={sleep}
                onChange={(e) => setSleep(parseFloat(e.target.value))}
                className="w-full accent-secondary bg-slate-800 h-1.5 rounded"
                aria-label="Sleep hours slider"
              />
              <span className="text-[10px] text-text-muted mt-1 block">
                {sleep < 6 ? '⚠️ Severe sleep debt triggers brain fog' : '✓ Consolidates memory and formulas'}
              </span>
            </div>
 
            {/* Stress Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-2">
                <span className="text-text-muted">Anxiety & Stress Load</span>
                <span className="text-error font-bold">Level {stress}/10</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={stress}
                onChange={(e) => setStress(parseInt(e.target.value))}
                className="w-full accent-error bg-slate-800 h-1.5 rounded"
                aria-label="Stress level slider"
              />
              <span className="text-[10px] text-text-muted mt-1 block">
                {stress > 7 ? '⚠️ Cortisol block prevents retrieval' : '✓ Manageable, focused energy'}
              </span>
            </div>
 
            {/* Mock Test Review Style */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-muted block">Mock Test Review Method</label>
              <div className="grid grid-cols-3 gap-2" role="group">
                {(['none', 'skim', 'deep'] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => setReviewStyle(style)}
                    className={`py-2 px-2 border rounded-xl text-[10px] font-bold uppercase transition-all cursor-pointer ${
                      reviewStyle === style
                        ? 'bg-accent/25 border-accent text-foreground'
                        : 'bg-white/5 border-card-border text-text-muted hover:bg-white/10'
                    }`}
                  >
                    {style === 'none' ? 'No Review' : style === 'skim' ? 'Skim Errors' : 'Deep Analysis'}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-text-muted block">
                {reviewStyle === 'none' ? '⚠️ High risk of repeating mistakes' : reviewStyle === 'skim' ? 'Corrects obvious errors' : '✓ Recovers concept marks'}
              </span>
            </div>
          </div>
        </div>
 
        {/* Right Column: Visual Charts & Metrics */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">
              Your Cognitive ROI Analysis
            </h2>
            
            {/* Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/5 border border-card-border rounded-xl p-3.5 text-center">
                <span className="text-[9px] text-text-muted uppercase tracking-wider block font-bold">Retention rate</span>
                <span className={`text-xl font-black mt-1 block ${
                  roiMetrics.retention < 50 ? 'text-error animate-pulse' : roiMetrics.retention < 75 ? 'text-warning' : 'text-success'
                }`}>
                  {roiMetrics.retention}%
                </span>
                <span className="text-[9px] text-text-muted mt-0.5 block">Brain absorption index</span>
              </div>
 
              <div className="bg-white/5 border border-card-border rounded-xl p-3.5 text-center">
                <span className="text-[9px] text-text-muted uppercase tracking-wider block font-bold">Effective study</span>
                <span className="text-xl font-black text-success mt-1 block">
                  {Math.round(roiMetrics.effectiveHours * 10) / 10} Hrs
                </span>
                <span className="text-[9px] text-text-muted mt-0.5 block">Actual study ROI</span>
              </div>
 
              <div className="bg-white/5 border border-card-border rounded-xl p-3.5 text-center">
                <span className="text-[9px] text-text-muted uppercase tracking-wider block font-bold">Wasted energy</span>
                <span className="text-xl font-black text-error mt-1 block">
                  {Math.round(roiMetrics.wastedHours * 10) / 10} Hrs
                </span>
                <span className="text-[9px] text-text-muted mt-0.5 block">Wasted in brain fog</span>
              </div>
 
              <div className="bg-white/5 border border-card-border rounded-xl p-3.5 text-center">
                <span className="text-[9px] text-text-muted uppercase tracking-wider block font-bold">Weekly Marks Lost</span>
                <span className="text-xl font-black text-warning mt-1 block">
                  -{roiMetrics.weeklyMarksWasted} Marks
                </span>
                <span className="text-[9px] text-text-muted mt-0.5 block">Due to silly errors</span>
              </div>
            </div>
 
            {/* Bar Chart comparing paths */}
            <div className="h-72 w-full flex items-center justify-center min-h-[280px] mt-4">
              {mounted ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} />
                    <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '12px' }}
                      labelStyle={{ color: 'var(--color-text-muted)' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Bar dataKey="Scheduled Hours" fill="#475569" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Effective Hours (ROI)" fill="#6366f1" radius={[4, 4, 0, 0]}>
                      {comparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <span className="text-xs text-text-muted">Loading study comparisons...</span>
              )}
            </div>
          </div>
 
          {/* Explanation Banner */}
          <div className="mt-6 pt-4 border-t border-card-border/40">
            {roiMetrics.retention < 60 ? (
              <div className="bg-error/10 border border-error/20 rounded-2xl p-4 flex items-start gap-3 text-xs text-error leading-relaxed">
                <ShieldAlert size={20} className="shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <span className="font-extrabold uppercase tracking-wide block mb-1">Severe Study Leakage Detected</span>
                  You scheduled <strong className="text-foreground">{scheduledHours} hours</strong> but your brain only captures <strong className="text-foreground">{Math.round(roiMetrics.effectiveHours * 10) / 10} hours</strong>. The remaining time is wasted due to sleep debt and panic. 
                  <span className="block mt-1 font-bold text-foreground">Action: Increase sleep to 7.5+ hours and decompress in the Calm Room. Less hours at the desk will yield MORE effective absorption.</span>
                </div>
              </div>
            ) : (
              <div className="bg-success/10 border border-success/20 rounded-2xl p-4 flex items-start gap-3 text-xs text-success leading-relaxed">
                <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold uppercase tracking-wide block mb-1">Healthy Focus Ratio</span>
                  Your study profile is highly calibrated! You scheduled <strong className="text-foreground">{scheduledHours} hours</strong> and are absorbing <strong className="text-foreground">{Math.round(roiMetrics.effectiveHours * 10) / 10} hours</strong> of information. Your retention is excellent. Keep maintaining sleep and regular mock concept review.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
