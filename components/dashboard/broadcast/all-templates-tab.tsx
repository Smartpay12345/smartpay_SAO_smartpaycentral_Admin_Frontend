// components/dashboard/broadcast/all-templates-tab.tsx
'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { TemplateCard } from './template-card'
import { CATEGORY_OPTIONS } from '@/lib/data/broadcast'
import type { BroadcastTemplate, TemplateCategory } from '@/lib/types/broadcast'
import { cn } from '@/lib/utils'

interface AllTemplatesTabProps {
  templates: BroadcastTemplate[]
  onPreview: (t: BroadcastTemplate) => void
  onUse: (t: BroadcastTemplate) => void
  onDelete: (t: BroadcastTemplate) => void
}

export function AllTemplatesTab({ templates, onPreview, onUse, onDelete }: AllTemplatesTabProps) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<'all' | TemplateCategory>('all')

  const q = search.trim().toLowerCase()
  const visible = templates.filter((t) => {
    const matchesCategory = category === 'all' || t.category === category
    const matchesSearch =
      q === '' ||
      t.title.toLowerCase().includes(q) ||
      t.body.toLowerCase().includes(q) ||
      (t.tag?.toLowerCase().includes(q) ?? false)
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-4">
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search templates by title, keyword, or tag..."
          className="w-full rounded-lg border bg-gray-50 py-2 pl-9 pr-3 text-xs outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory('all')}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium',
            category === 'all' ? 'bg-red-600 text-white' : 'border text-gray-600 hover:bg-gray-50'
          )}
        >
          All Templates ({templates.length})
        </button>
        {CATEGORY_OPTIONS.map((c) => {
          const count = templates.filter((t) => t.category === c.key).length
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setCategory(c.key)}
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
                category === c.key ? 'border-red-600 text-red-600' : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              {c.label}
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-gray-100 px-1 text-[10px] text-gray-500">
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((t) => (
            <TemplateCard key={t.id} template={t} onPreview={onPreview} onUse={onUse} onDelete={onDelete} />
          ))}
        </div>
      ) : (
        <p className="py-10 text-center text-sm text-gray-400">No templates match your search.</p>
      )}
    </div>
  )
}