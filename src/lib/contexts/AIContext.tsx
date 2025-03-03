'use client';

import { createContext, useContext, useEffect, useState } from 'react';

/**
 * Type representing the supported AI providers
 * Currently only supports 'gemini'
 */
export type AIProvider = 'gemini';

/**
 * Type representing an entry in the AI feedback history
 */
export type HistoryEntry = {
  /** Unique identifier for the history entry */
  id: string;
  /** ISO timestamp of when the entry was created */
  date: string;
  /** The method used for input (meal-image, recipe-image, meal-text, recipe-text) */
  inputMethod: string;
  /** The input data (text description or 'Image Upload' for images) */
  inputData: string;
  /** Array of feedback type IDs that were selected */
  feedbackTypes: string[];
  /** The AI-generated response */
  response: string;
  /** The AI provider used to generate the response */
  provider: AIProvider;
};

/**
 * Interface defining the shape of the AI context
 */
interface AIContextType {
  /** Array of history entries */
  history: HistoryEntry[];
  /** Function to add a new entry to the history */
  addToHistory: (entry: Omit<HistoryEntry, 'id' | 'date'>) => void;
  /** Function to clear history entries */
  clearHistory: (date?: string) => void;
  /** Current error message, if any */
  error: string | null;
  /** Function to set the error message */
  setError: (error: string | null) => void;
}

/**
 * Context for managing AI-related state
 * Initialized as undefined and properly set in the AIProvider
 */
const AIContext = createContext<AIContextType | undefined>(undefined);

/**
 * Provider component for the AI context
 * Manages history state and provides functions to interact with it
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} The AIProvider component
 */
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

  /**
   * Adds a new entry to the history
   * Generates a unique ID and timestamp for the entry
   * 
   * @param {Omit<HistoryEntry, 'id' | 'date'>} entry - The history entry to add (without id and date)
   */
  const addToHistory = (entry: Omit<HistoryEntry, 'id' | 'date'>) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };
    setHistory(prev => [newEntry, ...prev]);
  };

  /**
   * Clears history entries
   * If a date is provided, only clears entries with that date
   * Otherwise, clears all entries
   * 
   * @param {string} [date] - Optional date to filter entries to clear
   */
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

/**
 * Custom hook to access the AI context
 * Must be used within an AIProvider
 * 
 * @returns {AIContextType} The AI context
 * @throws {Error} If used outside of an AIProvider
 */
export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
} 