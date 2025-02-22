'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface TestResult {
  status: boolean;
  message: string;
}

interface TestResults {
  openai: TestResult;
  google: TestResult;
}

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (error) {
      // Log the error or handle it appropriately
      console.error('Error in TestKeys component:', error);
    }
  }, [error]);

  if (hasError) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-200 rounded-lg">
        <h2>Something went wrong!</h2>
        <button
          onClick={() => setHasError(false)}
          className="mt-2 text-sm underline"
        >
          Try again
        </button>
      </div>
    );
  }

  try {
    return children;
  } catch (err) {
    setError(err instanceof Error ? err : new Error('Unknown error'));
    setHasError(true);
    return null;
  }
}

export default function TestKeys() {
  const [results, setResults] = useState<TestResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testKeys();
  }, []);

  const testKeys = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/test-keys');
      if (!response.ok) {
        throw new Error('Failed to test API keys');
      }
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">API Key Test Results</h1>
            
            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-200 rounded-lg">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                <span className="ml-2">Testing API keys...</span>
              </div>
            ) : results ? (
              <div className="space-y-4">
                {Object.entries(results).map(([provider, result]) => (
                  <div
                    key={provider}
                    className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
                  >
                    <div className="flex items-start gap-3">
                      {result.status ? (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      )}
                      <div>
                        <h2 className="font-medium capitalize">{provider} API</h2>
                        <p className={`text-sm mt-1 ${
                          result.status 
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {result.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={testKeys}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Test Again
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
} 