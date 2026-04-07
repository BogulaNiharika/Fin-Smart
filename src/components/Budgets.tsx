import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Wallet, ArrowUpRight, ArrowDownRight, Plus, X, Check, IndianRupee } from 'lucide-react';

interface Budget {
  category: string;
  limit: number;
  spent: number;
  color: string;
}

const initialBudgets: Budget[] = [
  { category: 'Food', limit: 15000, spent: 12450, color: 'bg-orange-500' },
  { category: 'Shopping', limit: 10000, spent: 8200, color: 'bg-purple-500' },
  { category: 'Bills', limit: 25000, spent: 24000, color: 'bg-blue-500' },
  { category: 'Travel', limit: 5000, spent: 1200, color: 'bg-green-500' },
];

const categoryColors: Record<string, string> = {
  Food: 'bg-orange-500',
  Shopping: 'bg-purple-500',
  Bills: 'bg-blue-500',
  Travel: 'bg-green-500',
  Others: 'bg-slate-500',
};

export default function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [isAdding, setIsAdding] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: 'Food',
    limit: ''
  });

  const handleAddBudget = () => {
    if (!newBudget.limit) return;
    
    const existingIndex = budgets.findIndex(b => b.category === newBudget.category);
    if (existingIndex > -1) {
      const updated = [...budgets];
      updated[existingIndex] = {
        ...updated[existingIndex],
        limit: Number(newBudget.limit)
      };
      setBudgets(updated);
    } else {
      setBudgets([...budgets, {
        category: newBudget.category,
        limit: Number(newBudget.limit),
        spent: 0,
        color: categoryColors[newBudget.category] || categoryColors.Others
      }]);
    }
    setIsAdding(false);
    setNewBudget({ category: 'Food', limit: '' });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Budget Planning</h3>
          <p className="text-slate-500 text-sm">Monitor and manage your monthly spending limits.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-accent text-white px-6 py-2 rounded-xl font-bold hover:scale-105 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Set New Budget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {budgets.map((budget, i) => {
          const percent = (budget.spent / budget.limit) * 100;
          return (
            <motion.div 
              key={budget.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg ${budget.color}/10 flex items-center justify-center`}>
                  <Wallet className={`w-5 h-5 ${budget.color.replace('bg-', 'text-')}`} />
                </div>
                <span className={`text-xs font-bold ${percent > 90 ? 'text-warning' : 'text-slate-400'}`}>
                  {Math.round(percent)}%
                </span>
              </div>
              <h4 className="text-slate-900 font-bold mb-1">{budget.category}</h4>
              <p className="text-xs text-slate-500 mb-4">₹{(budget.spent || 0).toLocaleString()} of ₹{(budget.limit || 0).toLocaleString()}</p>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percent, 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                  className={`h-full ${percent > 100 ? 'bg-warning' : budget.color}`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card">
          <h3 className="text-slate-900 font-bold mb-6">Budget vs Actual</h3>
          <div className="space-y-6">
            {budgets.map((budget) => (
              <div key={budget.category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-700 font-medium">{budget.category}</span>
                  <span className="text-slate-500 font-bold">₹{(budget.spent || 0).toLocaleString()} / ₹{(budget.limit || 0).toLocaleString()}</span>
                </div>
                <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-slate-200 w-full opacity-50" />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((budget.spent / budget.limit) * 100, 100)}%` }}
                    className={`absolute top-0 left-0 h-full ${budget.spent > budget.limit ? 'bg-warning' : budget.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card bg-accent/5 border-accent/10">
          <h3 className="text-slate-900 font-bold mb-4">Budget Insights</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="p-2 rounded-lg bg-warning/10 text-warning h-fit">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Spending Alert</p>
                <p className="text-xs text-slate-500">
                  {budgets.some(b => (b.spent / b.limit) > 0.9) 
                    ? "You're close to exceeding one or more budgets." 
                    : "Your spending is well within limits."}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="p-2 rounded-lg bg-success/10 text-success h-fit">
                <ArrowDownRight className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Savings Potential</p>
                <p className="text-xs text-slate-500">You can save ₹{(budgets.reduce((acc, b) => acc + Math.max(0, (b.limit || 0) - (b.spent || 0)), 0)).toLocaleString()} more this month.</p>
              </div>
            </div>
          </div>
          <button className="w-full mt-6 py-2 rounded-xl border border-accent text-accent text-sm font-bold hover:bg-accent hover:text-white transition-all">
            Optimize Budgets
          </button>
        </div>
      </div>

      {/* Add Budget Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                    <PieChart className="text-accent w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Set Budget</h3>
                </div>
                <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-900">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Category</label>
                  <select 
                    value={newBudget.category}
                    onChange={(e) => setNewBudget(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:border-accent/50"
                  >
                    <option value="Food">Food</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Bills">Bills</option>
                    <option value="Travel">Travel</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Monthly Limit (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="number" 
                      placeholder="0.00"
                      value={newBudget.limit}
                      onChange={(e) => setNewBudget(prev => ({ ...prev, limit: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-accent/50"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button 
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddBudget}
                  disabled={!newBudget.limit}
                  className="flex-1 py-3 rounded-xl bg-accent text-white font-bold hover:scale-105 transition-all shadow-lg shadow-accent/20 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" /> Save Budget
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
