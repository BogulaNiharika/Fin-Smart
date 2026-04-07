import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';
import { SimulationPoint } from '../types';
import { TrendingUp, Info } from 'lucide-react';

interface FutureSimulatorProps {
  data: SimulationPoint[];
  predictionText: string;
}

export default function FutureSimulator({ data, predictionText }: FutureSimulatorProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
            <TrendingUp className="text-accent w-6 h-6" />
          </div>
          <h3 className="text-slate-900 font-bold text-lg">AI Future Simulator</h3>
        </div>
        <div className="group relative">
          <Info className="w-5 h-5 text-slate-400 cursor-help" />
          <div className="absolute right-0 top-6 w-64 p-3 bg-slate-900 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
            Projections based on your current spending habits and historical data.
          </div>
        </div>
      </div>

      <div className="h-[250px] w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickFormatter={(value) => `₹${value/1000}k`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
              }}
            />
            <Area 
              type="monotone" 
              dataKey="projected_savings" 
              stroke="#6366f1" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorSavings)" 
            />
            <Area 
              type="monotone" 
              dataKey="optimistic" 
              stroke="#22c55e" 
              strokeWidth={1}
              strokeDasharray="5 5"
              fill="transparent"
            />
            <Area 
              type="monotone" 
              dataKey="pessimistic" 
              stroke="#ef4444" 
              strokeWidth={1}
              strokeDasharray="5 5"
              fill="transparent"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
        <p className="text-slate-600 text-sm leading-relaxed italic">
          "{predictionText}"
        </p>
      </div>
    </motion.div>
  );
}
