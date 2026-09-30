'use client'

import { createContext, useCallback, useContext, useRef, useState } from 'react'

interface SidebarContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  openWithHover: () => void
  closeWithHover: () => void
  toggle: () => void
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

// Grace period so moving the cursor from the hamburger toward the
// panel doesn't cause a flicker-close in between.
const CLOSE_DELAY_MS = 400

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])

  const openWithHover = useCallback(() => {
    clearCloseTimer()
    setOpen(true)
  }, [clearCloseTimer])

  const closeWithHover = useCallback(() => {
    clearCloseTimer()
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS)
  }, [clearCloseTimer])

  const toggle = useCallback(() => {
    clearCloseTimer()
    setOpen((prev) => !prev)
  }, [clearCloseTimer])

  return (
    <SidebarContext.Provider value={{ open, setOpen, openWithHover, closeWithHover, toggle }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) throw new Error('useSidebar must be used inside SidebarProvider')
  return context
}