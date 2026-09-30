// components/dashboard/topbar.tsx
'use client'

import { Bell } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { AccountMenu } from './account-menu'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from './sidebar-trigger'

interface TopbarProps {
  userName: string
  userRole: string
  notificationCount?: number
}

export function Topbar({ userName, userRole, notificationCount }: TopbarProps) {
  return (
    <header className="fixed left-0 right-0 top-0 z-20 flex h-16 items-center justify-between border-b  bg-background px-4 lg:left-0 lg:px-6">
      <SidebarTrigger />

      <div className="absolute right-0 top-0 flex h-full items-center gap-4 bg-[#007AFD]/10 px-4 lg:px-6">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {notificationCount !== undefined && notificationCount > 0 && (
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#007AFD]" />
          )}
        </Button>
        <AccountMenu name={userName} role={userRole} />
      </div>
    </header>
  )
}