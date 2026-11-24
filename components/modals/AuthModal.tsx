"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  className?: string;
}

export function AuthModal({ open, onOpenChange, children, className }: AuthModalProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* dim on phone and tablet so the form has focus; transparent on desktop as before */}
        <DialogPrimitive.Backdrop className="fixed inset-0 z-40 bg-black/40 lg:bg-transparent" />

        <DialogPrimitive.Popup
          className={cn(
            "fixed z-50 flex w-full flex-col overflow-hidden bg-white shadow-2xl outline-none",
            // phone (<640px): bottom sheet
            "bottom-0 left-0 right-0 max-h-[92dvh] rounded-t-2xl",
            // tablet (640-1023px): centred card
            "sm:bottom-auto sm:left-1/2 sm:right-auto sm:top-1/2 sm:max-h-[calc(100dvh-3rem)] sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl",
            // desktop (1024px+): right-hand card over the hero, as now
            "lg:left-auto lg:right-10 lg:translate-x-0",
            // animation
            "data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-bottom-8",
            "sm:data-open:slide-in-from-bottom-0 lg:data-open:slide-in-from-right-4",
            "data-closed:animate-out data-closed:fade-out-0",
            className
          )}
        >
          {/* decorative circles: clipped by the popup's overflow-hidden, never scroll with the content */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-38 w-38 rounded-full bg-red-100/60" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-38 w-38 rounded-full bg-red-100/60" />

          {/* the scroll area: padding lives here so content scrolls to the card edge */}
        <div className="no-scrollbar relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:p-10">
  {children}
</div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}