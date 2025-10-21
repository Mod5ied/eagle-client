"use client";
import { useAuth } from '@hooks/useAuth';
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function ProtectedShell({ children }: { children: ReactNode }) {
  const { user, meLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!meLoading && !user) {
      router.replace('/login');
    }
  }, [user, meLoading, router]);
  if (meLoading) return <div className="flex items-center justify-center h-screen"><p className="text-sm text-white/80">Checking session...</p></div>;
  if (!user) return null; // Redirecting
  return <>{children}</>;
}
