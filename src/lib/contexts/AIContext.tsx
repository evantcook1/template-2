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

  useEffect(() => {
    // Load history from localStorage on mount
    const savedHistory = localStorage.getItem('aiHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error loading history:', e);
      }
    }
  }, []);

  useEffect(() => {
    // Save history to localStorage whenever it changes
    localStorage.setItem('aiHistory', JSON.stringify(history));
  }, [history]);

  const addToHistory = (entry: Omit<HistoryEntry, 'id' | 'date'>) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };
    setHistory(prev => [newEntry, ...prev]);
  };

  const clearHistory = (date?: string) => {
    if (date) {
      setHistory(prev => prev.filter(entry => entry.date !== date));
    } else {
      setHistory([]);
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