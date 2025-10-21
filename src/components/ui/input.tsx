"use client";
import * as React from 'react';
import { cn } from '@lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn('flex h-10 w-full rounded-md border border-cerulean/40 bg-white/90 px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cerulean focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', className)}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
