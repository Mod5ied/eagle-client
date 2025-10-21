"use client";
import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@lib/utils';
import { X } from 'lucide-react';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay ref={ref} className={cn('fixed inset-0 z-40 bg-black/40 backdrop-blur-sm', className)} {...props} />
));
DialogOverlay.displayName = 'DialogOverlay';

export const DialogContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content ref={ref} className={cn('fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-cerulean/40 bg-white p-6 shadow-lg focus:outline-none', className)} {...props}>
      {children}
      <DialogPrimitive.Close className='absolute right-3 top-3 rounded-sm opacity-70 transition hover:opacity-100 focus:outline-none'>
        <X className='h-4 w-4' />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = 'DialogContent';

export function DialogTitle({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return <DialogPrimitive.Title className={cn('text-lg font-semibold', className)}>{children}</DialogPrimitive.Title>;
}
export function DialogDescription({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return <DialogPrimitive.Description className={cn('text-sm text-gray-600', className)}>{children}</DialogPrimitive.Description>;
}