'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface SearchOption {
  value: string
  label: string
}

interface SearchSelectProps {
  options: SearchOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  emptyText?: string
  allLabel?: string 
}

// "GT Bank", "gtbank" and "GTBank" all become "gtbank"
const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

export function SearchSelect({ options, value, onChange, placeholder = 'Search', emptyText = 'No match found', allLabel }: SearchSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlight, setHighlight] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)

  const selected = value === '' && allLabel ? { value: '', label: allLabel } : options.find((o) => o.value === value)

  // derived, not stored: dedupe by value, sort, then filter by the search text
 const results = useMemo(() => {
  const q = normalize(query)
  const unique = options.filter((o, i) => options.findIndex((x) => x.value === o.value) === i)
  const sorted = unique.sort((a, b) => a.label.localeCompare(b.label))
  const filtered = q ? sorted.filter((o) => normalize(o.label).includes(q)) : sorted
  return allLabel && !q ? [{ value: '', label: allLabel }, ...filtered] : filtered
}, [options, query, allLabel])

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [])

  function pick(o: SearchOption) {
    onChange(o.value)
    setOpen(false)
    setQuery('')
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setHighlight((h) => Math.min(h + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter' && open && results[highlight]) {
      e.preventDefault() // don't submit the surrounding form
      pick(results[highlight])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <Input
        value={open ? query : selected?.label ?? ''}
        onChange={(e) => { setQuery(e.target.value); setHighlight(0); setOpen(true) }}
        onFocus={() => { setQuery(''); setOpen(true) }}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        className="h-9 pr-9"
      />
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

      {open && (
        <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border bg-white py-1 shadow-lg">
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-gray-400">{emptyText}</li>
          ) : (
            results.map((o, i) => (
              <li
                key={o.value}
                role="option"
                aria-selected={o.value === value}
                onMouseDown={(e) => { e.preventDefault(); pick(o) }}
                onMouseEnter={() => setHighlight(i)}
                className={cn(
                  'cursor-pointer px-4 py-3 text-sm',
                  i === highlight && 'bg-red-50',
                  o.value === value && 'font-medium',
                )}
              >
                {o.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}