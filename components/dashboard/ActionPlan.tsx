'use client';
 
import React from 'react';
import { InterventionPlan } from '@/lib/types';
import { CheckCircle2, Circle, ClipboardList, Lightbulb, Shield, Zap, Compass, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
 
interface ActionPlanProps {
  plan: InterventionPlan;
  completedActions: Record<string, boolean>;
  onToggleAction: (planType: string, actionKey: string) => void;
}
 
export default function ActionPlan({ plan, completedActions, onToggleAction }: ActionPlanProps) {
  const allTasks = [
    { key: 'immediate', label: plan.immediateAction, timeframe: 'Immediate Reset', icon: Shield, color: 'text-error bg-error/10 border-error/20' },
    { key: 'today', label: plan.todayAction, timeframe: "Today's Target", icon: Zap, color: 'text-warning bg-warning/10 border-warning/20' },
    ...plan.threeDayPlan.map((action, idx) => ({ key: `3day-${idx}`, label: action, timeframe: '3-Day Goal', icon: Compass, color: 'text-primary bg-primary/10 border-primary/20' })),
    ...plan.sevenDayPlan.map((action, idx) => ({ key: `7day-${idx}`, label: action, timeframe: '7-Day Goal', icon: Trophy, color: 'text-accent bg-accent/10 border-accent/20' })),
  ];
 
  const completedCount = allTasks.filter(t => completedActions[`${plan.type}-${t.key}`]).length;
  const progressPercent = Math.round((completedCount / allTasks.length) * 100);
 
  const getActionColor = (type: string) => {
    switch (type) {
      case 'burnout': return 'text-error';
      case 'parent-pressure': return 'text-warning';
      case 'exam-panic': return 'text-accent';
      default: return 'text-primary';
    }
  };
 
  return (
    <div 
      className="glass-panel rounded-3xl p-6 flex flex-col justify-between h-full bg-gradient-to-b from-white/[0.01] via-transparent to-transparent border border-card-border/80"
      aria-label="Personalized intervention engine action checklist"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black flex items-center gap-2 text-foreground">
            <ClipboardList size={20} className={getActionColor(plan.type)} />
            Resilience Quest Roadmap
          </h2>
          <span className="text-[10px] uppercase font-black tracking-wider bg-white/5 border border-card-border px-2.5 py-1 rounded text-text-muted">
            Target: {plan.title}
          </span>
        </div>
 
        {/* Short dynamic description */}
        <p className="text-xs text-text-muted mb-6">
          Your current mental DNA diagnostics triggered the <strong className="text-foreground">{plan.trigger}</strong> quest-line. Clear steps systematically build exam resilience (+30 XP per quest!).
        </p>
 
        {/* Progress header */}
        <div className="flex justify-between items-center mb-3 text-xs font-bold">
          <span className="text-text-muted">Quests Cleared</span>
          <span className="text-foreground">{completedCount} of {allTasks.length} Done ({progressPercent}%)</span>
        </div>
 
        {/* Progress bar */}
        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-card-border mb-8">
          <motion.div 
            className="h-full bg-gradient-to-r from-success to-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Action plan is ${progressPercent}% completed`}
          />
        </div>
 
        {/* Connected Quest roadmap path */}
        <div className="relative pl-6 space-y-5" role="group" aria-label="Action steps checklist">
          {/* Background vertical line */}
          <div className="absolute left-[9px] top-3 bottom-3 w-[2px] bg-slate-800/80" />
          
          {/* Active progress highlight line */}
          <div 
            className="absolute left-[9px] top-3 w-[2px] bg-gradient-to-b from-success to-primary transition-all duration-500" 
            style={{ 
              height: `${Math.max(0, (completedCount / (allTasks.length || 1)) * 100)}%`,
              maxHeight: '94%' 
            }}
          />
 
          {allTasks.map((task, idx) => {
            const isCompleted = completedActions[`${plan.type}-${task.key}`];
            const TaskIcon = task.icon;
            
            return (
              <div key={task.key} className="relative flex gap-4 group">
                {/* Node indicator button */}
                <div className="absolute -left-[23px] top-2 z-10 flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onToggleAction(plan.type, task.key)}
                    className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                      isCompleted 
                        ? 'bg-success border-success text-white shadow-[0_0_12px_rgba(34,197,94,0.5)]' 
                        : 'bg-slate-950 border-slate-700 hover:border-primary text-text-muted hover:text-foreground'
                    }`}
                    aria-label={`Toggle completion of ${task.timeframe}`}
                  >
                    {isCompleted ? <CheckCircle2 size={10} /> : <Circle size={8} />}
                  </motion.button>
                </div>
 
                {/* Card Container */}
                <button
                  onClick={() => onToggleAction(plan.type, task.key)}
                  className={`flex-1 text-left p-3.5 rounded-2xl border transition-all duration-300 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                    isCompleted 
                      ? 'bg-success/5 border-success/20 opacity-70 text-text-muted' 
                      : 'bg-white/5 border-card-border hover:bg-white/10 hover:border-card-border/80 shadow-[0_4px_20px_rgba(0,0,0,0.2)]'
                  }`}
                >
                  {/* Glowing background sweep */}
                  {!isCompleted && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.01] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  )}
 
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${task.color}`}>
                          {task.timeframe}
                        </span>
                        <span className="text-[10px] text-text-muted">Quest {idx + 1}</span>
                      </div>
                      <p className={`text-xs mt-1.5 font-bold leading-relaxed ${isCompleted ? 'line-through text-text-muted/75' : 'text-foreground'}`}>
                        {task.label}
                      </p>
                    </div>
 
                    {/* Icon container */}
                    <div className={`p-2 rounded-xl shrink-0 ${isCompleted ? 'bg-success/10 text-success' : 'bg-slate-800/80 text-foreground border border-card-border/60'}`}>
                      <TaskIcon size={14} />
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
 
      <div className="border-t border-card-border/40 pt-4 mt-6 flex items-start gap-2.5 text-xs bg-primary/5 rounded-2xl p-4 border border-primary/10">
        <Lightbulb size={16} className="text-primary shrink-0 mt-0.5 animate-pulse" />
        <p className="text-text-muted leading-relaxed">
          Completing steps triggers resilience XP, unlocking special ranks and badges. Take baby steps to avoid overload!
        </p>
      </div>
    </div>
  );
}
