'use client'

import { Menu } from 'lucide-react'
import { useSidebar } from './sidebar-context'

export function SidebarTrigger() {
  const { open, openWithHover, closeWithHover, toggle } = useSidebar()

  return (
    <button
      type="button"
      data-sidebar-trigger
      aria-label="Toggle sidebar"
      aria-expanded={open}
      onMouseEnter={openWithHover}
      onMouseLeave={closeWithHover}
      onClick={toggle}
      className="rounded-lg hover:bg-gray-100"
    >
      <Menu className="h-5 w-5 text-gray-600" />
    </button>
  )
}