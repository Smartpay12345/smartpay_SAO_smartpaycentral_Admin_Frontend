'use client'

import { cn } from '@/lib/utils'
import type { Alert } from '@/lib/types/alert'

interface AlertCardProps {
  alert: Alert
  onLinkClick?: () => void
}

export function AlertCard({ alert, onLinkClick }: AlertCardProps) {
    const isHigh = alert.priority === 'high'
  return (
    <div
      className={cn(
         'relative flex items-start justify-between gap-4 overflow-hidden rounded-xl border bg-white p-4',
        isHigh ? 'border-red-200' : 'border-gray-200'
      )}
    >
       {isHigh && (
        <>
       
          <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-red-700" />
         
          <span
            aria-hidden
            className="absolute left-0 top-1/2 h-15 w-2 -translate-y-1/2 rounded-r-full bg-red-700"
          />
        </>
      )}
      <div className="flex items-start gap-3">
        <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg', alert.iconBg)}>
          {alert.icon}
        </span>
        <div>
          <p className="text-sm font-semibold">{alert.title}</p>
          <p className="mt-0.5 text-sm text-gray-500">{alert.description}</p>
          {(alert.priority || alert.linkLabel) && (
            <div className="mt-2 flex items-center gap-3 text-xs">
              {alert.priority === 'high' && (
                <span className="rounded-full bg-red-50 px-2 py-0.5 font-medium text-red-600">! High Priority</span>
              )}
              {alert.linkLabel && (
                <button onClick={onLinkClick} className="font-medium text-primary">
                  {alert.linkLabel}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className="text-xs text-gray-400">{alert.timeAgo}</span>
        {alert.read ? (
          <span className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 text-[10px] text-gray-400">✓</span>
        ) : (
          <span className="h-2 w-2 rounded-full bg-red-500" />
        )}
      </div>
    </div>
  )
}