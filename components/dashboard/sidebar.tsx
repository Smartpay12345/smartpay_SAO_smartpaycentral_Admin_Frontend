// components/dashboard/sidebar.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { X, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Setting, Activity, Transaction, Bell, House, Person, Tanker, Sales, Inventory } from '@/components/icons'
import { SidebarNavItem } from './sidebar-nav-item'
import { useSidebar } from './sidebar-context'
import { AccountOverviewModal } from './account-overview-modal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// TODO: replace with real auth/user data once the backend endpoint exists.
// Shape must match AccountUser in account-overview-modal.tsx exactly.
const MOCK_USER = {
  name: 'Oluwagbotemi O.',
  role: 'Account Manager',
  email: 'oluwagbotemi@saofuel.com',
  phone: '+234 801 234 5678',
  avatarUrl: undefined, // leave undefined to exercise the AvatarFallback path
}

const mainMenu = [
  { href: '/dashboard', label: 'Dashboard', icon: House },
  { href: '/dashboard/sales-overview', label: 'Sales Overview', icon: Sales },
  { href: '/dashboard/inventory', label: 'Inventory', icon: Inventory },
  { href: '/dashboard/managers', label: 'Managers', icon: Person },
  { href: '/dashboard/manage-orders', label: 'Manage Orders', icon: Tanker },
  { href: '/dashboard/transactions', label: 'Transactions', icon: Transaction },
  { href: '/dashboard/app-users', label: 'App Stats', icon: Transaction },
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
  const { open, setOpen, openWithHover, closeWithHover } = useSidebar()
  const pathname = usePathname()
  const asideRef = useRef<HTMLElement>(null)
  const handlerRef = useRef<((e: MouseEvent) => void) | null>(null)
  const [accountModalOpen, setAccountModalOpen] = useState(false)

  // Mocked until auth/user data is wired up — see MOCK_USER above.
  const user = MOCK_USER

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
          // no h-screen: inset-y-0 already fills the visible height, and 100vh is what cut the footer off
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col overflow-hidden bg-background transition-transform lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* decorative circle, clipped by the aside's overflow-hidden */}
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-38 w-38 rounded-full bg-[#E5001980]/30" />

        {/* Header: fixed */}
        <div className="relative flex shrink-0 items-center justify-between p-4 lg:justify-start lg:gap-2">
          <div className="flex items-center gap-4">
            <Image src="/logo.svg" alt="SAO" width={28} height={28} />
            <span className="font-semibold text-white">Sao fuel Pay</span>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Body: the only part that scrolls, scrollbar hidden */}
        <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <nav className="flex flex-col gap-1 p-3">
            <p className="px-3 pb-1 text-xs font-medium uppercase text-gray-400">
              Main Menu
            </p>
            {mainMenu.map((item) => (
              <SidebarNavItem key={item.href} {...item} isActive={item.href === activeHref} />
            ))}
          </nav>

          <nav className="flex flex-col gap-1 p-3">
            <p className="px-3 pb-1 pt-2 text-xs font-medium uppercase text-gray-400">
              System
            </p>
            {systemMenu.map((item) => (
              <SidebarNavItem key={item.href} {...item} isActive={item.href === activeHref} />
            ))}
          </nav>
        </div>

        {/* Footer: fixed */}
        <div className="relative shrink-0 space-y-3 p-4 text-center">
          <p className="text-xs text-gray-400">Powered by Smartpay studio</p>

          <div className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2">
            <button
              onClick={() => setAccountModalOpen(true)}
              className="flex min-w-0 flex-1 items-center gap-2 text-left"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 text-left text-white">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="truncate text-xs text-gray-400">{user.role}</p>
              </div>
            </button>

            <button onClick={() => setAccountModalOpen(true)} aria-label="Open account">
              <ChevronDown className="h-4 w-4 text-[#ED2024]" />
            </button>
          </div>

          <AccountOverviewModal
            open={accountModalOpen}
            onOpenChange={setAccountModalOpen}
            user={user}
          />
        </div>
      </aside>
    </>
  )
}
