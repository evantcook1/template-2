'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-6 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          © 2025 Meal Mentor. All Rights Reserved.
        </div>
        <div className="mt-4 md:mt-0">
          <nav className="flex space-x-6">
            <Link 
              href="/disclaimer" 
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Disclaimer
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
} 