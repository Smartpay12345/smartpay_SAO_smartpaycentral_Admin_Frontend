// components/dashboard/broadcast/template-card.tsx
'use client'

import { ArrowRight, Clock, Eye, MoreVertical } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { TemplateBadges } from './broadcast-ui'
import type { BroadcastTemplate } from '@/lib/types/broadcast'

interface TemplateCardProps {
  template: BroadcastTemplate
  onPreview: (t: BroadcastTemplate) => void
  onUse: (t: BroadcastTemplate) => void
  onDelete: (t: BroadcastTemplate) => void
}

export function TemplateCard({ template: t, onPreview, onUse, onDelete }: TemplateCardProps) {
  return (
    <div className="flex flex-col rounded-xl border bg-white p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <TemplateBadges template={t} />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button type="button" aria-label="Template actions" className="text-gray-400 hover:text-gray-700">
                <MoreVertical className="h-4 w-4" />
              </button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onUse(t)}>Use Template</DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => onDelete(t)}>
              Delete template
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <h3 className="text-base font-semibold leading-snug text-gray-900">{t.title}</h3>
      <p className="mt-3 line-clamp-4 rounded-lg bg-gray-50 p-3 text-xs leading-relaxed text-gray-500">{t.body}</p>

      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-gray-400">
        <Clock className="h-3 w-3" /> Created: {t.createdLabel}
      </p>

      <div className="mt-3 flex items-center justify-between rounded-lg bg-red-50 px-3 py-1.5 text-[11px]">
        <span className="text-gray-600">Used {t.usedCount.toLocaleString()} times</span>
        {t.usedCount > 0 && (
          <span className="flex items-center gap-1 font-medium text-green-600">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> {t.deliveryRate} Delivery rate
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button type="button" onClick={() => onPreview(t)} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900">
          <Eye className="h-4 w-4" /> Preview
        </button>
        <button
          type="button"
          onClick={() => onUse(t)}
          className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
        >
          Use Template <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}