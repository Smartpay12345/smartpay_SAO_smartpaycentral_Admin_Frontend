// components/dashboard/broadcast/broadcast-ui.tsx
'use client'

import { Mail, MessageSquare, Shield } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { BroadcastTemplate } from '@/lib/types/broadcast'

export function RedCheckbox({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex h-3.5 w-3.5 items-center justify-center rounded-[3px] border',
        checked ? 'border-red-600 bg-red-600' : 'border-gray-300 bg-white'
      )}
    >
      {checked && (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path d="M1.5 4l1.8 1.8L6.5 2.2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  )
}

export function FieldHeader({ label, count, max, unit }: { label: string; count: number; max: number; unit: string }) {
  return (
    <div className="mb-1.5 flex items-center justify-between gap-2">
      <label className="text-xs font-medium text-gray-700">{label}</label>
      <span className={cn('text-[11px]', count >= max ? 'text-red-500' : 'text-gray-400')}>
        {count} / {max} {unit}
      </span>
    </div>
  )
}

const CHANNEL_STYLE = {
  Push: { className: 'bg-blue-50 text-blue-600', Icon: Shield },
  SMS: { className: 'bg-red-50 text-red-500', Icon: MessageSquare },
  Inbox: { className: 'bg-green-50 text-green-600', Icon: Mail },
} as const

export function TemplateBadges({ template }: { template: BroadcastTemplate }) {
  const meta = template.channel ? CHANNEL_STYLE[template.channel] : null
  return (
    <div className="flex flex-wrap items-center gap-2">
      {meta && (
        <span className={cn('inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium', meta.className)}>
          <meta.Icon className="h-3 w-3" /> {template.channel}
        </span>
      )}
      {template.tag && (
        <span className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">{template.tag}</span>
      )}
    </div>
  )
}

interface BroadcastModalShellProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  widthClass?: string
  children: React.ReactNode
}

// every modal in this flow shares: pink header, scrollable body, empty pink footer strip
export function BroadcastModalShell({ open, onOpenChange, title, widthClass = 'sm:!max-w-lg', children }: BroadcastModalShellProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn('!max-w-[90vw] gap-0 overflow-hidden p-0', widthClass)}>
        <div className="no-scrollbar max-h-[90vh] overflow-y-auto">
          <div className="border-b bg-red-50 px-5 py-3">
            <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          </div>
          {children}
          <div className="h-8 border-t bg-red-50/60" />
        </div>
      </DialogContent>
    </Dialog>
  )
}