import React from 'react';
import { motion } from 'motion/react';
import { Insight } from '../types';
import { AlertCircle, Lightbulb, TrendingUp, Sparkles, ShieldAlert, Zap } from 'lucide-react';

interface AIInsightsProps {
  insights: Insight[];
  personality: string;
}

export default function AIInsights({ insights, personality }: AIInsightsProps) {
  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card bg-gradient-to-br from-accent/5 to-indigo-500/5 border-accent/10 p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-accent/10 text-accent shadow-sm">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-slate-900 font-bold text-lg">Financial Personality</h3>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed font-medium">
          {personality}
        </p>
      </motion.div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2 mb-2">
          <h3 className="text-slate-900 font-bold text-lg flex items-center gap-2">
            <Sparkles className="text-accent w-5 h-5" />
            Smart Alerts System
          </h3>
          <span className="text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/10 px-2 py-1 rounded-full">AI Powered</span>
        </div>

        {insights.map((insight, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + (i * 0.1) }}
            className={`p-5 rounded-[24px] border-2 flex gap-4 transition-all hover:scale-[1.02] cursor-default ${
              insight.type === 'alert' 
                ? 'bg-warning/5 border-warning/10 text-warning shadow-lg shadow-warning/5' 
                : insight.type === 'suggestion'
                ? 'bg-success/5 border-success/10 text-success shadow-lg shadow-success/5'
                : 'bg-accent/5 border-accent/10 text-accent shadow-lg shadow-accent/5'
            }`}
          >
            <div className={`mt-0.5 p-2 rounded-xl shrink-0 ${
              insight.type === 'alert' ? 'bg-warning/10' : insight.type === 'suggestion' ? 'bg-success/10' : 'bg-accent/10'
            }`}>
              {insight.type === 'alert' ? <ShieldAlert className="w-5 h-5" /> : insight.type === 'suggestion' ? <Zap className="w-5 h-5" /> : <Lightbulb className="w-5 h-5" />}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                  {insight.type === 'alert' ? 'Critical Warning' : insight.type === 'suggestion' ? 'Smart Suggestion' : 'AI Prediction'}
                </span>
              </div>
              <p className="text-sm font-bold leading-relaxed text-slate-800">
                {insight.message}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
