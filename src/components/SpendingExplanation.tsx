import React from 'react';
import { motion } from 'motion/react';
import { SpendingExplanation as SpendingExplanationType } from '../types';
import { TrendingUp, TrendingDown, ArrowRight, Zap } from 'lucide-react';

interface SpendingExplanationProps {
  explanations: SpendingExplanationType[];
}

export default function SpendingExplanation({ explanations }: SpendingExplanationProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
          <Zap className="text-purple-500 w-6 h-6" />
        </div>
        <h3 className="text-slate-900 font-bold text-lg">Smart Spending Explanation</h3>
      </div>

      <div className="space-y-6">
        {explanations.map((exp, i) => (
          <div key={i} className="relative pl-6 border-l-2 border-slate-100">
            <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center">
              <div className={`w-1.5 h-1.5 rounded-full ${exp.change_percentage > 0 ? 'bg-warning' : 'bg-success'}`} />
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-slate-900 font-bold text-sm">{exp.category}</h4>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                exp.change_percentage > 0 ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
              }`}>
                {exp.change_percentage > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(exp.change_percentage)}%
              </div>
            </div>

            <p className="text-slate-600 text-sm mb-3 font-medium">{exp.reason}</p>
            
            <ul className="space-y-2">
              {exp.details.map((detail, j) => (
                <li key={j} className="flex items-start gap-2 text-xs text-slate-500">
                  <ArrowRight className="w-3 h-3 mt-0.5 shrink-0 text-slate-400" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
