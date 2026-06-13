'use client';
 
import React, { useState, useEffect } from 'react';
import { useStudentData } from '@/hooks/useStudentData';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Calendar, Award, TrendingUp, Sparkles, RefreshCw, ChevronRight, Activity, Moon, Zap, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';
 
export default function ReplayPage() {
  const { history, loading, resetToDemoMode } = useStudentData();
  const [mounted, setMounted] = useState(false);
 
  // Schedule Sandbox States
  const [morningSlot, setMorningSlot] = useState('high-focus');
  const [afternoonSlot, setAfternoonSlot] = useState('practice');
  const [lateAfternoonSlot, setLateAfternoonSlot] = useState('medium-focus');
  const [eveningSlot, setEveningSlot] = useState('active-reset');
  const [scheduleApplied, setScheduleApplied] = useState(false);
 
  useEffect(() => {
    setMounted(true);
  }, []);
 
  // Calculate Schedule Calibration rules
  const calibrationResult = React.useMemo(() => {
    let score = 100;
    const tips: string[] = [];
 
    if (eveningSlot === 'high-focus') {
      score -= 30;
      tips.push("⚠️ High-Focus (Physics/Math) in the evening stimulates brainwaves past wind-down times, inducing sleep debt.");
    }
 
    if (morningSlot === 'active-reset' || morningSlot === 'practice') {
      score -= 20;
      tips.push("⚠️ Morning slot is peak focus window. Use it for heavy concept absorption, not practice or reset.");
    }
 
    const hasReset = [morningSlot, afternoonSlot, lateAfternoonSlot, eveningSlot].includes('active-reset');
    if (!hasReset) {
      score -= 20;
      tips.push("⚠️ No active resets scheduled. Continuous study leads to focus fatigue. Dedicate at least one slot to breathing / games.");
    }
 
    if (eveningSlot === 'active-reset' && morningSlot === 'high-focus' && score >= 90) {
      tips.push("✓ Circadian Sync: Morning high focus utilizes peak focus, and evening active reset prepares your neural core for deep sleep.");
    }
 
    return {
      score: Math.max(10, score),
      tips
    };
  }, [morningSlot, afternoonSlot, lateAfternoonSlot, eveningSlot]);
 
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="animate-spin text-primary" size={32} />
          <p className="text-sm text-text-muted font-medium">Reconstructing schedule parameters...</p>
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
    const d = new Date(entry.checkIn.date);
    const label = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
    return {
      name: label,
      Confidence: entry.analysis.confidence,
      'Burnout Risk': entry.analysis.burnoutRisk,
      'Sleep (scaled x10)': entry.checkIn.sleepHours * 10
    };
  });
 
  // Calculate average metrics
  const latestEntry = history[history.length - 1];
  const avgConfidence = Math.round(history.reduce((acc, h) => acc + h.analysis.confidence, 0) / history.length);
  const avgBurnout = Math.round(history.reduce((acc, h) => acc + h.analysis.burnoutRisk, 0) / history.length);
  const avgSleepHours = (history.reduce((acc, h) => acc + h.checkIn.sleepHours, 0) / history.length).toFixed(1);
 
  // Diagnostic Tips generated from history logs
  const getScheduleCalibrations = () => {
    const calibrations = [];
    if (parseFloat(avgSleepHours) < 6.5) {
      calibrations.push({
        title: "Circadian Sync Error",
        text: `Average sleep is ${avgSleepHours} hours. Study blocks are encroaching on sleep boundaries. Stop all study blocks at 10 PM.`,
        type: 'danger'
      });
    }
    if (latestEntry && latestEntry.analysis.stressTriggers.some(t => ['physics', 'math'].includes(t.toLowerCase()))) {
      calibrations.push({
        title: "Subject Scheduling Mismatch",
        text: "Physics is a high-stress trigger. Avoid reviewing formulas late in the evening. Move Physics blocks to 9 AM.",
        type: 'warning'
      });
    }
    if (calibrations.length === 0) {
      calibrations.push({
        title: "Rhythm Synced",
        text: "Your logged schedules show steady sleeping habits and active breaks. Maintenance recommended.",
        type: 'success'
      });
    }
    return calibrations;
  };
 
  const scheduleDiagnostics = getScheduleCalibrations();
 
  const handleApplySchedule = () => {
    setScheduleApplied(true);
    setTimeout(() => setScheduleApplied(false), 3000);
  };
 
  return (
    <div className="space-y-6 animate-in fade-in duration-300" role="main" aria-label="Study Calibration Tool Page">
      {/* Page Header */}
      <div className="bg-white/5 border border-card-border p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-foreground flex items-center gap-2">
            <Award size={24} className="text-secondary" />
            Study Schedule Calibration Tool
          </h1>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            Align study blocks with your cognitive rhythms. Adjust schedules in the interactive sandbox to clear warnings.
          </p>
        </div>
        <Link
          href="/"
          className="bg-slate-800 hover:bg-slate-700 text-foreground font-bold text-xs px-4 py-2 rounded-xl border border-card-border transition-all focus:ring-2 focus:ring-primary outline-none"
        >
          Return to Dashboard
        </Link>
      </div>
 
      {/* Diagnostics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scheduleDiagnostics.map((diag, index) => (
          <div key={index} className={`glass-panel p-5 rounded-2xl text-xs space-y-2 border ${
            diag.type === 'danger' ? 'border-error/20 bg-error/5' : diag.type === 'warning' ? 'border-warning/20 bg-warning/5' : 'border-success/20 bg-success/5'
          }`}>
            <span className={`font-black uppercase tracking-wider block ${
              diag.type === 'danger' ? 'text-error' : diag.type === 'warning' ? 'text-warning' : 'text-success'
            }`}>
              {diag.title}
            </span>
            <p className="text-text-muted leading-relaxed font-semibold">
              {diag.text}
            </p>
          </div>
        ))}
      </div>
 
      {/* Sandbox Scheduler & Trends Graph Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Sandbox Scheduler */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Clock size={16} className="text-secondary" />
                Study Block Sandbox
              </h2>
              <span className={`text-xs px-2.5 py-1 rounded font-black border uppercase tracking-wider ${
                calibrationResult.score < 60 ? 'text-error border-error/20 bg-error/10' : calibrationResult.score < 85 ? 'text-warning border-warning/20 bg-warning/10' : 'text-success border-success/20 bg-success/10'
              }`}>
                Score: {calibrationResult.score}%
              </span>
            </div>
 
            <p className="text-xs text-text-muted mb-6">
              Organize daily blocks. Set demanding topics (Math/Physics) when cognitive alertness is peak.
            </p>
 
            <div className="space-y-4">
              {/* Morning Slot */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white/2 border border-card-border p-3.5 rounded-xl">
                <span className="text-xs font-bold text-foreground block">Morning (8 AM - 12 PM)</span>
                <select
                  value={morningSlot}
                  onChange={(e) => setMorningSlot(e.target.value)}
                  className="bg-slate-900 text-xs text-text-muted border border-card-border rounded-lg p-2 focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="high-focus">🔥 High-Focus (Physics/Math)</option>
                  <option value="medium-focus">📚 Medium-Focus (Chemistry)</option>
                  <option value="practice">📝 Mock/Practice Review</option>
                  <option value="active-reset">🧘 Active Reset (Breathing)</option>
                </select>
              </div>
 
              {/* Afternoon Slot */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white/2 border border-card-border p-3.5 rounded-xl">
                <span className="text-xs font-bold text-foreground block">Afternoon (1 PM - 5 PM)</span>
                <select
                  value={afternoonSlot}
                  onChange={(e) => setAfternoonSlot(e.target.value)}
                  className="bg-slate-900 text-xs text-text-muted border border-card-border rounded-lg p-2 focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="high-focus">🔥 High-Focus (Physics/Math)</option>
                  <option value="medium-focus">📚 Medium-Focus (Chemistry)</option>
                  <option value="practice">📝 Mock/Practice Review</option>
                  <option value="active-reset">🧘 Active Reset (Breathing)</option>
                </select>
              </div>
 
              {/* Late Afternoon Slot */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white/2 border border-card-border p-3.5 rounded-xl">
                <span className="text-xs font-bold text-foreground block">Late Afternoon (5 PM - 8 PM)</span>
                <select
                  value={lateAfternoonSlot}
                  onChange={(e) => setLateAfternoonSlot(e.target.value)}
                  className="bg-slate-900 text-xs text-text-muted border border-card-border rounded-lg p-2 focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="high-focus">🔥 High-Focus (Physics/Math)</option>
                  <option value="medium-focus">📚 Medium-Focus (Chemistry)</option>
                  <option value="practice">📝 Mock/Practice Review</option>
                  <option value="active-reset">🧘 Active Reset (Breathing)</option>
                </select>
              </div>
 
              {/* Evening Slot */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white/2 border border-card-border p-3.5 rounded-xl">
                <span className="text-xs font-bold text-foreground block">Evening (8 PM - 10:30 PM)</span>
                <select
                  value={eveningSlot}
                  onChange={(e) => setEveningSlot(e.target.value)}
                  className="bg-slate-900 text-xs text-text-muted border border-card-border rounded-lg p-2 focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="high-focus">🔥 High-Focus (Physics/Math)</option>
                  <option value="medium-focus">📚 Medium-Focus (Chemistry)</option>
                  <option value="practice">📝 Mock/Practice Review</option>
                  <option value="active-reset">🧘 Active Reset (Breathing)</option>
                </select>
              </div>
            </div>
          </div>
 
          {/* Dynamic Feedbacks */}
          <div className="mt-6 space-y-3">
            {calibrationResult.tips.map((tip, idx) => (
              <p key={idx} className="text-xs text-text-muted font-semibold bg-white/5 border border-card-border/60 p-3 rounded-xl">
                {tip}
              </p>
            ))}
 
            <button
              onClick={handleApplySchedule}
              className={`w-full text-xs font-black py-3 rounded-xl transition-all border outline-none cursor-pointer flex items-center justify-center gap-1.5 ${
                scheduleApplied 
                  ? 'bg-success/20 border-success text-success' 
                  : 'bg-primary border-primary text-white hover:opacity-90'
              }`}
            >
              {scheduleApplied ? (
                <>
                  <CheckCircle2 size={14} />
                  Schedule Calibrated (+40 XP awarded!)
                </>
              ) : (
                'Apply Calibrated Schedule'
              )}
            </button>
          </div>
        </div>
 
        {/* Weekly Trend Graph showing Sleep/Resilience correlation */}
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Sleep vs. Resilience Trends
            </h2>
            <span className="text-[10px] text-text-muted">7-Day Analysis Log</span>
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
                    dataKey="Sleep (scaled x10)" 
                    stroke="var(--color-success)" 
                    strokeWidth={1.5}
                    strokeDasharray="3 3" 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-text-muted">Generating trend metrics...</span>
            )}
          </div>
 
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 text-xs text-text-muted mt-6 leading-relaxed">
            <Sparkles size={16} className="text-primary shrink-0 inline-block mr-1 mb-0.5" />
            <strong>Correlation Insight:</strong> Note how drops in your sleep trend lines directly coincide with spikes in burnout risks. Sleep consolidation is the ultimate focus buffer.
          </div>
        </div>
      </div>
    </div>
  );
}
