import React from 'react';
import { motion } from 'motion/react';
import { MoodLog } from '../types';
import { Smile, Frown, Meh, Heart, Zap, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface MoodTrackerProps {
  logs: MoodLog[];
  onLogMood: (mood: MoodLog['mood']) => void;
}

const moodIcons = {
  happy: { icon: Smile, color: 'text-success bg-success/10', emoji: '😊' },
  excited: { icon: Zap, color: 'text-warning bg-warning/10', emoji: '🤩' },
  neutral: { icon: Meh, color: 'text-slate-400 bg-slate-100', emoji: '😐' },
  stressed: { icon: AlertCircle, color: 'text-warning bg-warning/10', emoji: '😫' },
  sad: { icon: Frown, color: 'text-danger bg-danger/10', emoji: '😔' },
};

export default function MoodTracker({ logs, onLogMood }: MoodTrackerProps) {
  // Correlate mood with spending
  const correlationData = logs.map(log => ({
    date: log.date,
    spending: log.spending_amount,
    moodScore: log.mood === 'happy' || log.mood === 'excited' ? 2 : log.mood === 'neutral' ? 1 : 0,
    mood: log.mood
  }));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-pink-500/10 rounded-xl flex items-center justify-center">
            <Heart className="text-pink-500 w-6 h-6" />
          </div>
          <h3 className="text-slate-900 font-bold text-lg">Mood vs Spending Tracker</h3>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Log Today's Mood</span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3 mb-8">
        {(Object.keys(moodIcons) as Array<keyof typeof moodIcons>).map((mood) => {
          const { icon: Icon, color, emoji } = moodIcons[mood];
          return (
            <button
              key={mood}
              onClick={() => onLogMood(mood)}
              className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all hover:scale-105 active:scale-95 ${color} border-transparent hover:border-current/20`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{mood}</span>
            </button>
          );
        })}
      </div>

      <div className="h-[200px] w-full mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={correlationData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="date" hide />
            <YAxis hide />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{moodIcons[data.mood as keyof typeof moodIcons].emoji}</span>
                        <span className="text-slate-900 font-bold text-sm capitalize">{data.mood}</span>
                      </div>
                      <p className="text-slate-500 text-xs font-medium">Spent: ₹{data.spending}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="spending" radius={[4, 4, 0, 0]}>
              {correlationData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.mood === 'happy' || entry.mood === 'excited' ? '#22c55e' : entry.mood === 'stressed' || entry.mood === 'sad' ? '#ef4444' : '#94a3b8'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-pink-50 rounded-2xl p-4 border border-pink-100">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm">
            <Zap className="text-pink-500 w-4 h-4" />
          </div>
          <div>
            <h4 className="text-pink-900 font-bold text-xs mb-1">Emotional Spending Insight</h4>
            <p className="text-pink-700 text-[11px] leading-relaxed">
              You tend to spend 25% more on "Food" when you're feeling <span className="font-bold underline">stressed</span>. Try a 5-minute walk before ordering next time!
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
