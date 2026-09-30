'use client'

import { cn } from '@/lib/utils'
import { General, Security, Operation } from '@/components/icons'

const items = [
  { key: 'general', label: 'General Settings', icon: <General/> },
  { key: 'security', label: 'Security & Access', icon: <Security/> },
  { key: 'operational', label: 'Operational Rules', icon: <Operation/> },
] as const

interface SettingsNavProps {
  active: (typeof items)[number]['key']
  onChange: (key: (typeof items)[number]['key']) => void
}

export function SettingsNav({ active, onChange }: SettingsNavProps) {
  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-1">
      {items.map((item) => {
        const isActive = active === item.key
        return (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className={cn(
              'relative flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium lg:w-full overflow-hidden transition-colors',
              isActive ? 'bg-[#FFE1DF] text-primary' : 'text-[#5D3F3D] hover:bg-gray-50'
            )}
          >
            {/* 2. Conditionally render the absolute indicator bar only when active */}
            {isActive && (
              <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-red-700" />
            )}
            
            <span>{item.icon}</span> 
            <span>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}