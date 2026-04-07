import React from 'react';
import { motion } from 'motion/react';
import { BarChart3, PieChart, TrendingUp, TrendingDown, Calendar, Download } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, PieChart as RePieChart, Pie } from 'recharts';

const data = [
  { name: 'Jan', income: 80000, expenses: 45000 },
  { name: 'Feb', income: 85000, expenses: 42000 },
  { name: 'Mar', income: 82000, expenses: 48000 },
  { name: 'Apr', income: 90000, expenses: 52000 },
  { name: 'May', income: 88000, expenses: 46000 },
  { name: 'Jun', income: 95000, expenses: 50000 },
];

const categoryData = [
  { name: 'Food', value: 12450, color: '#f97316' },
  { name: 'Shopping', value: 8200, color: '#a855f7' },
  { name: 'Bills', value: 24000, color: '#3b82f6' },
  { name: 'Travel', value: 1200, color: '#22c55e' },
  { name: 'Others', value: 4500, color: '#64748b' },
];

export default function Reports() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">Financial Reports</h3>
          <p className="text-slate-500 text-sm">Detailed analysis of your income and spending.</p>
        </div>
        <div className="flex gap-4">
          <button className="glass px-4 py-2 rounded-xl text-sm text-slate-600 hover:text-slate-900 transition-all flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Last 6 Months
          </button>
          <button className="bg-accent text-white px-6 py-2 rounded-xl font-bold hover:scale-105 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card">
          <h3 className="text-slate-900 font-bold mb-6">Income vs Expenses</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0f172a' }}
                />
                <Bar dataKey="income" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="expenses" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <h3 className="text-slate-900 font-bold mb-6">Spending by Category</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0f172a' }}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-3">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm text-slate-600">{cat.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">₹{(cat.value || 0).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card bg-success/5 border-success/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-success/10 text-success">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="text-slate-900 font-bold">Avg. Savings Rate</h4>
          </div>
          <p className="text-3xl font-bold text-slate-900">42%</p>
          <p className="text-xs text-slate-500 mt-2">+5% from last period</p>
        </div>
        <div className="glass-card bg-accent/5 border-accent/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-accent/10 text-accent">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="text-slate-900 font-bold">Total Net Worth</h4>
          </div>
          <p className="text-3xl font-bold text-slate-900">₹12,45,000</p>
          <p className="text-xs text-slate-500 mt-2">+₹1.2L this year</p>
        </div>
        <div className="glass-card bg-warning/5 border-warning/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-warning/10 text-warning">
              <TrendingDown className="w-5 h-5" />
            </div>
            <h4 className="text-slate-900 font-bold">Debt Ratio</h4>
          </div>
          <p className="text-3xl font-bold text-slate-900">12.5%</p>
          <p className="text-xs text-slate-500 mt-2">-2% from last month</p>
        </div>
      </div>
    </div>
  );
}
