import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';

interface HealthScoreProps {
  score: number;
}

export default function HealthScore({ score }: HealthScoreProps) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-success';
    if (s >= 60) return 'text-accent';
    return 'text-warning';
  };

  const getScoreBg = (s: number) => {
    if (s >= 80) return 'from-success/20 to-transparent';
    if (s >= 60) return 'from-accent/20 to-transparent';
    return 'from-warning/20 to-transparent';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card flex flex-col items-center text-center relative overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-b ${getScoreBg(score)} opacity-30`}></div>
      
      <h3 className="text-slate-500 font-medium mb-6 relative z-10">Financial Health Score</h3>
      
      <div className="relative w-48 h-48 flex items-center justify-center mb-6 z-10">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-slate-100"
          />
          <motion.circle
            cx="96"
            cy="96"
            r="88"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeDasharray={552.92}
            initial={{ strokeDashoffset: 552.92 }}
            animate={{ strokeDashoffset: 552.92 - (552.92 * score) / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={getScoreColor(score)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-bold ${getScoreColor(score)}`}>{score}</span>
          <span className="text-slate-400 text-sm font-medium">Excellent</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 w-full relative z-10">
        <div className="flex flex-col items-center">
          <div className="p-2 rounded-lg bg-success/10 text-success mb-2">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-xs text-slate-400">Savings</span>
          <span className="text-sm font-bold text-slate-900">+12%</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="p-2 rounded-lg bg-warning/10 text-warning mb-2">
            <TrendingDown className="w-4 h-4" />
          </div>
          <span className="text-xs text-slate-400">Risk</span>
          <span className="text-sm font-bold text-slate-900">Low</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="p-2 rounded-lg bg-accent/10 text-accent mb-2">
            <Target className="w-4 h-4" />
          </div>
          <span className="text-xs text-slate-400">Goals</span>
          <span className="text-sm font-bold text-slate-900">2/3</span>
        </div>
      </div>
    </motion.div>
  );
}
