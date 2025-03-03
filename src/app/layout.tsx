import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AIProvider } from '@/lib/contexts/AIContext';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import Footer from './components/Footer';
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col`}>
        <AuthProvider>
          <AIProvider>
            <main className="container mx-auto px-4 py-8 flex-grow">
              {children}
            </main>
            <Footer />
          </AIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
