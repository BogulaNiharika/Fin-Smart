import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Transaction {
  id?: string;
  user_id?: string;
  amount: number;
  date: string;
  merchant: string;
  category: 'Food' | 'Travel' | 'Shopping' | 'Bills' | 'Others';
  payment_type: 'UPI' | 'Card' | 'Cash' | 'Bank';
}

export interface Insight {
  id?: string;
  user_id?: string;
  type: 'alert' | 'suggestion' | 'prediction';
  message: string;
  created_at: string;
}

export interface Goal {
  id?: string;
  user_id?: string;
  target_amount: number;
  current_progress: number;
  deadline: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  financial_score: number;
  personality_type: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'yearly';
  last_payment: string;
  category: string;
  status: 'active' | 'unused' | 'suggested_cancel';
}

export interface MoodLog {
  id: string;
  date: string;
  mood: 'happy' | 'stressed' | 'neutral' | 'sad' | 'excited';
  spending_amount: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface SpendingExplanation {
  category: string;
  change_percentage: number;
  reason: string;
  details: string[];
}

export interface SimulationPoint {
  month: string;
  projected_savings: number;
  pessimistic: number;
  optimistic: number;
}

export interface AIAnalysisResponse {
  transactions: Transaction[];
  insights: Insight[];
  score: number;
  personality: string;
  predictions: string[];
  spendingExplanations?: SpendingExplanation[];
  subscriptions?: Subscription[];
}
