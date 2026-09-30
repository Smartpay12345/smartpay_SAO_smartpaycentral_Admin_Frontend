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
        <DialogPrimitive.Backdrop className="fixed inset-0 z-40 bg-transparent" />
        <DialogPrimitive.Popup
          className={cn(
            "fixed top-1/2 right-6 z-50 w-full max-w-md -translate-y-1/2",
            "rounded-2xl bg-white p-8 shadow-2xl outline-none sm:right-10 sm:p-10 overflow-hidden",
            "data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-right-4",
            "data-closed:animate-out data-closed:fade-out-0",
            className
          )}
        >
            
         {/* Decorative Top-Right Soft Red Circle */}
        <div className="absolute -right-16 -top-16 h-38 w-38 rounded-full bg-red-100/60 pointer-events-none" />

        {/* Decorative Bottom-Left Soft Red Circle */}
        <div className="absolute -bottom-16 -left-16 h-38 w-38 rounded-full bg-red-100/60 pointer-events-none" />
          <div className="relative z-10">{children}</div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}