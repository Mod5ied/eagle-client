"use client";
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '@store/index';
import { ToastProvider } from '@components/ui/toast';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ToastProvider>{children}</ToastProvider>
    </Provider>
  );
}
