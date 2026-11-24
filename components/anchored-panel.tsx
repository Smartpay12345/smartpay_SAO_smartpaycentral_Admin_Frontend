// 'use client'

// import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react'
// import { createPortal } from 'react-dom'
// import { X } from 'lucide-react'
// import { cn } from '@/lib/utils'

// const EDGE = 8

// interface AnchoredPanelProps {
//   anchorRef: RefObject<HTMLElement | null>
//   onClose: () => void
//   className?: string
//   children: ReactNode
// }

// export function AnchoredPanel({ anchorRef, onClose, className, children }: AnchoredPanelProps) {
//   const panelRef = useRef<HTMLDivElement>(null)
//   const [pos, setPos] = useState<{ top: number; right: number } | null>(null)

//   useLayoutEffect(() => {
//     function update() {
//       const anchor = anchorRef.current
//       if (!anchor) return
//       const r = anchor.getBoundingClientRect()
//       const width = panelRef.current?.offsetWidth ?? 0
//       const maxRight = Math.max(window.innerWidth - width - EDGE, EDGE) // keeps the left edge on screen
//       setPos({
//         top: r.bottom + EDGE,
//         right: Math.min(Math.max(window.innerWidth - r.right, EDGE), maxRight),
//       })
//     }
//     update()
//     window.addEventListener('resize', update)
//     window.addEventListener('scroll', update, true)
//     return () => {
//       window.removeEventListener('resize', update)
//       window.removeEventListener('scroll', update, true)
//     }
//   }, [anchorRef])

//   useEffect(() => {
//     function onPointerDown(e: PointerEvent) {
//       const target = e.target as Node
//       if (panelRef.current?.contains(target)) return
//       if (anchorRef.current?.contains(target)) return
//       onClose()
//     }
//     function onKey(e: KeyboardEvent) {
//       if (e.key === 'Escape') onClose()
//     }
//     document.addEventListener('pointerdown', onPointerDown)
//     document.addEventListener('keydown', onKey)
//     return () => {
//       document.removeEventListener('pointerdown', onPointerDown)
//       document.removeEventListener('keydown', onKey)
//     }
//   }, [anchorRef, onClose])

//   return createPortal(
//     <>
//       {/* phone: blocks the page behind the sheet. md+: visual dim only, so the page stays scrollable */}
//       <div
//         aria-hidden
//         className="fixed inset-0 z-40 md:pointer-events-none"
//         style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
//       />
//       <div
//         ref={panelRef}
//         role="dialog"
//         aria-modal="true"
//         style={
//           {
//             '--panel-top': `${pos?.top ?? 0}px`,
//             '--panel-right': `${pos?.right ?? EDGE}px`,
//             visibility: pos ? 'visible' : 'hidden', // measured first, shown once positioned
//           } as CSSProperties
//         }
//         className={cn(
//           'fixed z-50 overflow-y-auto overscroll-contain bg-white shadow-xl',
//           // phone: bottom sheet
//           'max-md:inset-x-0 max-md:bottom-0 max-md:max-h-[85dvh] max-md:rounded-t-2xl max-md:px-5 max-md:pt-3 max-md:pb-[calc(1.25rem+env(safe-area-inset-bottom))]',
//           // tablet and up: card under the tab bar, never taller than the space below it
//           'md:right-[var(--panel-right)] md:top-[var(--panel-top)] md:max-h-[calc(100dvh-var(--panel-top)-1rem)] md:rounded-xl md:p-5',
//           className
//         )}
//       >
//         <div className="mb-3 flex items-center justify-between md:hidden">
//           <span aria-hidden className="mx-auto h-1 w-10 rounded-full bg-gray-300" />
//           <button
//             type="button"
//             onClick={onClose}
//             aria-label="Close"
//             className="absolute right-3 top-3 rounded-full p-2 text-gray-500 hover:bg-gray-100"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         </div>
//         {children}
//       </div>
//     </>,
//     document.body
//   )
// }

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
          <div className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:p-10">
            {children}
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}