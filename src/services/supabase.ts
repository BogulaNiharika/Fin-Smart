import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

// If keys are missing, we'll use a mock client for demo purposes
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Mock data for demo when Supabase is not configured
export const mockTransactions = [
  { id: '1', amount: 500, date: '2026-04-01', merchant: 'Swiggy', category: 'Food', payment_type: 'UPI' },
  { id: '2', amount: 1200, date: '2026-04-02', merchant: 'Amazon Prime', category: 'Shopping', payment_type: 'Card' },
  { id: '3', amount: 3000, date: '2026-04-03', merchant: 'Airtel', category: 'Bills', payment_type: 'Bank' },
  { id: '4', amount: 150, date: '2026-03-31', merchant: 'Zomato', category: 'Food', payment_type: 'UPI' },
  { id: '5', amount: 2500, date: '2026-03-30', merchant: 'Uber', category: 'Travel', payment_type: 'Card' },
  { id: '6', amount: 999, date: '2026-03-28', merchant: 'Netflix', category: 'Bills', payment_type: 'Card' },
  { id: '7', amount: 199, date: '2026-03-25', merchant: 'Spotify', category: 'Bills', payment_type: 'UPI' },
];

export const mockInsights = [
  { type: 'alert', message: '⚠️ High spending anomaly detected in Food category (35% increase)' },
  { type: 'suggestion', message: '💡 Reduce dining expenses by ₹500/week to reach your ₹10,000 goal faster.' },
  { type: 'prediction', message: '📈 If this trend continues, your savings will drop by 20% this month.' },
  { type: 'alert', message: '🚨 Subscription Leak: You have 2 unused streaming services costing ₹1,198/mo.' },
];

export const mockUser = {
  name: 'John Doe',
  financial_score: 72,
  personality_type: 'Balanced User: You maintain a good mix of essential and non-essential spending, but your weekend dining is slightly high.'
};

export const mockSubscriptions = [
  { id: '1', name: 'Netflix', amount: 999, frequency: 'monthly', last_payment: '2026-03-28', category: 'Entertainment', status: 'active' },
  { id: '2', name: 'Spotify', amount: 199, frequency: 'monthly', last_payment: '2026-03-25', category: 'Music', status: 'suggested_cancel' },
  { id: '3', name: 'Amazon Prime', amount: 1499, frequency: 'yearly', last_payment: '2025-12-15', category: 'Shopping', status: 'active' },
  { id: '4', name: 'Disney+', amount: 299, frequency: 'monthly', last_payment: '2026-03-10', category: 'Entertainment', status: 'suggested_cancel' },
];

export const mockMoodLogs = [
  { id: '1', date: '2026-04-01', mood: 'happy', spending_amount: 500 },
  { id: '2', date: '2026-04-02', mood: 'stressed', spending_amount: 1200 },
  { id: '3', date: '2026-04-03', mood: 'neutral', spending_amount: 3000 },
  { id: '4', date: '2026-03-31', mood: 'sad', spending_amount: 150 },
  { id: '5', date: '2026-03-30', mood: 'excited', spending_amount: 2500 },
];

export const mockSimulationData = [
  { month: 'Apr', projected_savings: 12000, pessimistic: 10000, optimistic: 14000 },
  { month: 'May', projected_savings: 25000, pessimistic: 20000, optimistic: 30000 },
  { month: 'Jun', projected_savings: 38000, pessimistic: 30000, optimistic: 46000 },
  { month: 'Jul', projected_savings: 52000, pessimistic: 40000, optimistic: 64000 },
  { month: 'Aug', projected_savings: 65000, pessimistic: 50000, optimistic: 80000 },
  { month: 'Sep', projected_savings: 80000, pessimistic: 60000, optimistic: 100000 },
];

export const mockExplanations = [
  { 
    category: 'Food', 
    change_percentage: 15, 
    reason: 'Increased weekend dining and late-night orders.',
    details: [
      '5 weekend orders on Swiggy (Avg ₹600)',
      'Late-night snacks increased by 20%',
      'Dining out frequency up from 2 to 4 times/week'
    ]
  },
  { 
    category: 'Shopping', 
    change_percentage: -10, 
    reason: 'Reduced impulsive purchases during sales.',
    details: [
      'Skipped 2 flash sales on Amazon',
      'Average order value decreased by ₹300',
      'Wishlist conversion rate dropped by 15%'
    ]
  }
];
