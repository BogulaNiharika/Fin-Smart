import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HealthScore from './components/HealthScore';
import SpendingChart from './components/SpendingChart';
import TransactionList from './components/TransactionList';
import AIInsights from './components/AIInsights';
import InputSection from './components/InputSection';
import BillUpload from './components/BillUpload';
import ManualTransaction from './components/ManualTransaction';
import Budgets from './components/Budgets';
import Reports from './components/Reports';
import Login from './components/Login';
import BankAccountSetup from './components/BankAccountSetup';
import FutureSimulator from './components/FutureSimulator';
import SpendingExplanation from './components/SpendingExplanation';
import SubscriptionLeak from './components/SubscriptionLeak';
import AICoachChat from './components/AICoachChat';
import MoodTracker from './components/MoodTracker';
import GoalAutoPilot from './components/GoalAutoPilot';
import { Transaction, Insight, AIAnalysisResponse, ChatMessage, MoodLog, Goal } from './types';
import { mockTransactions, mockInsights, mockUser, mockSubscriptions, mockMoodLogs, mockSimulationData, mockExplanations } from './services/supabase';
import { BrainCircuit, Sparkles, X, Target, Calendar, Wallet, Landmark, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isBankSetupComplete, setIsBankSetupComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions as Transaction[]);
  const [insights, setInsights] = useState<Insight[]>(mockInsights as Insight[]);
  const [score, setScore] = useState(mockUser.financial_score);
  const [personality, setPersonality] = useState(mockUser.personality_type);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  
  // New Feature States
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>(mockMoodLogs as MoodLog[]);
  const [subscriptions, setSubscriptions] = useState(mockSubscriptions);
  const [simulationData, setSimulationData] = useState(mockSimulationData);
  const [spendingExplanations, setSpendingExplanations] = useState(mockExplanations);

  const [userProfile, setUserProfile] = useState({
    name: mockUser.name,
    email: 'john@example.com',
    bankDetails: null as any
  });

  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', target_amount: 150000, current_progress: 85000, deadline: '2026-12-31' },
  ]);

  const [newGoalForm, setNewGoalForm] = useState({
    title: '',
    target: '',
    deadline: ''
  });

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Insight', message: 'Your food spending is up 15%', time: '2m ago', read: false },
    { id: 2, title: 'Goal Update', message: 'You are 56% closer to your MacBook Pro', time: '1h ago', read: false },
    { id: 3, title: 'Security', message: 'New login detected from Chrome on Windows', time: '3h ago', read: true },
  ]);

  const [settingsForm, setSettingsForm] = useState({
    name: userProfile.name,
    email: userProfile.email
  });

  const handleSaveSettings = () => {
    setUserProfile(prev => ({
      ...prev,
      name: settingsForm.name,
      email: settingsForm.email
    }));
    
    // Add a notification for saving
    const newNotif = {
      id: Date.now(),
      title: 'Settings Saved',
      message: 'Your profile has been updated successfully.',
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const [isAddingManual, setIsAddingManual] = useState(false);

  const handleAnalysisComplete = (data: AIAnalysisResponse) => {
    setTransactions(prev => [...data.transactions, ...prev].slice(0, 10));
    setInsights(data.insights);
    setScore(data.score);
    setPersonality(data.personality);
    setActiveTab('Dashboard'); // Switch to dashboard to see results
  };

  const handleLogin = (name: string, email: string) => {
    const profile = { ...userProfile, name, email };
    setUserProfile(profile);
    setSettingsForm({ name, email });
    setIsLoggedIn(true);
    // Add a welcome notification
    const welcomeNotif = {
      id: Date.now(),
      title: 'Welcome back!',
      message: `Good to see you again, ${name.split(' ')[0]}.`,
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [welcomeNotif, ...prev]);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsBankSetupComplete(false);
    setActiveTab('Dashboard');
  };

  const handleBankSetupComplete = (details: any) => {
    setUserProfile(prev => ({ ...prev, bankDetails: details }));
    setIsBankSetupComplete(true);
    
    // Add a notification for bank setup
    const bankNotif = {
      id: Date.now(),
      title: 'Bank Account Linked',
      message: `Successfully linked your ${details.bankName} account.`,
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [bankNotif, ...prev]);
  };

  const handleBankSetupSkip = () => {
    setIsBankSetupComplete(true);
  };

  const handleSendMessage = async (content: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString()
    };
    setChatMessages(prev => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const context = `
        User Profile: ${JSON.stringify(userProfile)}
        Financial Score: ${score}
        Personality: ${personality}
        Recent Transactions: ${JSON.stringify(transactions.slice(0, 5))}
        Goals: ${JSON.stringify(goals)}
        Subscriptions: ${JSON.stringify(subscriptions)}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: "user", parts: [{ text: `Context: ${context}\n\nUser Question: ${content}` }] }
        ],
        config: {
          systemInstruction: "You are Fin-Smart, a highly intelligent and empathetic financial coach. Use the provided context to give specific, actionable advice. Keep responses concise and professional."
        }
      });

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text || "I'm sorry, I couldn't process that request.",
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleLogMood = (mood: MoodLog['mood']) => {
    const newLog: MoodLog = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      mood,
      spending_amount: transactions.filter(tx => tx.date === new Date().toISOString().split('T')[0]).reduce((acc, tx) => acc + tx.amount, 0)
    };
    setMoodLogs(prev => [newLog, ...prev]);
  };

  const handleAddGoal = () => {
    if (!newGoalForm.title || !newGoalForm.target) return;
    const newGoal: Goal = {
      id: Date.now().toString(),
      target_amount: Number(newGoalForm.target),
      current_progress: 0,
      deadline: newGoalForm.deadline || '2026-12-31'
    };
    setGoals(prev => [...prev, newGoal]);
    setIsAddingGoal(false);
    setNewGoalForm({ title: '', target: '', deadline: '' });
    
    // Add a notification
    const newNotif = {
      id: Date.now(),
      title: 'Goal Created',
      message: `You've started a new goal!`,
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <div className="grid grid-cols-12 gap-8">
            {/* Left Column: Health & Charts */}
            <div className="col-span-12 lg:col-span-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <HealthScore score={score} />
                <div className="glass-card flex flex-col justify-center">
                  <h3 className="text-slate-500 font-medium mb-2">Total Balance</h3>
                  <p className="text-4xl font-bold text-slate-900 mb-4">₹42,500.00</p>
                  <div className="flex items-center gap-2 text-success text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    <span>+₹5,200 this month</span>
                  </div>
                  <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Income</p>
                      <p className="text-lg font-bold text-slate-900">₹85,000</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Expenses</p>
                      <p className="text-lg font-bold text-slate-900">₹42,500</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Future Simulator */}
              <FutureSimulator 
                data={simulationData} 
                predictionText="Based on your current savings rate, you'll reach your MacBook Pro goal 2 months earlier than planned!" 
              />
              
              <SpendingChart />

              {/* Mood vs Spending Tracker */}
              <MoodTracker logs={moodLogs} onLogMood={handleLogMood} />

              <TransactionList 
                transactions={transactions} 
                onViewAll={() => setActiveTab('Transactions')}
              />
            </div>

            {/* Right Column: AI Insights & New Features */}
            <div className="col-span-12 lg:col-span-4 space-y-8">
              {/* Goal Auto-Pilot Mode */}
              <GoalAutoPilot 
                goal={goals[0] as any} 
                safeToSpend={3500} 
                weeklyBudget={12000} 
              />

              <AIInsights insights={insights} personality={personality} />
              
              {/* Smart Spending Explanation */}
              <SpendingExplanation explanations={spendingExplanations as any} />

              {/* Subscription Leak Detector */}
              <SubscriptionLeak subscriptions={subscriptions as any} />
            </div>
          </div>
        );
      case 'Transactions':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-900">All Transactions</h3>
              <div className="flex gap-4">
                <button className="glass px-4 py-2 rounded-xl text-sm text-slate-600 hover:text-slate-900 transition-all">Filter</button>
                <button className="glass px-4 py-2 rounded-xl text-sm text-slate-600 hover:text-slate-900 transition-all">Export</button>
              </div>
            </div>
            <TransactionList transactions={transactions} />
          </div>
        );
      case 'Bills':
        if (isAddingManual) {
          return (
            <ManualTransaction 
              onSave={(tx) => {
                setTransactions(prev => [tx, ...prev]);
                setIsAddingManual(false);
                // Add a notification
                const newNotif = {
                  id: Date.now(),
                  title: 'Transaction Added',
                  message: `Manual expense for ${tx.merchant} (₹${tx.amount}) has been saved.`,
                  time: 'Just now',
                  read: false
                };
                setNotifications(prev => [newNotif, ...prev]);
              }} 
              onCancel={() => setIsAddingManual(false)}
              existingTransactions={transactions}
            />
          );
        }
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Bills & Expenses</h3>
                <p className="text-slate-500 text-sm">Upload a receipt or add details manually.</p>
              </div>
              <button 
                onClick={() => setIsAddingManual(true)}
                className="bg-accent px-6 py-2 rounded-xl text-sm font-bold text-white hover:scale-105 transition-all"
              >
                Add Manually
              </button>
            </div>
            <BillUpload 
              onSave={(tx) => {
                setTransactions(prev => [tx, ...prev]);
                // Add a notification
                const newNotif = {
                  id: Date.now(),
                  title: 'Bill Saved',
                  message: `Expense from ${tx.merchant} for ₹${tx.amount} has been added.`,
                  time: 'Just now',
                  read: false
                };
                setNotifications(prev => [newNotif, ...prev]);
              }} 
              existingTransactions={transactions}
            />

            <div className="pt-8 border-t border-slate-100">
              <TransactionList 
                transactions={transactions.filter(tx => tx.category === 'Bills')} 
                onViewAll={() => setActiveTab('Transactions')}
              />
            </div>
          </div>
        );
      case 'Insights':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AIInsights insights={insights} personality={personality} />
            <div className="space-y-8">
              <div className="glass-card">
                <h3 className="text-slate-900 font-bold mb-4">Spending Analysis</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Based on your recent activity, your spending in the 'Food' category has increased by 15% compared to last month. Consider setting a budget for dining out.
                </p>
              </div>
              <div className="glass-card">
                <h3 className="text-slate-900 font-bold mb-4">Monthly Forecast</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  You are projected to save ₹12,000 by the end of this month if you maintain your current spending habits.
                </p>
              </div>
            </div>
          </div>
        );
      case 'Budgets':
        return <Budgets />;
      case 'Reports':
        return <Reports />;
      case 'Goals':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {goals.map(goal => (
              <div key={goal.id} className="glass-card">
                <h3 className="text-slate-900 font-bold mb-4">Savings Goal</h3>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500">Progress</span>
                  <span className="text-slate-900 font-bold">{Math.round(((goal.current_progress || 0) / (goal.target_amount || 1)) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-accent" style={{ width: `${((goal.current_progress || 0) / (goal.target_amount || 1)) * 100}%` }} />
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-slate-500">Target: ₹{(goal.target_amount || 0).toLocaleString()}</p>
                  <p className="text-xs text-slate-400">{goal.deadline}</p>
                </div>
              </div>
            ))}
            <div 
              onClick={() => setIsAddingGoal(true)}
              className="glass-card border-dashed border-2 border-slate-200 flex flex-col items-center justify-center py-12 group cursor-pointer hover:border-accent/50 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-all">
                <Sparkles className="w-6 h-6 text-slate-400 group-hover:text-accent" />
              </div>
              <p className="text-slate-500 font-medium group-hover:text-slate-900">Create New Goal</p>
            </div>
          </div>
        );
      case 'Settings':
        return (
          <div className="max-w-2xl space-y-8">
            <div className="glass-card space-y-6">
              <h3 className="text-slate-900 font-bold text-lg">Profile Settings</h3>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-slate-500">Full Name</label>
                  <input 
                    type="text" 
                    value={settingsForm.name} 
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-accent/50" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-slate-500">Email Address</label>
                  <input 
                    type="email" 
                    value={settingsForm.email} 
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-accent/50" 
                  />
                </div>
              </div>
              <button 
                onClick={handleSaveSettings}
                className="bg-accent text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all"
              >
                Save Changes
              </button>
            </div>

            {userProfile.bankDetails && (
              <div className="glass-card space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Landmark className="text-accent w-6 h-6" />
                  </div>
                  <h3 className="text-slate-900 font-bold text-lg">Linked Bank Account</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bank Name</p>
                    <p className="text-slate-900 font-medium">{userProfile.bankDetails.bankName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Holder</p>
                    <p className="text-slate-900 font-medium">{userProfile.bankDetails.holderName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">IFSC Code</p>
                    <p className="text-slate-900 font-medium font-mono">{userProfile.bankDetails.ifscCode}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Branch</p>
                    <p className="text-slate-900 font-medium">{userProfile.bankDetails.branch}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => setIsBankSetupComplete(false)}
                    className="text-accent text-sm font-bold hover:underline"
                  >
                    Update Bank Details
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  if (!isBankSetupComplete) {
    return <BankAccountSetup onComplete={handleBankSetupComplete} onSkip={handleBankSetupSkip} />;
  }

  return (
    <div className="min-h-screen bg-primary flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 min-h-screen pb-20">
        <Header 
          userName={userProfile.name} 
          onLogout={handleLogout}
          onNavigate={setActiveTab}
        />
        
        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {showWelcome && activeTab === 'Dashboard' && (
              <motion.div 
                key="welcome"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <div className="glass-card bg-accent/5 border-accent/20 flex items-center gap-6 p-8">
                  <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center shadow-xl shadow-accent/20">
                    <Sparkles className="text-white w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome to Fin-Smart</h2>
                    <p className="text-slate-600">Your intelligent financial coach is ready. Paste your transaction SMS or upload a statement to get started.</p>
                  </div>
                  <button 
                    onClick={() => setShowWelcome(false)}
                    className="ml-auto text-slate-400 hover:text-slate-600 p-2"
                  >
                    <motion.div whileHover={{ rotate: 90 }}>
                      <BrainCircuit className="w-6 h-6" />
                    </motion.div>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </div>

        <AnimatePresence>
          {isAddingGoal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAddingGoal(false)}
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
                      <Target className="text-accent w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">New Goal</h3>
                  </div>
                  <button onClick={() => setIsAddingGoal(false)} className="text-slate-400 hover:text-slate-900">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Goal Title</label>
                    <div className="relative">
                      <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="e.g. Vacation Fund"
                        value={newGoalForm.title}
                        onChange={(e) => setNewGoalForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-accent/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Target Amount (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        value={newGoalForm.target}
                        onChange={(e) => setNewGoalForm(prev => ({ ...prev, target: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-accent/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Deadline</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="date" 
                        value={newGoalForm.deadline}
                        onChange={(e) => setNewGoalForm(prev => ({ ...prev, deadline: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-accent/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={() => setIsAddingGoal(false)}
                    className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddGoal}
                    className="flex-1 py-3 rounded-xl bg-accent text-white font-bold hover:scale-105 transition-all shadow-lg shadow-accent/20"
                  >
                    Create Goal
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <InputSection 
          onAnalysisComplete={handleAnalysisComplete} 
          onOpenBills={() => {
            setActiveTab('Bills');
            setIsAddingManual(false);
          }}
          onOpenManual={() => {
            setActiveTab('Bills');
            setIsAddingManual(true);
          }}
        />

        <AICoachChat 
          messages={chatMessages} 
          onSendMessage={handleSendMessage} 
          isLoading={isChatLoading} 
        />
      </main>
    </div>
  );
}
