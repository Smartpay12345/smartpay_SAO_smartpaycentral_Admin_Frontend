
'use client'

import { ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface FilterDropdownProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  icon?: React.ReactNode
}

export function FilterDropdown({ options, value, onChange, icon }: FilterDropdownProps) {
  return (
<DropdownMenu>
  <DropdownMenuTrigger
    render={
      <Button variant="outline" className="gap-2">
        {icon}
        {value}
        <ChevronDown className="h-4 w-4" />
      </Button>
    }
  />
  <DropdownMenuContent align="end">
    {options.map((opt) => (
      <DropdownMenuItem key={opt} onSelect={() => onChange(opt)}>
        {opt}
      </DropdownMenuItem>
    ))}
  </DropdownMenuContent>
</DropdownMenu>
  )
}