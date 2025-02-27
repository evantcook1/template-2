'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type AIProvider = 'gemini';
export type HistoryEntry = {
  id: string;
  date: string;
  inputMethod: string;
  inputData: string;
  feedbackTypes: string[];
  response: string;
  provider: AIProvider;
};

interface AIContextType {
  history: HistoryEntry[];
  addToHistory: (entry: Omit<HistoryEntry, 'id' | 'date'>) => void;
  clearHistory: (date?: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  // MODIFIED: Added try/catch to safely access localStorage
  // This prevents deployment failures when localStorage is not available
  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('nutritionAppHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (err) {
      console.warn('Failed to load history from localStorage:', err);
      // Don't set error state to avoid UI disruption
    }
  }, []);

  // MODIFIED: Added try/catch to safely update localStorage
  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('nutritionAppHistory', JSON.stringify(history));
    } catch (err) {
      console.warn('Failed to save history to localStorage:', err);
      // Don't set error state to avoid UI disruption
    }
  }, [history]);

  // MODIFIED: Added try/catch for localStorage operations in addToHistory
  const addToHistory = (entry: Omit<HistoryEntry, 'id' | 'date'>) => {
    try {
      const newEntry: HistoryEntry = {
        ...entry,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
      };
      setHistory((prev) => [newEntry, ...prev]);
    } catch (err) {
      console.error('Error adding to history:', err);
      setError('Failed to save history. Please try again.');
    }
  };

  // MODIFIED: Added try/catch for localStorage operations in clearHistory
  const clearHistory = (date?: string) => {
    try {
      if (date) {
        setHistory((prev) => prev.filter((entry) => !entry.date.startsWith(date)));
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error('Error clearing history:', err);
      setError('Failed to clear history. Please try again.');
    }
  };

  return (
    <AIContext.Provider
      value={{
        history,
        addToHistory,
        clearHistory,
        error,
        setError,
      }}
    >
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
} 