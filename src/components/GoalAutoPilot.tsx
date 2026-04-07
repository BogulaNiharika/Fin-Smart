import React from 'react';
import { motion } from 'motion/react';
import { Goal } from '../types';
import { Target, Sparkles, ShieldCheck, Zap, ArrowRight, Info } from 'lucide-react';

interface GoalAutoPilotProps {
  goal: Goal;
  safeToSpend: number;
  weeklyBudget: number;
}

export default function GoalAutoPilot({ goal, safeToSpend, weeklyBudget }: GoalAutoPilotProps) {
  const progress = (goal.current_progress / goal.target_amount) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-slate-200"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
            <Target className="text-accent w-6 h-6" />
          </div>
          <h3 className="text-slate-900 font-bold text-lg">Goal Auto-Pilot Mode</h3>
        </div>
        <div className="flex items-center gap-2 bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20">
          <Sparkles className="text-accent w-4 h-4 fill-accent" />
          <span className="text-accent font-bold text-[10px] uppercase tracking-wider">Active</span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white/80 rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex justify-between text-sm mb-3">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Current Goal Progress</span>
            <span className="text-slate-900 font-black">₹{(goal.current_progress || 0).toLocaleString()} / ₹{(goal.target_amount || 0).toLocaleString()}</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-accent shadow-[0_0_10px_rgba(99,102,241,0.2)]"
            />
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-success" />
            <span>Auto-Pilot is adjusting your budget to meet the {goal.deadline} deadline.</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/80 rounded-2xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="text-warning w-4 h-4 fill-warning" />
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Safe-to-Spend</span>
            </div>
            <p className="text-2xl font-black text-slate-900">₹{(safeToSpend || 0).toLocaleString()}</p>
            <p className="text-[10px] text-slate-400 font-medium mt-1">Remaining for this week</p>
          </div>
          <div className="bg-white/80 rounded-2xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Target className="text-accent w-4 h-4" />
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Weekly Budget</span>
            </div>
            <p className="text-2xl font-black text-slate-900">₹{(weeklyBudget || 0).toLocaleString()}</p>
            <p className="text-[10px] text-slate-400 font-medium mt-1">Auto-adjusted by AI</p>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-4 flex items-center justify-between group cursor-pointer hover:bg-slate-800 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <Info className="text-white w-4 h-4" />
            </div>
            <p className="text-white text-xs font-bold">How is this calculated?</p>
          </div>
          <ArrowRight className="text-white w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}
