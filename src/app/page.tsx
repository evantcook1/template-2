'use client';

import { useState } from 'react';
import { useCompletion } from 'ai/react';
import { useAI } from '@/lib/contexts/AIContext';
import InputSelectionScreen from './components/InputSelectionScreen';
import FeedbackSelectionScreen from './components/FeedbackSelectionScreen';
import LoadingIndicator from './components/LoadingIndicator';
import ErrorMessage from './components/ErrorMessage';
import HistoryView from './components/HistoryView';
import ResultsView from './components/ResultsView';

/**
 * Type representing the different methods of input for meal analysis
 * @typedef {'meal-image' | 'recipe-image' | 'meal-text' | 'recipe-text'} InputMethod
 */
type InputMethod = 'meal-image' | 'recipe-image' | 'meal-text' | 'recipe-text';

/**
 * Type representing the different states of the application
 * @typedef {'input' | 'feedback' | 'loading' | 'results' | 'history'} AppState
 */
type AppState = 'input' | 'feedback' | 'loading' | 'results' | 'history';

/**
 * Home component - The main page of the Meal Mentor application
 * 
 * This component manages the application state and orchestrates the flow between
 * different screens: input selection, feedback selection, loading, results, and history.
 * 
 * @returns {JSX.Element} The rendered Home component
 */
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

  /**
   * Handles the submission of input data (meal/recipe image or text)
   * 
   * @param {InputMethod} method - The method of input (meal-image, recipe-image, meal-text, recipe-text)
   * @param {string | File} data - The input data, either a text description or a File object
   */
  const handleInputSubmit = async (method: InputMethod, data: string | File) => {
    setInputData({ method, data });
    setAppState('feedback');
  };

  /**
   * Handles the submission of selected feedback types
   * Processes the input data and sends it to the API for analysis
   * 
   * @param {string[]} feedbackTypes - Array of selected feedback type IDs
   */
  const handleFeedbackSubmit = async (feedbackTypes: string[]) => {
    setSelectedFeedback(feedbackTypes);
    setAppState('loading');
    setError(null);
    
    try {
      // Convert image file to base64 string if it exists
      let imageBase64 = null;
      if (inputData?.method.includes('image') && inputData.data instanceof File) {
        imageBase64 = await fileToBase64(inputData.data as File);
      }

      const response = await complete('', {
        body: {
          text: inputData?.method.includes('text') ? inputData.data as string : null,
          image: imageBase64,
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

  /**
   * Converts a File object to a base64 string
   * 
   * @param {File} file - The File object to convert
   * @returns {Promise<string>} A promise that resolves to the base64 string representation of the file
   */
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Content = base64String.split(',')[1];
        resolve(base64Content);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  /**
   * Resets the application state to the initial input screen
   * Clears all input data, selected feedback types, and errors
   */
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
          <ResultsView 
            response={completion} 
            onBack={handleReset}
          />
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
