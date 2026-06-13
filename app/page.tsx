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
import { getInterventionForStudent } from '@/lib/mockData';
import { Activity, Sparkles, MessageSquare, Compass, ShieldAlert, Award, RefreshCw, AlertCircle } from 'lucide-react';
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
  const intervention = getInterventionForStudent(
    latestEntry?.analysis.burnoutRisk ?? 68,
    latestEntry?.analysis.stressTriggers ?? ['Physics', 'Parent Expectations'],
    latestEntry?.analysis.confidence ?? 35
  );

  // Calculate days remaining to exam date
  const examDate = new Date(profile.academic.examDate);
  const diffTime = examDate.getTime() - Date.now();
  const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  return (
    <div className="space-y-6 animate-in fade-in duration-300" role="main">
      {/* Top Banner: Welcome + Demo Mode Trigger */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 border border-card-border p-5 rounded-2xl">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2">
            Welcome back, Pilot 
            <span className="text-xs text-primary font-bold bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
              Active Session
            </span>
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Tracking resilience for <strong className="text-foreground">{profile.academic.examType}</strong>. Target Score: <strong className="text-foreground">{profile.academic.targetScore}</strong> • {diffDays} days remaining.
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {/* Demo Reset Trigger */}
          <button
            onClick={resetToDemoMode}
            className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-text-muted hover:text-foreground text-xs font-bold px-3 py-2 rounded-lg border border-card-border transition-all focus:ring-2 focus:ring-primary outline-none cursor-pointer"
            title="Reset storage to default pre-seeded JEE Student A parameters for testing"
            aria-label="Seed Demo Data"
          >
            <RefreshCw size={14} />
            Reset Seeded Demo Data
          </button>

          <div className="flex-1 md:flex-none">
            <DailyCheckInForm 
              profile={profile} 
              history={history} 
              onCheckInCompleted={addCheckIn} 
            />
          </div>
        </div>
      </div>

      {/* Grid 1: Fitness Score & Today's AI Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <FitnessScore history={history} />
        </div>
        <div className="lg:col-span-2">
          <TodayInsight latestEntry={latestEntry} />
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

        {/* AI Companion Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
                  <MessageSquare size={20} className="text-primary" />
                  AI Resilience Companion
                </h2>
                <span className="w-2 h-2 rounded-full bg-success animate-ping"></span>
              </div>
              <p className="text-xs text-text-muted mb-4 leading-relaxed">
                Need to talk? Your empathetic co-pilot understands your Mental DNA and exam stressors. Tell it about your Physics load, parent worries, or test panics.
              </p>
              
              {/* Quick Prompts */}
              <div className="space-y-2 mb-4">
                <Link 
                  href="/companion?prompt=How do I talk to my parents about my mock score drop?"
                  className="block text-left text-xs bg-white/5 border border-card-border p-2.5 rounded-lg text-text-muted hover:text-foreground hover:bg-white/10 transition-all outline-none focus:ring-1 focus:ring-primary"
                >
                  "How do I talk to parents about mock score drops?"
                </Link>
                <Link 
                  href="/companion?prompt=I am feeling completely overwhelmed with Physics backlog."
                  className="block text-left text-xs bg-white/5 border border-card-border p-2.5 rounded-lg text-text-muted hover:text-foreground hover:bg-white/10 transition-all outline-none focus:ring-1 focus:ring-primary"
                >
                  "I am overwhelmed with Physics backlog."
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t border-card-border">
              <Link
                href="/companion"
                className="w-full bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary font-bold text-center block py-2.5 rounded-xl text-xs transition-all focus:ring-2 focus:ring-primary outline-none"
              >
                Launch Empathetic Chat Room
              </Link>
            </div>
          </div>
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
