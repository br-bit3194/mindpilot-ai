'use client';

import React from 'react';
import { DailyLogEntry } from '@/lib/types';
import { Activity, ShieldCheck, TrendingUp, TrendingDown } from 'lucide-react';

interface FitnessScoreProps {
  history: DailyLogEntry[];
}

export default function FitnessScore({ history }: FitnessScoreProps) {
  const latestEntry = history[history.length - 1];
  const prevEntry = history[history.length - 2];

  const calculateScore = (entry: DailyLogEntry | undefined) => {
    if (!entry) return 50;
    const stress = entry.checkIn.stressLevel; // 1 to 10
    const sleep = entry.checkIn.sleepHours; // hours
    const confidence = entry.analysis.confidence; // 0 to 100
    const motivation = entry.analysis.motivation; // 0 to 100
    
    // Weight calculations
    const stressWeight = (10 - stress) * 10 * 0.25; // 25% max
    const sleepWeight = Math.min(100, (sleep / 7.5) * 100) * 0.20; // 20% max
    const confidenceWeight = confidence * 0.30; // 30% max
    const motivationWeight = motivation * 0.25; // 25% max
    
    return Math.round(stressWeight + sleepWeight + confidenceWeight + motivationWeight);
  };

  const currentScore = calculateScore(latestEntry);
  const prevScore = calculateScore(prevEntry);
  const diff = currentScore - prevScore;

  // SVG parameters
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  const getScoreStatus = (score: number) => {
    if (score >= 75) return { label: 'Optimal Focus', color: 'stroke-success text-success bg-success/10' };
    if (score >= 50) return { label: 'Moderate Stress', color: 'stroke-warning text-warning bg-warning/10' };
    return { label: 'High Overload', color: 'stroke-error text-error bg-error/10' };
  };

  const status = getScoreStatus(currentScore);

  return (
    <div 
      className="glass-panel rounded-2xl p-6 flex items-center justify-between h-full"
      aria-label="Mental fitness indicator score"
    >
      <div className="flex-1">
        <span className="text-xs text-text-muted font-bold uppercase tracking-wider block mb-1">
          Mental Fitness Score
        </span>
        <h2 className="text-2xl font-black text-foreground flex items-center gap-1.5 leading-none mb-2">
          <Activity size={20} className={currentScore >= 50 ? (currentScore >= 75 ? 'text-success' : 'text-warning') : 'text-error'} />
          {currentScore}%
        </h2>
        <span className="text-xs text-text-muted font-medium">
          Status: <strong className="text-foreground">{status.label}</strong>
        </span>
        
        {/* Trend Indicator */}
        <div className="mt-3 flex items-center gap-1">
          {diff > 0 ? (
            <>
              <span className="text-success bg-success/15 p-0.5 rounded-full"><TrendingUp size={12} /></span>
              <span className="text-[10px] text-success font-medium">+{diff}% vs last check-in</span>
            </>
          ) : diff < 0 ? (
            <>
              <span className="text-error bg-error/15 p-0.5 rounded-full"><TrendingDown size={12} /></span>
              <span className="text-[10px] text-error font-medium">{diff}% vs last check-in</span>
            </>
          ) : (
            <span className="text-[10px] text-text-muted">Stable vs last check-in</span>
          )}
        </div>
      </div>

      {/* Radial Ring Gauge */}
      <div className="relative flex items-center justify-center shrink-0 w-28 h-28" aria-hidden="true">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            className="stroke-white/5"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius + stroke}
            cy={radius + stroke}
          />
          <circle
            className={`${status.color} transition-all duration-1000 ease-out`}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            r={normalizedRadius}
            cx={radius + stroke}
            cy={radius + stroke}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-xs font-black text-foreground">{currentScore}%</span>
          <span className="text-[8px] uppercase font-bold text-text-muted tracking-wider">Fit</span>
        </div>
      </div>
    </div>
  );
}
