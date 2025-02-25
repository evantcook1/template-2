'use client';

import { useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';

interface ResultsViewProps {
  response: string;
  onBack: () => void;
}

export default function ResultsView({ response, onBack }: ResultsViewProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      // Process the response text to handle formatting
      let formattedContent = response
        // Replace markdown-style headers with styled divs
        .replace(/\*\*(.*?)\*\*/g, '<span class="font-semibold">$1</span>')
        // Convert bullet points to properly styled list items
        .replace(/\* (.*?)(?=(\n|$))/g, '<li class="mb-2">$1</li>')
        // Wrap lists in ul tags
        .replace(/((?:<li.*?>.*?<\/li>\n?)+)/g, '<ul class="list-none space-y-2 mb-4">$1</ul>')
        // Add spacing between sections
        .replace(/\n\n/g, '</div><div class="mb-6">');

      // Wrap in initial div
      formattedContent = `<div class="mb-6">${formattedContent}</div>`;
      
      contentRef.current.innerHTML = formattedContent;
    }
  }, [response]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Input</span>
      </button>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <div
          ref={contentRef}
          className="text-gray-800 dark:text-gray-200 space-y-4"
        />
      </div>
    </div>
  );
} 