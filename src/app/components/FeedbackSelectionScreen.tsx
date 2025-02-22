'use client';

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

export interface FeedbackOption {
  id: string;
  label: string;
  description: string;
}

interface FeedbackSelectionScreenProps {
  onFeedbackSubmit: (selectedOptions: string[]) => void;
}

const feedbackOptions: FeedbackOption[] = [
  {
    id: 'increase-protein',
    label: 'Increase Protein',
    description: 'Get suggestions to boost protein content in your meal'
  },
  {
    id: 'increase-fiber',
    label: 'Increase Fiber',
    description: 'Learn how to add more fiber to your meal'
  },
  {
    id: 'whole30',
    label: 'Make Whole30 Compliant',
    description: 'Adapt your meal to meet Whole30 requirements'
  },
  {
    id: 'reduce-calories',
    label: 'Reduce Calories',
    description: 'Get tips to make your meal lower in calories'
  },
  {
    id: 'fat-loss',
    label: 'Support Fat Loss',
    description: 'Optimize your meal for fat loss goals'
  },
  {
    id: 'strength-gains',
    label: 'Support Strength Gains',
    description: 'Enhance your meal for muscle building'
  }
];

export default function FeedbackSelectionScreen({ onFeedbackSubmit }: FeedbackSelectionScreenProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      }
      if (prev.length < 2) {
        return [...prev, optionId];
      }
      return prev;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOptions.length > 0) {
      onFeedbackSubmit(selectedOptions);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-4">Select Feedback Type</h2>
      <p className="text-center text-gray-600 mb-8">Choose up to two types of feedback for your meal</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feedbackOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => toggleOption(option.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left
                ${selectedOptions.includes(option.id)
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 hover:border-blue-200 dark:border-gray-700'
                }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-1 rounded-full transition-colors
                  ${selectedOptions.includes(option.id)
                    ? 'text-blue-500'
                    : 'text-gray-300'
                  }`}
                >
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{option.label}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={selectedOptions.length === 0}
          className="w-full py-3 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Get Feedback
        </button>
      </form>
    </div>
  );
} 