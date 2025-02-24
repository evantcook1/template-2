'use client';

import { useState } from 'react';
import { useCompletion } from 'ai/react';
import { useAI } from './lib/contexts/AIContext';
import InputSelectionScreen from './components/InputSelectionScreen';
import FeedbackSelectionScreen from './components/FeedbackSelectionScreen';
import LoadingIndicator from './components/LoadingIndicator';
import ErrorMessage from './components/ErrorMessage';
import HistoryView from './components/HistoryView';

type InputMethod = 'meal-image' | 'recipe-image' | 'meal-text' | 'recipe-text';
type AppState = 'input' | 'feedback' | 'loading' | 'results' | 'history';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('input');
  const [inputData, setInputData] = useState<{ method: InputMethod; data: string | File } | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<string[]>([]);
  const { addToHistory, error, setError } = useAI();

  const { complete, completion, isLoading } = useCompletion({
    api: '/api/feedback',
    body: {
      provider: 'gemini'
    },
    onError: (error) => {
      setError(error.message);
      setAppState('input');
    },
  });

  const handleInputSubmit = async (method: InputMethod, data: string | File) => {
    setInputData({ method, data });
    setAppState('feedback');
  };

  const handleFeedbackSubmit = async (feedbackTypes: string[]) => {
    setSelectedFeedback(feedbackTypes);
    setAppState('loading');
    setError(null);
    
    try {
      const response = await complete('', {
        body: {
          text: inputData?.method.includes('text') ? inputData.data as string : null,
          image: inputData?.method.includes('image') ? inputData.data as File : null,
          feedbackTypes
        }
      });

      if (response) {
        addToHistory({
          inputMethod: inputData?.method || '',
          inputData: typeof inputData?.data === 'string' ? inputData.data : 'Image Upload',
          feedbackTypes,
          response,
          provider: 'gemini'
        });
      }

      setAppState('results');
    } catch (error) {
      console.error('Error getting feedback:', error);
      setError('Failed to get feedback. Please try again.');
      setAppState('input');
    }
  };

  const handleReset = () => {
    setAppState('input');
    setInputData(null);
    setSelectedFeedback([]);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header Actions */}
        <div className="w-full max-w-4xl mx-auto mb-8">
          <div className="flex justify-between items-center">
            {appState !== 'input' && appState !== 'history' && (
              <button
                onClick={handleReset}
                className="px-4 py-2 text-gray-500 hover:text-gray-600 transition-colors"
              >
                Start Over
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <ErrorMessage
            message={error}
            onRetry={handleReset}
            onDismiss={() => setError(null)}
          />
        )}

        {/* Main Content */}
        {appState === 'input' && (
          <InputSelectionScreen onInputSubmit={handleInputSubmit} setAppState={setAppState} />
        )}

        {appState === 'feedback' && (
          <FeedbackSelectionScreen onFeedbackSubmit={handleFeedbackSubmit} />
        )}

        {(appState === 'loading' || isLoading) && (
          <LoadingIndicator message="Analyzing your meal and generating feedback..." />
        )}

        {appState === 'results' && completion && (
          <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Your Feedback</h2>
            <div className="prose dark:prose-invert max-w-none mb-6">
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{completion}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Start Over
              </button>
              <button
                onClick={() => setAppState('history')}
                className="px-6 py-2 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                View History
              </button>
            </div>
          </div>
        )}

        {appState === 'history' && (
          <div className="w-full max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Feedback History</h2>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-blue-500 hover:text-blue-600 transition-colors"
              >
                New Feedback
              </button>
            </div>
            <HistoryView />
          </div>
        )}
      </div>
    </main>
  );
}
