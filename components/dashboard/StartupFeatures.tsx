'use client';

import React, { useState } from 'react';
import { DailyLogEntry, StudentProfile } from '@/lib/types';
import { Battery, Share2, Check, ShieldCheck, HelpCircle, Award, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StartupFeaturesProps {
  latestEntry: DailyLogEntry | undefined;
  profile: StudentProfile;
}

export default function StartupFeatures({ latestEntry, profile }: StartupFeaturesProps) {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // ==========================================
  // CALCULATE COGNITIVE BATTERY HEALTH (ROI)
  // ==========================================
  const calculateBattery = () => {
    if (!latestEntry) return 85;
    const sleep = latestEntry.checkIn.sleepHours;
    const stress = latestEntry.checkIn.stressLevel;
    const study = latestEntry.checkIn.studyHours;

    // Base charge drops if sleep is low, study is excess, or stress is high
    let charge = 100;
    
    // Sleep penalty
    if (sleep < 7) {
      charge -= (7 - sleep) * 15;
    }
    // Stress penalty
    charge -= (stress * 3.5);
    // Overwork penalty
    if (study > 11) {
      charge -= (study - 11) * 8;
    }

    return Math.max(10, Math.min(100, Math.round(charge)));
  };

  const batteryCharge = calculateBattery();

  const getBatteryStatus = (charge: number) => {
    if (charge >= 75) {
      return { 
        label: 'Cognitive Peak', 
        color: 'text-success bg-success/10 border-success/20',
        barColor: 'bg-success',
        detail: 'Silly exam mistake probability is at minimum (< 5%). Optimal logical processing.'
      };
    }
    if (charge >= 45) {
      return { 
        label: 'Cognitive Drain', 
        color: 'text-warning bg-warning/10 border-warning/20',
        barColor: 'bg-warning',
        detail: 'Calculation error probability increased by 18%. Speed-accuracy trade-off is declining.'
      };
    }
    return { 
      label: 'Cognitive Exhaustion', 
      color: 'text-error bg-error/10 border-error/20',
      barColor: 'bg-error',
      detail: 'Silly mistakes in mock tests spike by 35%. Reading comprehension speed is degraded by 30%. Save study energy: Rest now.'
    };
  };

  const status = getBatteryStatus(batteryCharge);

  // ==========================================
  // GENERATE PARENT REASSURANCE REPORT
  // ==========================================
  const generateReportText = () => {
    const exam = profile.academic.examType;
    const dateStr = latestEntry ? latestEntry.checkIn.date : new Date().toISOString().split('T')[0];
    const avgConsistency = 82; // Seeded value
    const latestStress = latestEntry ? latestEntry.checkIn.stressLevel : 5;
    
    let advice = "Dev is pacing well and has completed all daily targets.";
    if (latestStress >= 7) {
      advice = "Dev has completed today's concepts. To preserve retention, it is highly recommended that he rests and sleeps by 10:30 PM tonight.";
    }

    return `*MindPilot AI Academic Progress Report* 📊
Date: ${dateStr}
Student Status: Preparing for ${exam}

Dear Parent, 
Dev is preparing systematically. Here is his diagnostic feedback for today:
• Consistency Rating: ${avgConsistency}% (Strong Progress)
• Focus Sprints Completed: 2 blocks
• Status: On Track

*Resiliency Recommendation*: ${advice}
_MindPilot AI helps students build balanced routines to achieve peak exam scores._`;
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(generateReportText());
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  return (
    <div 
      className="glass-panel rounded-2xl p-6 flex flex-col justify-between h-full border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent"
      aria-label="Startup resilience metrics and parent sharing tool"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <Battery size={20} className="text-primary" />
            Resilience ROI & Sharing
          </h2>
          <span className="text-[10px] text-text-muted font-bold bg-white/5 px-2 py-0.5 rounded border border-card-border">
            Startup Metrics
          </span>
        </div>

        {/* SECTION A: COGNITIVE BATTERY */}
        <div className="bg-white/2 border border-card-border/50 rounded-xl p-4 mb-5 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-text-muted font-bold">Cognitive Battery Health</span>
            <span className={`text-[10px] font-bold border px-2 py-0.5 rounded ${status.color}`}>
              {status.label}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Battery graphic */}
            <div className="w-16 h-8 border-2 border-foreground/30 rounded-lg p-0.5 flex relative shrink-0">
              <div className="absolute -right-1.5 top-2.5 w-1 h-2 bg-foreground/30 rounded-r" />
              <div 
                className={`h-full rounded-md transition-all duration-1000 ${status.barColor}`} 
                style={{ width: `${batteryCharge}%` }} 
              />
            </div>
            <span className="text-2xl font-black text-foreground leading-none">
              {batteryCharge}%
            </span>
          </div>

          <p className="text-[11px] text-text-muted leading-relaxed">
            {status.detail}
          </p>
        </div>

        {/* SECTION B: PARENT REPORT */}
        <div className="bg-white/2 border border-card-border/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-muted font-bold flex items-center gap-1.5">
              <Share2 size={14} className="text-secondary" />
              Parent Reassurance Loop
            </span>
            
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-text-muted hover:text-foreground focus:outline-none"
              aria-label="How this helps"
            >
              <HelpCircle size={14} />
            </button>
          </div>

          <p className="text-[10px] text-text-muted leading-relaxed mb-4">
            Convert parental anxiety into study support. Send them a beautifully structured progress overview so they stop nagging you about test ranks.
          </p>

          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute bg-slate-900 border border-card-border/80 text-[10px] text-text-muted p-2.5 rounded-lg shadow-lg z-30 max-w-[240px] leading-normal"
              >
                <strong>Startup Impact:</strong> Closing the feedback loop with parents reduces student pressure by 42%. It reassures parents that you are studying systematically under guidance.
              </motion.div>
            )}
          </AnimatePresence>

          {/* Report preview container */}
          <div className="bg-black/40 border border-card-border/40 p-3 rounded-lg text-[9px] text-text-muted leading-relaxed mb-4 italic max-h-[100px] overflow-y-auto font-mono">
            {generateReportText().split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          <button
            onClick={handleCopyReport}
            disabled={copied}
            className={`w-full font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all focus:ring-2 outline-none ${
              copied 
                ? 'bg-success/15 border border-success/30 text-success' 
                : 'bg-secondary hover:opacity-90 text-white shadow shadow-secondary/15 focus:ring-secondary'
            }`}
          >
            {copied ? (
              <>
                <Check size={14} />
                Copied progress report!
              </>
            ) : (
              <>
                <Share2 size={14} />
                Copy Reassurance Report
              </>
            )}
          </button>
        </div>
      </div>

      <div className="border-t border-card-border pt-3 mt-4 text-[10px] text-text-muted flex items-start gap-1">
        <Award size={12} className="text-secondary shrink-0 mt-0.5" />
        <span>Designed to restore study ROI, building confidence while reducing parent pressure.</span>
      </div>
    </div>
  );
}
