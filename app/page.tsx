'use client';

import React from 'react';
import { useStudentData } from '@/hooks/useStudentData';
import FitnessScore from '@/components/dashboard/FitnessScore';
import TodayInsight from '@/components/dashboard/TodayInsight';
import StressConstellation from '@/components/dashboard/StressConstellation';
import BurnoutRadar from '@/components/dashboard/BurnoutRadar';
import MentalDNA from '@/components/dashboard/MentalDNA';
import ActionPlan from '@/components/dashboard/ActionPlan';
import DailyCheckInForm from '@/components/dashboard/DailyCheckInForm';
import MomBestFriend from '@/components/dashboard/MomBestFriend';
import StartupFeatures from '@/components/dashboard/StartupFeatures';
import { getInterventionForStudent } from '@/lib/mockData';
import { Activity, Sparkles, MessageSquare, Compass, ShieldAlert, Award, RefreshCw, AlertCircle, Gamepad2, Smile, Brain } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const {
    profile,
    mentalDNA,
    history,
    completedActions,
    loading,
    addCheckIn,
    toggleActionCompletion,
    resetToDemoMode,
  } = useStudentData();

  if (loading || !profile || !mentalDNA) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="animate-spin text-primary" size={32} />
          <p className="text-sm text-text-muted">Loading MindPilot DNA...</p>
        </div>
      </div>
    );
  }

  const latestEntry = history[history.length - 1];
  const burnoutRisk = latestEntry?.analysis.burnoutRisk ?? 68;

  const intervention = getInterventionForStudent(
    burnoutRisk,
    latestEntry?.analysis.stressTriggers ?? ['Physics', 'Parent Expectations'],
    latestEntry?.analysis.confidence ?? 35
  );

  // Calculate days remaining to exam date
  const examDate = new Date(profile.academic.examDate);
  const diffTime = examDate.getTime() - Date.now();
  const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Core configuration based on burnout risk
  const getCoreConfig = (risk: number) => {
    if (risk >= 65) {
      return {
        color: 'from-error to-secondary shadow-[0_0_35px_rgba(239,68,68,0.4)] border-error/25',
        glowColor: 'bg-error animate-pulse',
        status: 'Core Overload',
        statusColor: 'text-error bg-error/10 border-error/20',
        message: `Pilot, high workloads and backlog dread have pushed your mental core into critical overload. Let's hit the brakes. Try popping some stress bubbles in the Relax Room, or run a 4-minute box breathing block.`
      };
    }
    if (risk >= 40) {
      return {
        color: 'from-warning to-primary shadow-[0_0_35px_rgba(245,158,11,0.3)] border-warning/25',
        glowColor: 'bg-warning',
        status: 'Core Watch',
        statusColor: 'text-warning bg-warning/10 border-warning/20',
        message: `Pilot, mock score drops and backlog pressure are draining focus energy. Keep today's sessions under 9 hours, take screen-free resets, and avoid peer comparisons.`
      };
    }
    return {
      color: 'from-primary to-accent shadow-[0_0_35px_rgba(99,102,241,0.3)] border-primary/25',
      glowColor: 'bg-success',
      status: 'Stable Core',
      statusColor: 'text-success bg-success/10 border-success/20',
      message: `Pilot, your focus rhythm is highly resilient. Your targets are perfectly balanced. Maintain your structured block rotations and write down today's victory logs!`
    };
  };

  const core = getCoreConfig(burnoutRisk);

  return (
    <div className="space-y-6 animate-in fade-in duration-300" role="main">
      {/* Spectacular Centerpiece: Resilience Core Orb & Dialogue */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-card-border/80 flex flex-col lg:flex-row items-center gap-6 bg-gradient-to-r from-white/[0.02] via-transparent to-transparent">
        
        {/* Core Glowing Orb */}
        <div className="relative flex items-center justify-center shrink-0 w-36 h-36">
          {/* Outer Ripple Rings */}
          <div className="absolute inset-0 rounded-full border border-white/5 animate-ping opacity-20 [animation-duration:3s]" />
          <div className="absolute inset-2 rounded-full border border-white/5 animate-ping opacity-30 [animation-duration:2s]" />
          
          {/* Main Breathing Orb */}
          <div className={`w-24 h-24 rounded-full bg-gradient-to-tr ${core.color} flex items-center justify-center border animate-breathe shrink-0`}>
            <Brain size={32} className="text-white drop-shadow-md" />
          </div>

          {/* Status Badge floating */}
          <div className={`absolute bottom-0 text-[9px] font-black uppercase tracking-wider border px-2 py-0.5 rounded-full backdrop-blur-md ${core.statusColor}`}>
            {core.status}
          </div>
        </div>

        {/* Empathy dialogue bubble */}
        <div className="flex-1 space-y-4 text-center lg:text-left">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-foreground flex items-center justify-center lg:justify-start gap-2">
              Pilot Status Report
              <span className="text-xs text-text-muted font-bold">
                {profile.academic.examType} Prep
              </span>
            </h1>
            <p className="text-xs text-text-muted mt-0.5">
              Target Score: <strong className="text-foreground">{profile.academic.targetScore}</strong> • {diffDays} days remaining to exam day.
            </p>
          </div>

          <div className="bg-white/5 border border-card-border p-4 rounded-2xl relative">
            {/* Dialogue tail */}
            <div className="hidden lg:block absolute -left-2 top-6 w-4 h-4 bg-slate-900 border-l border-b border-card-border/50 transform rotate-45" />
            <p className="text-sm font-semibold text-foreground leading-relaxed">
              "{core.message}"
            </p>
          </div>

          {/* Action layout */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <div className="shrink-0">
              <DailyCheckInForm 
                profile={profile} 
                history={history} 
                onCheckInCompleted={addCheckIn} 
              />
            </div>
            
            <Link
              href="/relax"
              className="flex items-center gap-1.5 bg-secondary/10 border border-secondary/20 hover:bg-secondary/20 text-secondary px-4 py-2 rounded-xl text-xs font-bold transition-all focus:ring-2 focus:ring-secondary outline-none cursor-pointer"
              title="Open relaxation mini-games room to decompress"
            >
              <Gamepad2 size={14} />
              Take a Play Break (Relax Games)
            </Link>

            <button
              onClick={resetToDemoMode}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-text-muted hover:text-foreground text-xs font-bold px-4 py-2 rounded-xl border border-card-border transition-all focus:ring-2 focus:ring-primary outline-none cursor-pointer"
              title="Reset storage to default pre-seeded JEE Student A parameters for testing"
              aria-label="Seed Demo Data"
            >
              <RefreshCw size={14} />
              Reset Demo Student
            </button>
          </div>
        </div>
      </div>

      {/* Grid 1: Fitness Score, Today's AI Insight & Mom/Friend Comfort */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <FitnessScore history={history} />
        </div>
        <div className="lg:col-span-1">
          <TodayInsight latestEntry={latestEntry} />
        </div>
        <div className="lg:col-span-1">
          <MomBestFriend latestEntry={latestEntry} />
        </div>
      </div>

      {/* Grid 2: Stress Constellation (Flow) & Burnout Radar (Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-full">
          <StressConstellation latestAnalysis={latestEntry?.analysis || null} />
        </div>
        <div className="lg:col-span-1">
          <BurnoutRadar history={history} />
        </div>
      </div>

      {/* Grid 3: Mental DNA & Action Plan & Empathetic Companion Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mental DNA */}
        <div className="lg:col-span-1">
          <MentalDNA dna={mentalDNA} />
        </div>

        {/* Action Plan */}
        <div className="lg:col-span-1">
          <ActionPlan 
            plan={intervention}
            completedActions={completedActions}
            onToggleAction={toggleActionCompletion}
          />
        </div>

        {/* Startup Metrics & Parent Reassurance Report */}
        <div className="lg:col-span-1">
          <StartupFeatures 
            latestEntry={latestEntry}
            profile={profile}
          />
        </div>
      </div>

      {/* Quick Footer Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
        <Link 
          href="/calm-room" 
          className="glass-panel p-4 rounded-xl flex items-center gap-3 hover:bg-white/5 transition-all text-xs font-semibold focus:ring-2 focus:ring-primary outline-none"
        >
          <ShieldAlert size={20} className="text-error" />
          <div>
            <span className="block text-foreground">SOS Calm Room</span>
            <span className="text-[10px] text-text-muted font-normal">Panic attacks & breathing guide</span>
          </div>
        </Link>

        <Link 
          href="/simulator" 
          className="glass-panel p-4 rounded-xl flex items-center gap-3 hover:bg-white/5 transition-all text-xs font-semibold focus:ring-2 focus:ring-primary outline-none"
        >
          <Compass size={20} className="text-accent" />
          <div>
            <span className="block text-foreground">Future Self Simulator</span>
            <span className="text-[10px] text-text-muted font-normal">Visualize trajectory projections</span>
          </div>
        </Link>

        <Link 
          href="/replay" 
          className="glass-panel p-4 rounded-xl flex items-center gap-3 hover:bg-white/5 transition-all text-xs font-semibold focus:ring-2 focus:ring-primary outline-none"
        >
          <Award size={20} className="text-secondary" />
          <div>
            <span className="block text-foreground">Weekly Replay</span>
            <span className="text-[10px] text-text-muted font-normal">Review key wins & stress trends</span>
          </div>
        </Link>

        <Link 
          href="/onboarding" 
          className="glass-panel p-4 rounded-xl flex items-center gap-3 hover:bg-white/5 transition-all text-xs font-semibold focus:ring-2 focus:ring-primary outline-none"
        >
          <Activity size={20} className="text-success" />
          <div>
            <span className="block text-foreground">Update Profile</span>
            <span className="text-[10px] text-text-muted font-normal">Adjust exam date & goals</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
