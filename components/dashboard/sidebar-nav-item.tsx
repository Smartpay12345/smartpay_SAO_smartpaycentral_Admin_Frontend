// components/dashboard/sidebar-nav-item.tsx
'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Drop } from '../icons'

interface SidebarNavItemProps {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  isActive: boolean
}

export function SidebarNavItem({ href, label, icon: Icon, badge, isActive }: SidebarNavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-4 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'
      )}
    >
      <span className="flex items-center gap-3">
        <Icon className={cn('h-4 w-4', isActive ? 'text-primary' : 'text-[#9CA3AF]')} />
        {label}
      </span>
      <span className="flex items-center gap-2">
        {badge !== undefined && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
            {badge}
          </span>
        )}
        {isActive && (
          <span className="h-4 w-4" aria-hidden="true">
            <Drop/>
          </span>
        )}
      </span>
    </Link>
  )
}