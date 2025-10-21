import * as React from 'react';
import { cn } from '@lib/utils';

export function Card({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn('rounded-lg border border-cerulean/30 bg-white/90 backdrop-blur p-4 shadow-sm', className)}>{children}</div>;
}
export function CardHeader({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn('mb-2', className)}>{children}</div>;
}
export function CardTitle({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <h3 className={cn('text-lg font-semibold tracking-tight', className)}>{children}</h3>;
}
export function CardContent({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn('text-sm', className)}>{children}</div>;
}
