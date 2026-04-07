import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Landmark, User, Hash, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

interface BankDetails {
  bankName: string;
  holderName: string;
  ifscCode: string;
  branch: string;
}

interface BankAccountSetupProps {
  onComplete: (details: BankDetails) => void;
  onSkip: () => void;
}

export default function BankAccountSetup({ onComplete, onSkip }: BankAccountSetupProps) {
  const [details, setDetails] = useState<BankDetails>({
    bankName: '',
    holderName: '',
    ifscCode: '',
    branch: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(details);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[520px] relative z-10"
      >
        <div className="bg-white rounded-[32px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-accent to-indigo-400" />

          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Landmark className="text-accent w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Link Your Bank</h3>
            <p className="text-slate-500 text-sm">
              Please provide your bank details to enable smart transaction tracking and AI insights.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Bank Name</label>
              <div className="relative">
                <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  required
                  type="text" 
                  placeholder="e.g. HDFC Bank"
                  value={details.bankName}
                  onChange={(e) => setDetails(prev => ({ ...prev, bankName: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Account Holder Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  required
                  type="text" 
                  placeholder="Name as per bank records"
                  value={details.holderName}
                  onChange={(e) => setDetails(prev => ({ ...prev, holderName: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">IFSC Code</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    required
                    type="text" 
                    placeholder="HDFC0001234"
                    value={details.ifscCode}
                    onChange={(e) => setDetails(prev => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Branch</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    required
                    type="text" 
                    placeholder="Branch Name"
                    value={details.branch}
                    onChange={(e) => setDetails(prev => ({ ...prev, branch: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 flex items-start gap-3 mt-2">
              <ShieldCheck className="w-5 h-5 text-success mt-0.5 shrink-0" />
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Your bank details are encrypted and stored securely. We only use this information to categorize your transactions and provide personalized insights.
              </p>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <button 
                type="button"
                onClick={onSkip}
                className="flex-1 py-4 rounded-2xl font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
              >
                Skip for now
              </button>
              <button 
                type="submit"
                className="flex-[2] bg-accent text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-accent/20 hover:bg-accent/90 hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              >
                Complete Setup
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
