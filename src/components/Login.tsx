import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, Mail, Lock, ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface LoginProps {
  onLogin: (name: string, email: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(name || email, email || 'john@example.com');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[480px] relative z-10"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center shadow-xl shadow-accent/20 mb-4"
          >
            <BrainCircuit className="text-white w-9 h-9" />
          </motion.div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Fin-Smart</h1>
          <p className="text-slate-500 font-medium mt-1">Smart Financial Management</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[32px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden">
          {/* Subtle top accent line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-accent to-indigo-400" />

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h3>
            <p className="text-slate-500 text-sm">
              {isLogin 
                ? 'Enter your credentials to access your account' 
                : 'Start your journey to financial freedom today'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative">
                    <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                {isLogin && (
                  <button type="button" className="text-xs font-bold text-accent hover:text-accent/80 transition-colors">
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-accent text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-accent/20 hover:bg-accent/90 hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-4"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-500 text-sm">
              {isLogin ? "New to Fin-Smart?" : "Already have an account?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 font-bold text-accent hover:text-accent/80 transition-colors"
              >
                {isLogin ? 'Create an account' : 'Sign in instead'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex justify-center gap-6 text-xs font-medium text-slate-400">
          <button className="hover:text-slate-600 transition-colors">Privacy Policy</button>
          <button className="hover:text-slate-600 transition-colors">Terms of Service</button>
          <button className="hover:text-slate-600 transition-colors">Help Center</button>
        </div>
      </motion.div>
    </div>
  );
}
