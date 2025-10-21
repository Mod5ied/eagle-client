import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ToastProvider } from '../components/ui/toast';

// Mock next/navigation for App Router hooks
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() })
}));

// Mock useAuth hook to bypass Redux/RTK Query entirely
vi.mock('../libs/hooks/useAuth', () => ({
  useAuth: () => ({
    login: vi.fn(),
    loginState: { isLoading: false, isError: false },
    user: null,
    meLoading: false
  })
}));

import LoginPage from '../app/login/page';

describe('LoginPage', () => {
  it('renders login form', () => {
    render(
      <ToastProvider>
        <LoginPage />
      </ToastProvider>
    );
  expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });
});
