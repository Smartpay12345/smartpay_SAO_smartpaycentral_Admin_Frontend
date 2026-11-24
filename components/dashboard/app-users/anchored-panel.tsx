// components/dashboard/app-users/anchored-panel.tsx
'use client'

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

interface AnchoredPanelProps {
  anchorRef: RefObject<HTMLElement | null>
  onClose: () => void
  className?: string
  children: ReactNode
}

export function AnchoredPanel({ anchorRef, onClose, className, children }: AnchoredPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null)

  // follow the anchor, including while the page scrolls
  useLayoutEffect(() => {
    function update() {
      const el = anchorRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      setPos({ top: r.bottom + 8, right: Math.max(window.innerWidth - r.right, 8) })
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true) // capture: catches inner scroll containers too
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [anchorRef])

  // click outside + Escape
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node
      if (panelRef.current?.contains(target)) return
      if (anchorRef.current?.contains(target)) return // let the tab/button handle its own click
      onClose()
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [anchorRef, onClose])

  if (!pos) return null

  return createPortal(
    <>
      {/* visual dim only: does not capture wheel/touch, so the page stays scrollable */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-40"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
      />
      <div
        ref={panelRef}
        role="dialog"
        style={{ top: pos.top, right: pos.right }}
        className={cn(
          'fixed z-50 max-h-[calc(100vh-6rem)] max-w-[calc(100vw-1rem)] overflow-y-auto rounded-xl bg-white p-5 shadow-xl',
          className
        )}
      >
        {children}
      </div>
    </>,
    document.body
  )
}