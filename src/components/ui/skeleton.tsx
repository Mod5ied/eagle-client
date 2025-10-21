"use client";
import React from 'react';
import { cn } from '@lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shimmer?: boolean;
}

export function Skeleton({ className, shimmer = true, ...rest }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-md bg-cerulean/10 relative overflow-hidden',
        shimmer && 'after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_1.2s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/40 after:to-transparent',
        className
      )}
      {...rest}
    />
  );
}

// Tailwind keyframes via global CSS: if not present we can add fallback inline animation.