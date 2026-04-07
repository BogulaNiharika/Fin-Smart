import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'motion/react';

const data = [
  { name: 'Mon', amount: 400 },
  { name: 'Tue', amount: 300 },
  { name: 'Wed', amount: 600 },
  { name: 'Thu', amount: 800 },
  { name: 'Fri', amount: 500 },
  { name: 'Sat', amount: 900 },
  { name: 'Sun', amount: 700 },
];

export default function SpendingChart() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card flex-1"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-slate-900 font-bold text-lg">Weekly Spending</h3>
          <p className="text-slate-500 text-sm">Your spending patterns over the last 7 days.</p>
        </div>
        <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-sm text-slate-600 focus:outline-none">
          <option>This Week</option>
          <option>Last Week</option>
        </select>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <Tooltip 
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e2e8f0', 
                borderRadius: '12px',
                color: '#0f172a',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
              }}
            />
            <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={32}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.amount > 700 ? '#6366F1' : '#6366F140'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
