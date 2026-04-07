import React, { useState } from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  userName: string;
  onLogout: () => void;
  onNavigate: (tab: string) => void;
}

export default function Header({ userName, onLogout, onNavigate }: HeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="h-20 flex items-center justify-between px-8 border-b border-slate-200 sticky top-0 z-10 bg-white/80 backdrop-blur-xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Good Evening, {userName}</h2>
        <p className="text-slate-500 text-sm font-medium">Here's what's happening with your money today.</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 pl-4 border-l border-slate-200 group hover:opacity-80 transition-all"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 group-hover:text-accent transition-colors">{userName}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Premium Member</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shadow-lg shadow-accent/5 group-hover:bg-accent group-hover:border-accent transition-all">
              <User className="text-accent w-6 h-6 group-hover:text-white transition-colors" />
            </div>
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowProfileMenu(false)} 
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Account</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{userName}</p>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={() => {
                        onNavigate('Settings');
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                    >
                      <User className="w-4 h-4" />
                      View Profile
                    </button>
                    <button 
                      onClick={() => {
                        onNavigate('Settings');
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                    >
                      <Settings className="w-4 h-4" />
                      Account Settings
                    </button>
                    <div className="h-px bg-slate-100 my-2" />
                    <button 
                      onClick={onLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-warning hover:bg-warning/10 transition-all font-bold"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
