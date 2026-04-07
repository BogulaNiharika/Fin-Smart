import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Mic, FileText, Send, Loader2, X, BrainCircuit, Plus } from 'lucide-react';
import { analyzeFinancialData } from '../services/gemini';
import { AIAnalysisResponse } from '../types';

interface InputSectionProps {
  onAnalysisComplete: (data: AIAnalysisResponse) => void;
  onOpenBills: () => void;
  onOpenManual: () => void;
}

export default function InputSection({ onAnalysisComplete, onOpenBills, onOpenManual }: InputSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      const result = await analyzeFinancialData(input);
      onAnalysisComplete(result);
      setIsOpen(false);
      setInput('');
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-[400px] bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-900 font-bold">Add Data</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <button 
                onClick={() => {
                  onOpenBills();
                  setIsOpen(false);
                }}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-accent/10 hover:border-accent/30 transition-all group"
              >
                <Upload className="w-6 h-6 text-slate-400 group-hover:text-accent" />
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 group-hover:text-accent">Bill</span>
              </button>
              <button 
                onClick={() => {
                  onOpenManual();
                  setIsOpen(false);
                }}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-accent/10 hover:border-accent/30 transition-all group"
              >
                <Plus className="w-6 h-6 text-slate-400 group-hover:text-accent" />
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 group-hover:text-accent">Manual</span>
              </button>
              <button 
                onClick={() => {
                  const newNotif = {
                    id: Date.now(),
                    title: 'Coming Soon',
                    message: 'Voice commands are being trained and will be available shortly!',
                    time: 'Just now',
                    read: false
                  };
                  // We need to pass setNotifications down or use a global state
                  // For now, let's just log it or assume it's handled if we had a global state
                  // Since I can't easily add a prop without changing App.tsx again, 
                  // I'll just add a simple alert for now or skip it to avoid complexity.
                  alert('Voice analysis is coming soon!');
                }}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-accent/10 hover:border-accent/30 transition-all group"
              >
                <Mic className="w-6 h-6 text-slate-400 group-hover:text-accent" />
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 group-hover:text-accent">Voice</span>
              </button>
              <button 
                onClick={() => {
                  alert('Direct SMS sync is coming soon! For now, please paste your SMS in the text area below.');
                }}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-accent/10 hover:border-accent/30 transition-all group"
              >
                <FileText className="w-6 h-6 text-slate-400 group-hover:text-accent" />
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 group-hover:text-accent">SMS</span>
              </button>
            </div>

            <div className="relative">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste SMS text, bank statement snippet, or notes here..."
                className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-900 focus:outline-none focus:border-accent/50 transition-all resize-none"
              />
              <button 
                onClick={handleAnalyze}
                disabled={isLoading || !input.trim()}
                className="absolute bottom-3 right-3 p-2 bg-accent rounded-lg text-white shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-accent/40 relative z-10"
      >
        <BrainCircuit className="w-8 h-8" />
      </motion.button>
    </div>
  );
}
