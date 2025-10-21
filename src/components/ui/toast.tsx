"use client";
import React, { useCallback, useContext, useRef, useState } from 'react';
import { cn } from '@lib/utils';
import { Button } from './button';

export type ToastVariant = 'success' | 'error' | 'info';
export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  persistent?: boolean;
  createdAt: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  toast: (opts: Omit<ToastItem, 'id' | 'createdAt'>) => void;
  dismiss: (id: string) => void;
  clear: () => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counterRef = useRef(0);

  const toast = useCallback((opts: Omit<ToastItem, 'id' | 'createdAt'>) => {
    counterRef.current += 1;
    const id = String(counterRef.current);
    const item: ToastItem = { id, createdAt: Date.now(), ...opts };
    setToasts((prev) => [...prev, item]);
    if (!opts.persistent) {
      const ttl = opts.variant === 'error' ? 7000 : 3500;
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, ttl);
    }
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clear = useCallback(() => setToasts([]), []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss, clear }}>
      {children}
      <ToastViewport />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

function variantClasses(variant: ToastVariant) {
  switch (variant) {
    case 'success':
      return 'border-cerulean-500 bg-cerulean-50 text-cerulean-800';
    case 'error':
      return 'border-red-500 bg-red-50 text-red-700';
    default:
      return 'border-cerulean-400 bg-white text-cerulean-900';
  }
}

function ToastViewport() {
  const ctx = useContext(ToastContext);
  if (!ctx) return null;
  return (
    <div aria-live="polite" className="fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2">
      {ctx.toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'group relative overflow-hidden rounded-md border shadow-sm backdrop-blur-sm transition-all animate-in fade-in slide-in-from-bottom',
            variantClasses(t.variant)
          )}
        >
          <div className="p-3 text-sm leading-relaxed pr-10">{t.message}</div>
          <Button
            aria-label="Dismiss notification"
            variant="ghost"
            size="sm"
            className="absolute top-1 right-1 h-6 px-2 text-xs opacity-60 hover:opacity-100"
            onClick={() => ctx.dismiss(t.id)}
          >
            ✕
          </Button>
        </div>
      ))}
    </div>
  );
}
