import { AuthProvider } from '@components/auth/AuthProvider'; 
import { Header } from '@components/layout/Header';
import React from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider> {/* <-- WRAP with AuthProvider */}
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
}