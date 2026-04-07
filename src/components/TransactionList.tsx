import React from 'react';
import { motion } from 'motion/react';
import { Transaction } from '../types';
import { ShoppingBag, Coffee, CreditCard, Smartphone, MoreHorizontal } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onViewAll?: () => void;
}

const categoryIcons = {
  Food: { icon: Coffee, color: 'bg-orange-500/20 text-orange-500' },
  Shopping: { icon: ShoppingBag, color: 'bg-purple-500/20 text-purple-500' },
  Bills: { icon: Smartphone, color: 'bg-blue-500/20 text-blue-500' },
  Travel: { icon: CreditCard, color: 'bg-green-500/20 text-green-500' },
  Others: { icon: MoreHorizontal, color: 'bg-gray-500/20 text-gray-500' },
};

export default function TransactionList({ transactions, onViewAll }: TransactionListProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-slate-900 font-bold text-lg">Recent Transactions</h3>
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="text-accent text-sm font-medium hover:underline"
          >
            View All
          </button>
        )}
      </div>

      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-slate-400 text-sm">No transactions yet</p>
          </div>
        ) : (
          transactions.map((tx, i) => {
            const cat = categoryIcons[tx.category] || categoryIcons.Others;
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cat.color}`}>
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-slate-900 font-medium">{tx.merchant}</p>
                    <p className="text-slate-500 text-xs">{tx.date} • {tx.payment_type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-slate-900 font-bold">₹{tx.amount}</p>
                  <p className={`text-xs ${tx.category === 'Bills' ? 'text-warning' : 'text-slate-400'}`}>
                    {tx.category}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
