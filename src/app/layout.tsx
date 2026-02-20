import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'goPair — Share Rides, Save Money, Reduce Emissions',
  description:
    'goPair is a modern carpooling platform that connects drivers and passengers heading the same way. Save money, reduce traffic, and help the environment.',
  keywords: ['carpooling', 'rideshare', 'goPair', 'ride sharing', 'commute'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {/* Ambient glow effects */}
          <div className="ambient-glow ambient-glow-1" />
          <div className="ambient-glow ambient-glow-2" />

          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
