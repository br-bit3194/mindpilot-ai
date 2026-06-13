'use client';

import React, { useState, useEffect } from 'react';
import { useStudentData } from '@/hooks/useStudentData';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Calendar, Award, TrendingUp, Sparkles, RefreshCw, ChevronRight, Activity, Moon, Zap } from 'lucide-react';
import Link from 'next/link';

export default function ReplayPage() {
  const { history, loading, resetToDemoMode } = useStudentData();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="animate-spin text-primary" size={32} />
          <p className="text-sm text-text-muted font-medium">Reconstructing emotional timeline...</p>
        </div>
      </div>
    );
  }

  // Handle empty state gracefully
  if (history.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh] max-w-md mx-auto text-center">
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <Calendar size={48} className="text-primary mx-auto animate-pulse" />
          <h2 className="text-lg font-bold text-foreground">No History Found</h2>
          <p className="text-xs text-text-muted">
            You must complete a daily check-in to see weekly trends. Alternatively, you can seed demo data instantly to explore this feature.
          </p>
          <div className="flex justify-center gap-2">
            <button
              onClick={resetToDemoMode}
              className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              Seed Demo Student Data
            </button>
            <Link href="/" className="bg-slate-800 text-text-muted border border-card-border text-xs px-4 py-2 rounded-xl">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Generate charts data
  const chartData = history.map((entry) => {
    // Format date string from YYYY-MM-DD to "Mon, 12th" or similar
    const d = new Date(entry.checkIn.date);
    const label = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
    return {
      name: label,
      Confidence: entry.analysis.confidence,
      'Burnout Risk': entry.analysis.burnoutRisk,
      Stress: entry.checkIn.stressLevel * 10
    };
  });

  // Calculate metrics
  const latestEntry = history[history.length - 1];
  const avgConfidence = Math.round(history.reduce((acc, h) => acc + h.analysis.confidence, 0) / history.length);
  const avgBurnout = Math.round(history.reduce((acc, h) => acc + h.analysis.burnoutRisk, 0) / history.length);
  const totalStudyHours = history.reduce((acc, h) => acc + h.checkIn.studyHours, 0);

  const keyWins = [
    "Used Box Breathing to successfully manage Physics textbook panic loops.",
    "Drafted a structured update boundary for parent check-ins.",
    "Maintained an average consistency index of 82% across high stress levels.",
    "Avoided comparison discussions on online student forum trackers."
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300" role="main" aria-label="Weekly Emotional Replay Page">
      {/* Page Header */}
      <div className="bg-white/5 border border-card-border p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2">
            <Award size={24} className="text-secondary" />
            Weekly Emotional Replay
          </h1>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            Trace your emotional and cognitive metrics over the past 7 daily logs. Celebrate resilience wins and diagnose failure modes.
          </p>
        </div>
        <Link
          href="/"
          className="bg-slate-800 hover:bg-slate-700 text-foreground font-bold text-xs px-4 py-2 rounded-xl border border-card-border transition-all focus:ring-2 focus:ring-primary outline-none"
        >
          Return to Dashboard
        </Link>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl text-xs">
          <span className="text-text-muted block font-semibold">Weekly Stressor</span>
          <span className="text-foreground font-bold text-base block mt-1">
            {latestEntry?.analysis.stressTriggers[0] || 'Physics textbook'}
          </span>
          <span className="text-[10px] text-text-muted block mt-1">Highest impact node</span>
        </div>

        <div className="glass-panel p-4 rounded-xl text-xs">
          <span className="text-text-muted block font-semibold">Average Confidence</span>
          <span className="text-foreground font-bold text-base block mt-1">{avgConfidence}%</span>
          <span className="text-[10px] text-primary block mt-1">Mock test dependent</span>
        </div>

        <div className="glass-panel p-4 rounded-xl text-xs">
          <span className="text-text-muted block font-semibold">Average Burnout Risk</span>
          <span className="text-foreground font-bold text-base block mt-1">{avgBurnout}%</span>
          <span className="text-[10px] text-error block mt-1">High workload fatigue</span>
        </div>

        <div className="glass-panel p-4 rounded-xl text-xs">
          <span className="text-text-muted block font-semibold">Recovery Speed</span>
          <span className="text-success font-bold text-base block mt-1">Moderate</span>
          <span className="text-[10px] text-text-muted block mt-1">Est. 24h reset cycle</span>
        </div>
      </div>

      {/* Trends Graph */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Confidence & Burnout Trend Line
          </h2>
          <span className="text-[10px] text-text-muted">7-Day Log Span</span>
        </div>

        <div className="h-72 w-full flex items-center justify-center min-h-[280px]">
          {mounted ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '12px' }}
                  labelStyle={{ color: 'var(--color-text-muted)' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Line 
                  type="monotone" 
                  dataKey="Confidence" 
                  stroke="var(--color-primary)" 
                  strokeWidth={3} 
                />
                <Line 
                  type="monotone" 
                  dataKey="Burnout Risk" 
                  stroke="var(--color-secondary)" 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="Stress" 
                  stroke="var(--color-error)" 
                  strokeWidth={1.5}
                  strokeDasharray="3 3" 
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <span className="text-xs text-text-muted">Generating trend metrics...</span>
          )}
        </div>
      </div>

      {/* Grid: Timeline & Wins */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Log */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">
            Daily Emotional Timeline
          </h2>

          <div className="space-y-4" role="list" aria-label="Daily Check-in logs timeline">
            {history.map((entry, idx) => {
              const d = new Date(entry.checkIn.date);
              const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
              
              const getMoodEmoji = (m: string) => {
                switch (m) {
                  case 'excellent': return '😊';
                  case 'good': return '🙂';
                  case 'anxious': return '😰';
                  case 'exhausted': return '😫';
                  default: return '😐';
                }
              };

              return (
                <div key={idx} className="flex gap-4 items-start" role="listitem">
                  {/* Timeline bullet line indicator */}
                  <div className="flex flex-col items-center shrink-0">
                    <span className="text-xl" aria-hidden="true">{getMoodEmoji(entry.checkIn.mood)}</span>
                    {idx < history.length - 1 && (
                      <span className="w-[1.5px] h-12 bg-card-border mt-1.5" />
                    )}
                  </div>

                  <div className="flex-1 bg-white/5 border border-card-border rounded-xl p-3.5 text-xs">
                    <div className="flex justify-between items-center flex-wrap gap-2 mb-1.5">
                      <span className="font-bold text-foreground">{dateLabel}</span>
                      <div className="flex gap-3 text-[10px] text-text-muted">
                        <span>Study: <strong className="text-foreground">{entry.checkIn.studyHours}h</strong></span>
                        <span>Sleep: <strong className="text-foreground">{entry.checkIn.sleepHours}h</strong></span>
                        <span>Stress: <strong className="text-secondary">{entry.checkIn.stressLevel}/10</strong></span>
                      </div>
                    </div>
                    <p className="text-text-muted leading-relaxed italic">
                      "{entry.checkIn.journalEntry.substring(0, 160)}{entry.checkIn.journalEntry.length > 160 ? '...' : ''}"
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {entry.analysis.stressTriggers.map((t, tIdx) => (
                        <span key={tIdx} className="bg-white/5 px-2 py-0.5 rounded-[4px] text-[9px] border border-card-border font-medium text-foreground">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Wins */}
        <div className="lg:col-span-1 glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5 mb-4">
              <Sparkles size={16} />
              Weekly Resilience Wins
            </h2>
            <p className="text-xs text-text-muted mb-4 leading-relaxed">
              Resilience is built by celebrating progress. These behavioral triumphs indicate positive adaptation of your Mental DNA.
            </p>

            <div className="space-y-3">
              {keyWins.map((win, idx) => (
                <div key={idx} className="flex gap-3 items-start p-3 bg-success/5 border border-success/10 rounded-xl text-xs text-text-muted leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-success/15 border border-success/30 flex items-center justify-center text-success shrink-0 font-bold" aria-hidden="true">
                    ✓
                  </span>
                  <p>{win}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/40 border border-card-border rounded-xl p-3.5 text-xs text-text-muted mt-6">
            <span className="font-bold text-foreground block mb-1">Consistency metrics</span>
            <span>Total study hours logged this cycle: <strong>{totalStudyHours} hours</strong>. Excellent dedication! Keep maintaining sleep bounds.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
