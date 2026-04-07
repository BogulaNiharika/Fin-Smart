import React from 'react';
import { LayoutDashboard, Receipt, BrainCircuit, Target, Settings, LogOut, FileText, PieChart, BarChart3 } from 'lucide-react';
import { cn } from '../types';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: Receipt, label: 'Transactions' },
  { icon: FileText, label: 'Bills' },
  { icon: Target, label: 'Goals' },
  { icon: PieChart, label: 'Budgets' },
  { icon: BarChart3, label: 'Reports' },
  { icon: BrainCircuit, label: 'Insights' },
  { icon: Settings, label: 'Settings' },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col p-6 fixed left-0 top-0">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
          <BrainCircuit className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Fin-Smart</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => setActiveTab(item.label)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              activeTab === item.label 
                ? "bg-accent text-white shadow-lg shadow-accent/20" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <item.icon className={cn("w-5 h-5", activeTab === item.label ? "text-white" : "group-hover:text-slate-900")} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
