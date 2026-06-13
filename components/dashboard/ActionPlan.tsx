'use client';

import React from 'react';
import { InterventionPlan } from '@/lib/types';
import { CheckSquare, Square, ClipboardList, Lightbulb, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ActionPlanProps {
  plan: InterventionPlan;
  completedActions: Record<string, boolean>;
  onToggleAction: (planType: string, actionKey: string) => void;
}

export default function ActionPlan({ plan, completedActions, onToggleAction }: ActionPlanProps) {
  const allTasks = [
    { key: 'immediate', label: plan.immediateAction, timeframe: 'Immediate Reset' },
    { key: 'today', label: plan.todayAction, timeframe: "Today's Target" },
    ...plan.threeDayPlan.map((action, idx) => ({ key: `3day-${idx}`, label: action, timeframe: '3-Day Goal' })),
    ...plan.sevenDayPlan.map((action, idx) => ({ key: `7day-${idx}`, label: action, timeframe: '7-Day Goal' })),
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

  const getTimeframeBadge = (timeframe: string) => {
    switch (timeframe) {
      case 'Immediate Reset': return 'bg-error/10 text-error border-error/20';
      case "Today's Target": return 'bg-warning/10 text-warning border-warning/20';
      case '3-Day Goal': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-accent/10 text-accent border-accent/20';
    }
  };

  return (
    <div 
      className="glass-panel rounded-2xl p-6 flex flex-col justify-between h-full"
      aria-label="Personalized intervention engine action checklist"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <ClipboardList size={20} className={getActionColor(plan.type)} />
            Personalized Action Plan
          </h2>
          <span className="text-xs bg-white/5 border border-card-border px-2.5 py-0.5 rounded text-text-muted">
            Targeted: {plan.title}
          </span>
        </div>

        {/* Short dynamic description */}
        <p className="text-xs text-text-muted mb-4">
          Generated automatically because your state triggered: <strong className="text-foreground">{plan.trigger}</strong>. Follow these actionable non-medical steps.
        </p>

        {/* Progress header */}
        <div className="flex justify-between items-center mb-4 text-xs font-semibold">
          <span className="text-text-muted">Intervention Progress</span>
          <span className="text-foreground">{completedCount} of {allTasks.length} Done ({progressPercent}%)</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-card-border mb-6">
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

        {/* Task list items */}
        <div className="space-y-3" role="group" aria-label="Action steps checklist">
          {allTasks.map((task) => {
            const isCompleted = completedActions[`${plan.type}-${task.key}`];
            return (
              <button
                key={task.key}
                onClick={() => onToggleAction(plan.type, task.key)}
                className={`w-full flex items-start text-left gap-3 p-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${
                  isCompleted 
                    ? 'bg-success/5 border-success/20 opacity-60 text-text-muted' 
                    : 'bg-white/5 border-card-border hover:bg-white/10'
                }`}
                aria-pressed={isCompleted}
              >
                <span className="shrink-0 mt-0.5" aria-hidden="true">
                  {isCompleted ? (
                    <CheckCircle size={18} className="text-success" />
                  ) : (
                    <Square size={18} className="text-text-muted" />
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10px] border px-1.5 rounded font-bold uppercase tracking-wider ${getTimeframeBadge(task.timeframe)}`}>
                      {task.timeframe}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 font-medium ${isCompleted ? 'line-through' : 'text-foreground'}`}>
                    {task.label}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-card-border pt-4 mt-6 flex items-start gap-2 text-xs bg-primary/5 rounded-xl p-3 border border-primary/10">
        <Lightbulb size={16} className="text-primary shrink-0 mt-0.5 animate-pulse" />
        <p className="text-text-muted">
          Completing tasks systematically triggers positive neurological rewards and builds study consistency. Reset daily!
        </p>
      </div>
    </div>
  );
}
