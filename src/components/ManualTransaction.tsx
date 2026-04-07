import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Check, AlertCircle, Calendar, Store, CreditCard, Tag, IndianRupee, Sparkles, Loader2 } from 'lucide-react';
import { Transaction } from '../types';
import { cn } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

interface ManualTransactionProps {
  onSave: (transaction: Transaction) => void;
  onCancel: () => void;
  existingTransactions: Transaction[];
}

export default function ManualTransaction({ onSave, onCancel, existingTransactions }: ManualTransactionProps) {
  const [formData, setFormData] = useState<Partial<Transaction>>({
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    merchant: '',
    category: 'Others',
    payment_type: 'UPI'
  });
  const [tag, setTag] = useState<'Personal' | 'Business'>('Personal');
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);

  // AI Category Suggestion
  useEffect(() => {
    const suggestCategory = async () => {
      if (formData.merchant && formData.merchant.length > 3) {
        setIsSuggesting(true);
        try {
          const apiKey = process.env.GEMINI_API_KEY;
          if (!apiKey) return;
          
          const ai = new GoogleGenAI({ apiKey });
          const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Predict the category for this merchant: "${formData.merchant}". 
            Categories: Food, Travel, Shopping, Bills, Others. 
            Return ONLY the category name.`,
            config: {
              responseMimeType: "text/plain",
            }
          });
          
          const suggestedCategory = response.text?.trim() as any;
          if (['Food', 'Travel', 'Shopping', 'Bills', 'Others'].includes(suggestedCategory)) {
            setFormData(prev => ({ ...prev, category: suggestedCategory }));
          }
        } catch (error) {
          console.error("Category suggestion failed:", error);
        } finally {
          setIsSuggesting(false);
        }
      }
    };

    const timeoutId = setTimeout(suggestCategory, 1000);
    return () => clearTimeout(timeoutId);
  }, [formData.merchant]);

  // Duplicate Detection
  useEffect(() => {
    const duplicate = existingTransactions.some(tx => 
      tx.merchant.toLowerCase() === formData.merchant?.toLowerCase() && 
      tx.amount === formData.amount &&
      tx.date === formData.date
    );
    setIsDuplicate(duplicate);
  }, [formData.amount, formData.merchant, formData.date, existingTransactions]);

  const handleSave = () => {
    if (formData.amount && formData.merchant && formData.date && formData.category && formData.payment_type) {
      onSave(formData as Transaction);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card max-w-2xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Add Transaction</h3>
          <p className="text-slate-500 text-sm">Enter your expense details manually.</p>
        </div>
        <button onClick={onCancel} className="text-slate-400 hover:text-warning transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-6">
        {isDuplicate && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 bg-warning/10 border border-warning/20 rounded-xl text-warning"
          >
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">Similar transaction detected in your history.</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs text-slate-400 uppercase font-bold tracking-wider flex items-center gap-2">
              <IndianRupee className="w-3 h-3" /> Amount
            </label>
            <input 
              type="number" 
              value={formData.amount || ''} 
              onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 text-lg font-bold focus:outline-none focus:border-accent/50 transition-all"
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400 uppercase font-bold tracking-wider flex items-center gap-2">
              <Calendar className="w-3 h-3" /> Date
            </label>
            <input 
              type="date" 
              value={formData.date} 
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 focus:outline-none focus:border-accent/50 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-slate-400 uppercase font-bold tracking-wider flex items-center gap-2">
            <Store className="w-3 h-3" /> Merchant Name
          </label>
          <div className="relative">
            <input 
              type="text" 
              value={formData.merchant} 
              onChange={(e) => setFormData(prev => ({ ...prev, merchant: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 focus:outline-none focus:border-accent/50 transition-all"
              placeholder="e.g. Starbucks, Amazon, Uber"
            />
            {isSuggesting && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-accent text-xs font-medium">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>AI Categorizing...</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs text-slate-400 uppercase font-bold tracking-wider flex items-center gap-2">
              <Tag className="w-3 h-3" /> Category
            </label>
            <div className="relative">
              <select 
                value={formData.category} 
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 focus:outline-none focus:border-accent/50 transition-all appearance-none"
              >
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills</option>
                <option value="Others">Others</option>
              </select>
              <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400 uppercase font-bold tracking-wider flex items-center gap-2">
              <CreditCard className="w-3 h-3" /> Payment Method
            </label>
            <select 
              value={formData.payment_type} 
              onChange={(e) => setFormData(prev => ({ ...prev, payment_type: e.target.value as any }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 focus:outline-none focus:border-accent/50 transition-all appearance-none"
            >
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Cash">Cash</option>
              <option value="Bank">Bank</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Tagging</label>
          <div className="flex gap-4">
            {(['Personal', 'Business'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
                className={cn(
                  "flex-1 py-3 rounded-xl text-sm font-bold border transition-all",
                  tag === t 
                    ? "bg-accent/10 border-accent/30 text-accent" 
                    : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button 
            onClick={onCancel}
            className="flex-1 py-4 rounded-xl font-bold text-slate-400 hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!formData.amount || !formData.merchant}
            className="flex-1 py-4 rounded-xl font-bold bg-accent text-white shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" /> Save Expense
          </button>
        </div>
      </div>
    </motion.div>
  );
}
