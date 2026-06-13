'use client';

import React, { useState, useEffect } from 'react';
import { useStudentData } from '@/hooks/useStudentData';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Compass, Sparkles, RefreshCw, AlertTriangle, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function SimulatorPage() {
  const { history, loading } = useStudentData();

  // Slider State (default to typical averages)
  const [sleep, setSleep] = useState(6);
  const [stress, setStress] = useState(6);
  const [consistency, setConsistency] = useState(75);
  const [confidence, setConfidence] = useState(50);
  const [mounted, setMounted] = useState(false);

  // Initialize sliders with user's latest actual data if available
  useEffect(() => {
    setMounted(true);
    if (history.length > 0) {
      const latest = history[history.length - 1];
      setSleep(latest.checkIn.sleepHours);
      setStress(latest.checkIn.stressLevel);
      setConfidence(latest.analysis.confidence);
    }
  }, [history]);

  // Generate projection coordinates
  const projectionData = React.useMemo(() => {
    const data = [];
    
    // Base starting score calculated from current sliders
    const currentBase = Math.round(
      (10 - stress) * 10 * 0.25 + 
      Math.min(100, (sleep / 7.5) * 100) * 0.20 + 
      confidence * 0.30 + 
      consistency * 0.25
    );

    // Week 0 (Current State)
    data.push({
      name: 'Now',
      'Current Path': currentBase,
      'Improved Path': currentBase,
      'Risk Path': currentBase,
    });

    // Week 1 to 4 projections
    for (let w = 1; w <= 4; w++) {
      // Current path changes slightly depending on parameters
      let currentSlope = (sleep >= 7 ? 2 : -1.5) + (stress <= 5 ? 1.5 : -2) + (consistency >= 80 ? 2.5 : -1);
      let currentVal = Math.round(currentBase + currentSlope * w);
      currentVal = Math.max(10, Math.min(98, currentVal));

      // Improved path assumes student reduces stress, improves sleep, and increases consistency
      let improvedVal = Math.round(currentBase + (4.5 + (8 - stress) * 0.5 + (sleep - 5) * 0.8) * w);
      improvedVal = Math.max(currentBase, Math.min(96, improvedVal));

      // Risk path assumes continued sleep deprivation, high stress, and drop in consistency/confidence
      let riskSlope = -5 - (stress * 0.6) - (7.5 - sleep) * 1.2;
      let riskVal = Math.round(currentBase + riskSlope * w);
      riskVal = Math.max(12, Math.min(currentBase, riskVal));

      data.push({
        name: `Week ${w}`,
        'Current Path': currentVal,
        'Improved Path': improvedVal,
        'Risk Path': riskVal,
      });
    }

    return data;
  }, [sleep, stress, consistency, confidence]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="animate-spin text-primary" size={32} />
          <p className="text-sm text-text-muted font-medium">Bootstrapping simulation matrix...</p>
        </div>
      </div>
    );
  }

  const latestProjectedFitness = projectionData[4]['Current Path'];

  return (
    <div className="space-y-6 animate-in fade-in duration-300" role="main" aria-label="Future Self Simulator Page">
      {/* Page Header */}
      <div className="bg-white/5 border border-card-border p-5 rounded-2xl">
        <h1 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2">
          <Compass size={24} className="text-accent" />
          Future Self Simulator
        </h1>
        <p className="text-xs text-text-muted mt-1 leading-relaxed">
          Model how adjustments in sleep, consistency, and stress triggers affect your Mental Fitness trajectory over a 4-week timeline.
        </p>
      </div>

      {/* Control panel and Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Sliders */}
        <div className="lg:col-span-1 glass-panel rounded-2xl p-6 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
            <Sparkles size={16} />
            Simulator Parameters
          </h2>

          <div className="space-y-5">
            {/* Sleep Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-2">
                <span className="text-text-muted">Sleep Target</span>
                <span className="text-primary font-bold">{sleep} Hours/Night</span>
              </div>
              <input 
                type="range" 
                min="4" 
                max="9" 
                step="0.5"
                value={sleep}
                onChange={(e) => setSleep(parseFloat(e.target.value))}
                className="w-full accent-primary bg-slate-800 h-1.5 rounded"
                aria-label="Target sleep hours slider"
              />
              <span className="text-[10px] text-text-muted mt-1 block">
                {sleep < 6 ? '⚠️ Deprives cognitive consolidation' : '✓ Promotes mental reset'}
              </span>
            </div>

            {/* Stress Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-2">
                <span className="text-text-muted">Stress Load</span>
                <span className="text-secondary font-bold">Level {stress}/10</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={stress}
                onChange={(e) => setStress(parseInt(e.target.value))}
                className="w-full accent-secondary bg-slate-800 h-1.5 rounded"
                aria-label="Stress level slider"
              />
              <span className="text-[10px] text-text-muted mt-1 block">
                {stress > 7 ? '⚠️ Triggers adrenaline overload' : '✓ Manageable operational load'}
              </span>
            </div>

            {/* Consistency Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-2">
                <span className="text-text-muted">Study Consistency</span>
                <span className="text-success font-bold">{consistency}% score</span>
              </div>
              <input 
                type="range" 
                min="30" 
                max="100" 
                value={consistency}
                onChange={(e) => setConsistency(parseInt(e.target.value))}
                className="w-full accent-success bg-slate-800 h-1.5 rounded"
                aria-label="Consistency tracker slider"
              />
              <span className="text-[10px] text-text-muted mt-1 block">
                {consistency < 60 ? '⚠️ Fragmented study rhythm' : '✓ Highly predictable performance'}
              </span>
            </div>

            {/* Confidence Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-2">
                <span className="text-text-muted">Concept Confidence</span>
                <span className="text-accent font-bold">{confidence}% index</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="100" 
                value={confidence}
                onChange={(e) => setConfidence(parseInt(e.target.value))}
                className="w-full accent-accent bg-slate-800 h-1.5 rounded"
                aria-label="Concept confidence slider"
              />
              <span className="text-[10px] text-text-muted mt-1 block">
                {confidence < 40 ? '⚠️ High risk of exam dread' : '✓ Strong concept confidence'}
              </span>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 text-xs text-text-muted space-y-2">
            <span className="font-bold text-foreground block">How the Simulator Works</span>
            <p className="leading-relaxed">
              MindPilot projects a rolling trajectory of your mental resilience profile by examining the mathematical relationship between study recovery and cognitive load.
            </p>
          </div>
        </div>

        {/* Right Column: Chart Trajectories */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
                4-Week Projected Trajectory
              </h2>
              <span className="text-xs bg-white/5 border border-card-border px-2 py-0.5 rounded text-text-muted">
                Weekly Resolution
              </span>
            </div>
            
            {/* Projected summary details */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white/5 border border-card-border rounded-xl p-3">
                <span className="text-[9px] text-text-muted uppercase tracking-wider block font-semibold">Projected Path</span>
                <span className="text-xl font-black text-foreground mt-0.5 block">
                  {latestProjectedFitness}%
                </span>
              </div>
              <div className="bg-success/5 border border-success/15 rounded-xl p-3">
                <span className="text-[9px] text-success uppercase tracking-wider block font-semibold">Improved Peak</span>
                <span className="text-xl font-black text-success mt-0.5 block">
                  {projectionData[4]['Improved Path']}%
                </span>
              </div>
              <div className="bg-error/5 border border-error/15 rounded-xl p-3">
                <span className="text-[9px] text-error uppercase tracking-wider block font-semibold">Risk Floor</span>
                <span className="text-xl font-black text-error mt-0.5 block">
                  {projectionData[4]['Risk Path']}%
                </span>
              </div>
            </div>
          </div>

          {/* Recharts Line Chart */}
          <div className="h-72 w-full flex items-center justify-center min-h-[280px]">
            {mounted ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={projectionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                    dataKey="Current Path" 
                    stroke="var(--color-primary)" 
                    strokeWidth={3} 
                    activeDot={{ r: 6 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Improved Path" 
                    stroke="var(--color-success)" 
                    strokeWidth={2} 
                    strokeDasharray="4 4" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Risk Path" 
                    stroke="var(--color-error)" 
                    strokeWidth={2} 
                    strokeDasharray="4 4" 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-text-muted">Generating simulator charts...</span>
            )}
          </div>

          {/* Warning Messages */}
          <div className="mt-6 pt-4 border-t border-card-border/40">
            {latestProjectedFitness < 50 ? (
              <div className="bg-error/10 border border-error/20 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-error">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Urgent Action Recommended: </span>
                  Your simulated trajectory bottoms out below 50%. The combination of poor sleep and high anxiety leads directly to physical exhaustion, backlogs, and mock test drop out. Consider shifting to the <Link href="/calm-room" className="underline font-bold hover:text-white">SOS Calm Room</Link> or executing the Action Plan.
                </div>
              </div>
            ) : (
              <div className="bg-success/10 border border-success/20 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-success">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Sustainable Pattern: </span>
                  Your simulated habits are projected to keep your fitness levels stable. Continue maintaining a minimum of 6.5 hours of sleep and limiting peak study bursts to under 12 hours.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
