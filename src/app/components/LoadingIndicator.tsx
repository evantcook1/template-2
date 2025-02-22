'use client';

interface LoadingIndicatorProps {
  message?: string;
}

export default function LoadingIndicator({ message = 'Processing your request...' }: LoadingIndicatorProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
      <p className="mt-4 text-gray-600 dark:text-gray-400 text-center">{message}</p>
    </div>
  );
} 