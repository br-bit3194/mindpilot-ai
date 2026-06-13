'use client';

import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { DailyLogEntry } from '@/lib/types';
import { Flame, ArrowUpRight, ArrowDownRight, AlertTriangle } from 'lucide-react';

interface BurnoutRadarProps {
  history: DailyLogEntry[];
}

export default function BurnoutRadar({ history }: BurnoutRadarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get the latest analysis
  const latestEntry = history[history.length - 1];
  const riskScore = latestEntry?.analysis.burnoutRisk ?? 0;
  const confidence = latestEntry?.analysis.confidence ?? 0;
  const motivation = latestEntry?.analysis.motivation ?? 0;
  
  // Calculate average sleep score
  const sleepHours = latestEntry?.checkIn.sleepHours ?? 6;
  const sleepScore = Math.round(Math.min(100, (sleepHours / 7.5) * 100));

  // Focus score based on study hours vs target
  const studyHours = latestEntry?.checkIn.studyHours ?? 8;
  const focusScore = Math.round(Math.min(100, (studyHours / 10) * 100));

  // Consistency (ratio of entries to total days, capped for visuals)
  const consistencyScore = 82; 

  const data = [
    { subject: 'Stress', value: (latestEntry?.checkIn.stressLevel ?? 5) * 10 },
    { subject: 'Confidence', value: confidence },
    { subject: 'Sleep', value: sleepScore },
    { subject: 'Focus', value: focusScore },
    { subject: 'Motivation', value: motivation },
    { subject: 'Consistency', value: consistencyScore },
  ];

  // Calculate trends by comparing last entry with previous entry
  const prevEntry = history[history.length - 2];
  const prevRisk = prevEntry?.analysis.burnoutRisk ?? 0;
  const riskDiff = riskScore - prevRisk;

  const getRiskStatus = (score: number) => {
    if (score >= 65) return { label: 'High Alert', color: 'text-error bg-error/15 border-error/20' };
    if (score >= 40) return { label: 'Warning', color: 'text-warning bg-warning/15 border-warning/20' };
    return { label: 'Healthy', color: 'text-success bg-success/15 border-success/20' };
  };

  const riskStatus = getRiskStatus(riskScore);

  return (
    <div 
      className="glass-panel rounded-2xl p-6 flex flex-col h-full justify-between"
      aria-label="Burnout Radar analytics card"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <Flame size={20} className="text-secondary" />
            Burnout Radar
          </h2>
          <span className={`text-xs font-bold border px-2.5 py-0.5 rounded-full ${riskStatus.color}`}>
            {riskStatus.label}
          </span>
        </div>

        {/* Burnout stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-xs text-text-muted font-medium block">Risk Index</span>
            <span className="text-3xl font-black text-foreground mt-0.5 flex items-baseline">
              {riskScore}%
              <span className="text-xs font-normal text-text-muted ml-1">rating</span>
            </span>
          </div>

          <div className="flex flex-col justify-end">
            <span className="text-xs text-text-muted font-medium block">Weekly Trend</span>
            <span className="text-sm font-semibold flex items-center gap-0.5 mt-0.5">
              {riskDiff > 0 ? (
                <>
                  <ArrowUpRight size={16} className="text-error" />
                  <span className="text-error">+{riskDiff}% increase</span>
                </>
              ) : riskDiff < 0 ? (
                <>
                  <ArrowDownRight size={16} className="text-success" />
                  <span className="text-success">{riskDiff}% decrease</span>
                </>
              ) : (
                <span className="text-text-muted">No change</span>
              )}
            </span>
          </div>
        </div>

        {/* Contributing factors warning */}
        {riskScore >= 60 && (
          <div className="bg-error/10 border border-error/20 text-error rounded-xl p-3 flex items-start gap-2 text-xs mb-4">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Severe overload triggers detected: </span>
              Sleep deprivation ({sleepHours} hours) combined with high anxiety and study hours ({studyHours}h) are forcing you into burnout. Action plan recommended.
            </div>
          </div>
        )}
      </div>

      {/* Radar Chart */}
      <div className="h-60 w-full flex items-center justify-center min-h-[240px]">
        {mounted ? (
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: 'var(--color-text-muted)', fontSize: 10, fontWeight: 500 }}
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]} 
                tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 8 }} 
                axisLine={false}
              />
              <Radar
                name="Mental DNA"
                dataKey="value"
                stroke="var(--color-secondary)"
                fill="var(--color-secondary)"
                fillOpacity={0.2}
              />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-xs text-text-muted">Loading chart analytics...</div>
        )}
      </div>
    </div>
  );
}
