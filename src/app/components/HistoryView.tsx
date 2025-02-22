'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useAI, HistoryEntry } from '../lib/contexts/AIContext';

export default function HistoryView() {
  const { history, clearHistory } = useAI();
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

  // Group history entries by date
  const groupedHistory = history.reduce((acc, entry) => {
    const date = entry.date.split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, HistoryEntry[]>);

  const toggleDate = (date: string) => {
    setExpandedDates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(date)) {
        newSet.delete(date);
      } else {
        newSet.add(date);
      }
      return newSet;
    });
  };

  if (history.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        No feedback history available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedHistory)
        .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
        .map(([date, entries]) => (
          <div key={date} className="border rounded-lg dark:border-gray-700">
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                 onClick={() => toggleDate(date)}>
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {format(new Date(date), 'MMMM d, yyyy')}
                </span>
                <span className="text-sm text-gray-500">
                  ({entries.length} {entries.length === 1 ? 'entry' : 'entries'})
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearHistory(date);
                  }}
                  className="p-1 hover:text-red-500 transition-colors"
                  title="Clear history for this date"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {expandedDates.has(date) ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            </div>
            
            {expandedDates.has(date) && (
              <div className="border-t dark:border-gray-700 divide-y dark:divide-gray-700">
                {entries.map((entry) => (
                  <div key={entry.id} className="p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-sm text-gray-500">
                          {format(new Date(entry.date), 'h:mm a')}
                        </span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-sm font-medium capitalize">
                          {entry.inputMethod.replace('-', ' ')}
                        </span>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 capitalize">
                        {entry.provider}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Feedback Types: </span>
                      {entry.feedbackTypes.map(type => (
                        <span key={type} className="inline-block px-2 py-1 mr-1 mb-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                          {type}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                      {entry.response}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
    </div>
  );
} 