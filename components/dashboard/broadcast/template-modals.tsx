// components/dashboard/broadcast/template-modals.tsx
'use client'

import { ArrowRight, Clock, Eye } from 'lucide-react'
import { BroadcastModalShell, TemplateBadges } from './broadcast-ui'
import { renderTemplate } from '@/lib/utils/broadcast-utils'
import type { BroadcastTemplate } from '@/lib/types/broadcast'

interface ImportTemplateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  templates: BroadcastTemplate[]
  onImport: (t: BroadcastTemplate) => void
  onPreview: (t: BroadcastTemplate) => void
}

export function ImportTemplateModal({ open, onOpenChange, templates, onImport, onPreview }: ImportTemplateModalProps) {
  return (
    <BroadcastModalShell open={open} onOpenChange={onOpenChange} title="Import Template" widthClass="lg:!max-w-4xl">
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 p-5 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <div key={t.id}>
            <h3 className="text-base font-medium leading-snug text-gray-900">{t.title}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-[11px] text-gray-400">
              <Clock className="h-3 w-3" /> Created: {t.createdLabel}
            </p>
            <div className="mt-2 flex items-center justify-between">
              <button type="button" onClick={() => onPreview(t)} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900">
                <Eye className="h-4 w-4" /> Preview
              </button>
              <button
                type="button"
                onClick={() => onImport(t)}
                className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
              >
                Import Template <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
        {templates.length === 0 && <p className="col-span-full py-6 text-center text-sm text-gray-400">No templates saved yet.</p>}
      </div>
    </BroadcastModalShell>
  )
}

interface TemplatePreviewModalProps {
  template: BroadcastTemplate | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TemplatePreviewModal({ template, open, onOpenChange }: TemplatePreviewModalProps) {
  if (!template) return null
  return (
    <BroadcastModalShell open={open} onOpenChange={onOpenChange} title="Template Preview" widthClass="sm:!max-w-md">
      <div className="space-y-3 p-5">
        <TemplateBadges template={template} />
        <h3 className="text-base font-semibold text-gray-900">{template.title}</h3>
        <p className="rounded-lg bg-gray-50 p-3 text-sm leading-relaxed text-gray-700">{renderTemplate(template.body)}</p>
        <p className="text-[11px] text-gray-400">Preview uses sample values for personalised fields like {'{{first_name}}'}.</p>
      </div>
    </BroadcastModalShell>
  )
}