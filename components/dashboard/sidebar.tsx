// components/dashboard/sidebar.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { X, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Setting, Activity, Transaction, Bell, House, Person, Tanker, Sales, Inventory } from '@/components/icons'
import { SidebarNavItem } from './sidebar-nav-item'
import { Button } from '@/components/ui/button'
import { useSidebar } from './sidebar-context'
import { LogoutModal } from '@/app/dashboard/logout-modal'

const mainMenu = [
  { href: '/dashboard', label: 'Dashboard', icon: House },
  { href: '/dashboard/sales-overview', label: 'Sales Overview', icon: Sales },
  { href: '/dashboard/transactions', label: 'Transactions', icon: Transaction },
  { href: '/dashboard/inventory', label: 'Inventory', icon: Inventory },
  { href: '/dashboard/managers', label: 'Managers', icon: Person },
  { href: '/dashboard/manage-orders', label: 'Manage Orders', icon: Tanker },
]

const systemMenu = [
  { href: '/dashboard/alerts', label: 'Alerts & Notifications', icon: Bell, badge: 5 },
  { href: '/dashboard/activity-logs', label: 'Activity Logs', icon: Activity },
  { href: '/dashboard/settings', label: 'Settings', icon: Setting },
]


function getActiveHref(pathname: string, allHrefs: string[]): string | null {
  const matches = allHrefs.filter(
    (href) => pathname === href || pathname.startsWith(href + '/')
  )
  if (matches.length === 0) return null
  return matches.reduce((longest, current) =>
    current.length > longest.length ? current : longest
  )
}

export function Sidebar() {
  const [logoutOpen, setLogoutOpen] = useState(false)
  const { open, setOpen, openWithHover, closeWithHover } = useSidebar()
  const pathname = usePathname()
  const asideRef = useRef<HTMLElement>(null)
  const handlerRef = useRef<((e: MouseEvent) => void) | null>(null)

  const allHrefs = [...mainMenu, ...systemMenu].map((item) => item.href)
  const activeHref = getActiveHref(pathname, allHrefs)

 
useEffect(() => {
    if (!open) return

    const timer = setTimeout(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement
        if (asideRef.current?.contains(target)) return
        if (target.closest('[data-sidebar-trigger]')) return
        setOpen(false)
      }
      handlerRef.current = handleClickOutside
      document.addEventListener('mousedown', handleClickOutside)
    }, 0)

    return () => {
      clearTimeout(timer)
      if (handlerRef.current) {
        document.removeEventListener('mousedown', handlerRef.current)
        handlerRef.current = null
      }
    }
  }, [open, setOpen])

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        ref={asideRef}
        onMouseEnter={openWithHover}
        onMouseLeave={closeWithHover}
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex h-screen w-64 flex-col border-r bg-background transition-transform lg:translate-x-0 ',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-4 lg:justify-start lg:gap-2">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="SAO" width={28} height={28} />
            <span className="font-semibold">Sao fuel Pay</span>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* main menu */}
        <nav className="flex flex-col gap-1 p-3">
          <p className="px-3 pb-1 text-xs font-medium uppercase text-gray-400">
            Main Menu
          </p>
          {mainMenu.map((item) => (
            <SidebarNavItem key={item.href} {...item} isActive={item.href === activeHref} />
          ))}
        </nav>

        {/* system menu */}
        <nav className="flex flex-col gap-1 border-t border-primary p-3">
          <p className="px-3 pb-1 pt-2 text-xs font-medium uppercase text-gray-400">
            System
          </p>
          {systemMenu.map((item) => (
            <SidebarNavItem key={item.href} {...item} isActive={item.href === activeHref} />
          ))}
        </nav>

        {/* footer */}
        <div className="mt-auto space-y-3 border-t p-4 text-center">
          <p className="text-xs text-gray-400">Powered by Smartpay studio</p>
         <Button variant="default" className="w-full" onClick={() => setLogoutOpen(true)}>
  <LogOut className="mr-2 h-4 w-4" />
  Log Out
</Button>
        </div>
        <LogoutModal open={logoutOpen} onOpenChange={setLogoutOpen} />
      </aside>
    </>
  )
}