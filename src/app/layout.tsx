import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AIProvider } from './lib/contexts/AIContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Nutritional Feedback App',
  description: 'Get personalized nutritional feedback for your meals and recipes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className={inter.className}>
        <AIProvider>
          {children}
        </AIProvider>
      </body>
    </html>
  );
}
