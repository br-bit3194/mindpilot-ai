'use client';

import React from 'react';
import { MentalDNA as MentalDNAType } from '@/lib/types';
import { Brain, Heart, Zap, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface MentalDNAProps {
  dna: MentalDNAType;
}

export default function MentalDNA({ dna }: MentalDNAProps) {
  const getSusceptibilityColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-error bg-error/10 border-error/20';
      case 'Medium': return 'text-warning bg-warning/10 border-warning/20';
      default: return 'text-success bg-success/10 border-success/20';
    }
  };

  return (
    <div 
      className="glass-panel rounded-2xl p-6 flex flex-col justify-between h-full"
      aria-label="Mental DNA Profile Dashboard Card"
    >
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <Brain size={20} className="text-primary" />
            Mental DNA Profile
          </h2>
          <span className="text-xs text-text-muted">Continuous Learning</span>
        </div>

        {/* Primary stressors */}
        <div className="mb-5">
          <label className="text-xs text-text-muted font-semibold uppercase tracking-wider block mb-2">
            Primary Stress Triggers
          </label>
          <div className="flex flex-wrap gap-2" role="list" aria-label="Primary stress triggers">
            {dna.primaryStressors.map((stressor, idx) => (
              <span 
                key={idx}
                role="listitem"
                className="text-xs bg-white/5 border border-card-border px-2.5 py-1 rounded-full text-foreground font-medium"
              >
                {stressor}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          {/* Confidence Pattern */}
          <div className="bg-white/5 border border-card-border/50 rounded-xl p-3">
            <span className="text-[10px] text-text-muted block uppercase tracking-wider font-semibold">
              Confidence Pattern
            </span>
            <span className="text-sm font-semibold text-foreground flex items-center gap-1.5 mt-1">
              <Zap size={14} className="text-accent" />
              {dna.confidencePattern}
            </span>
          </div>

          {/* Recovery Style */}
          <div className="bg-white/5 border border-card-border/50 rounded-xl p-3">
            <span className="text-[10px] text-text-muted block uppercase tracking-wider font-semibold">
              Recovery Style
            </span>
            <span className="text-sm font-semibold text-foreground flex items-center gap-1.5 mt-1">
              <Heart size={14} className="text-secondary" />
              {dna.recoveryStyle}
            </span>
          </div>

          {/* Motivation Type */}
          <div className="bg-white/5 border border-card-border/50 rounded-xl p-3">
            <span className="text-[10px] text-text-muted block uppercase tracking-wider font-semibold">
              Motivation Style
            </span>
            <span className="text-sm font-semibold text-foreground flex items-center gap-1.5 mt-1">
              <Sparkles size={14} className="text-primary" />
              {dna.motivationType}
            </span>
          </div>

          {/* Burnout Susceptibility */}
          <div className={`border rounded-xl p-3 ${getSusceptibilityColor(dna.burnoutSusceptibility)}`}>
            <span className="text-[10px] block uppercase tracking-wider font-semibold">
              Burnout Risk Level
            </span>
            <span className="text-sm font-bold flex items-center gap-1.5 mt-1">
              <AlertCircle size={14} />
              {dna.burnoutSusceptibility}
            </span>
          </div>
        </div>
      </div>

      {/* Resilience Score */}
      <div className="border-t border-card-border pt-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-xs text-text-muted uppercase tracking-wider font-semibold block">
              Emotional Resilience
            </span>
            <span className="text-2xl font-black text-foreground">
              {dna.emotionalResilience}<span className="text-xs font-normal text-text-muted">/100</span>
            </span>
          </div>
          <span className="text-xs text-success font-medium bg-success/15 px-2 py-0.5 rounded">
            +3.5% Recovery speed
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-card-border">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${dna.emotionalResilience}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            role="progressbar"
            aria-valuenow={dna.emotionalResilience}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Resilience level is ${dna.emotionalResilience}%`}
          />
        </div>
      </div>
    </div>
  );
}
