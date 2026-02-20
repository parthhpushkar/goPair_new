'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(30, 30, 50, 0.9)',
            backdropFilter: 'blur(16px)',
            color: '#e2e8f0',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
          },
          success: {
            iconTheme: {
              primary: '#29a7ff',
              secondary: '#0d0d15',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#0d0d15',
            },
          },
        }}
      />
    </SessionProvider>
  );
}
