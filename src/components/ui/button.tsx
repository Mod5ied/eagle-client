"use client";
import * as React from 'react';
import { cn } from '@lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

const base = 'inline-flex items-center justify-center font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-md transition-colors';
const variants: Record<string, string> = {
  default: 'bg-cerulean hover:bg-cerulean-dark text-white ring-cerulean-dark',
  outline: 'border border-cerulean text-cerulean hover:bg-cerulean/10 ring-cerulean',
  ghost: 'hover:bg-cerulean/10 text-cerulean',
  destructive: 'bg-red-600 hover:bg-red-700 text-white ring-red-700'
};
const sizes: Record<string, string> = {
  sm: 'text-sm h-8 px-3',
  md: 'text-sm h-10 px-4',
  lg: 'text-base h-12 px-6'
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => (
    <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props} />
  )
);
Button.displayName = 'Button';
