'use client';

import { useState } from 'react';
import { ImageIcon, FileTextIcon, MenuIcon, BookOpenIcon } from 'lucide-react';

type InputMethod = 'meal-image' | 'recipe-image' | 'meal-text' | 'recipe-text';

interface InputSelectionScreenProps {
  onInputSubmit: (method: InputMethod, data: string | File) => void;
  setAppState: (state: 'input' | 'feedback' | 'loading' | 'results' | 'history') => void;
}

export default function InputSelectionScreen({ onInputSubmit, setAppState }: InputSelectionScreenProps) {
  const [activeTab, setActiveTab] = useState<InputMethod>('meal-image');
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const tabs = [
    { id: 'meal-image' as InputMethod, label: 'Meal Photo', icon: ImageIcon },
    { id: 'recipe-image' as InputMethod, label: 'Recipe Photo', icon: BookOpenIcon },
    { id: 'meal-text' as InputMethod, label: 'Describe Meal', icon: MenuIcon },
    { id: 'recipe-text' as InputMethod, label: 'Write Recipe', icon: FileTextIcon },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab.includes('image') && selectedFile) {
      onInputSubmit(activeTab, selectedFile);
    } else if (activeTab.includes('text') && inputValue.trim()) {
      onInputSubmit(activeTab, inputValue);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-4">Meal Mentor</h1>
      <h2 className="text-xl text-center text-gray-600 dark:text-gray-400 mb-8">Get immediate food feedback on your meal or recipe</h2>
      
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setInputValue('');
              setSelectedFile(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all
              ${activeTab === tab.id 
                ? 'bg-[#2E8B57] text-white' 
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
              }`}
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {activeTab.includes('image') ? (
          <div className="flex flex-col items-center gap-4">
            <label 
              className="w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#2E8B57] transition-colors"
            >
              <ImageIcon className="w-12 h-12 mb-2 text-gray-400" />
              <span className="text-gray-500">Click to upload or drag and drop</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            {selectedFile && (
              <p className="text-sm text-gray-500">Selected: {selectedFile.name}</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={activeTab === 'meal-text' 
                ? "Describe your meal here..." 
                : "Write your recipe here..."
              }
              className="w-full h-64 p-4 rounded-lg border focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
            />
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            disabled={(!selectedFile && !inputValue.trim())}
            className="w-full py-3 px-6 bg-[#2E8B57] text-white rounded-lg hover:bg-[#267346] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Continue to Goal Selection
          </button>
          <button
            type="button"
            onClick={() => setAppState('history')}
            className="w-full py-3 px-6 bg-[#2E8B57] text-white rounded-lg hover:bg-[#267346] transition-colors"
          >
            View History
          </button>
        </div>
      </form>
    </div>
  );
} 