import React from 'react';
import { motion } from 'motion/react';
import { Subscription } from '../types';
import { CreditCard, AlertCircle, CheckCircle2, ArrowRight, Trash2 } from 'lucide-react';

interface SubscriptionLeakProps {
  subscriptions: Subscription[];
}

export default function SubscriptionLeak({ subscriptions }: SubscriptionLeakProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
          <CreditCard className="text-warning w-6 h-6" />
        </div>
        <h3 className="text-slate-900 font-bold text-lg">Subscription Leak Detector</h3>
      </div>

      <div className="space-y-4">
        {subscriptions.map((sub, i) => (
          <div 
            key={i} 
            className={`p-4 rounded-2xl border transition-all ${
              sub.status === 'suggested_cancel' ? 'bg-warning/5 border-warning/20' : 'bg-slate-50 border-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                  <CreditCard className="text-slate-400 w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-bold text-sm">{sub.name}</h4>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
                    ₹{sub.amount} / {sub.frequency}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {sub.status === 'suggested_cancel' ? (
                  <div className="flex items-center gap-1 text-warning text-xs font-bold px-2 py-1 bg-warning/10 rounded-full">
                    <AlertCircle className="w-3 h-3" />
                    Unused
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-success text-xs font-bold px-2 py-1 bg-success/10 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Active
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100/50">
              <p className="text-[10px] text-slate-400 font-medium">
                Last payment: {sub.last_payment}
              </p>
              {sub.status === 'suggested_cancel' && (
                <button className="flex items-center gap-1.5 text-xs font-bold text-warning hover:underline">
                  <Trash2 className="w-3.5 h-3.5" />
                  Cancel Subscription
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-slate-900 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-slate-800 transition-all">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <AlertCircle className="text-white w-4 h-4" />
          </div>
          <p className="text-white text-xs font-bold">Potential Savings: ₹2,400 / year</p>
        </div>
        <ArrowRight className="text-white w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
}
