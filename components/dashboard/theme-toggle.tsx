'use client'

import { useSyncExternalStore } from 'react'
import { useTheme } from '@/components/theme-provider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const emptySubscribe = () => () => {}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  // false on server & first client render, true after hydration —
  // no effect, no setState, no cascading render warning
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  if (!mounted) {
    return <div className="h-8 w-[160px] rounded-lg border bg-transparent" />
  }

  return (
    <Select value={theme} onValueChange={(v) => { if (typeof v === 'string' && v) setTheme(v) }}>
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="red-on-black">Red on Black</SelectItem>
      </SelectContent>
    </Select>
  )
}