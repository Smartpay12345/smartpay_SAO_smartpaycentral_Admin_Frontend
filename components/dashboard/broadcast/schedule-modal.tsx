// components/dashboard/broadcast/schedule-modal.tsx
'use client'

import { useState } from 'react'
import { CalendarClock } from 'lucide-react'
import { toast } from 'sonner'
import { BroadcastModalShell } from './broadcast-ui'
import { ScheduleCalendar, TimeSpinner } from './schedule-pickers'
import { combineDateTime } from '@/lib/utils/broadcast-utils'
import type { TimeValue } from '@/lib/types/broadcast'

interface ScheduleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSendNow: () => void
  onSchedule: (when: Date) => void
  scheduledDates: string[]
  busy: boolean
}

export function ScheduleModal({ open, onOpenChange, onSendNow, onSchedule, scheduledDates, busy }: ScheduleModalProps) {
  const [view, setView] = useState<'choose' | 'calendar'>('choose')
  const [day, setDay] = useState<Date | null>(null)
  const [time, setTime] = useState<TimeValue>({ hour: 8, minute: 30, period: 'AM' })

  function handleConfirm() {
    if (!day) {
      toast.error('Pick a dispatch date first')
      return
    }
    const when = combineDateTime(day, time)
    if (when.getTime() <= Date.now()) {
      toast.error('Choose a time in the future')
      return
    }
    onSchedule(when)
  }

  return (
    <BroadcastModalShell
      open={open}
      onOpenChange={onOpenChange}
      title="Delivery Settings"
      widthClass={view === 'calendar' ? 'sm:!max-w-2xl' : 'sm:!max-w-md'}
    >
      {view === 'choose' ? (
        <div className="p-5">
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500">
                <CalendarClock className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-medium text-gray-900">Delivery Scheduling</p>
                <p className="text-xs text-gray-400">Send broadcast immediately upon confirmation</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={onSendNow}
                className="rounded bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {busy ? 'Sending...' : 'Send Immediately'}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => setView('calendar')}
                className="rounded border px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Schedule for Later
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-[1fr_auto]">
          <ScheduleCalendar selected={day} onSelect={setDay} scheduledDates={scheduledDates} />

          <div className="flex flex-col justify-between gap-4 rounded-xl bg-gray-50 p-4 sm:w-56">
            <div>
              <p className="mb-2 text-[11px] font-semibold tracking-wide text-gray-500">DISPATCH TIME</p>
              <TimeSpinner value={time} onChange={setTime} />
            </div>
            <div className="flex justify-center gap-2">
              <button type="button" onClick={() => onOpenChange(false)} className="rounded-lg px-4 py-1.5 text-xs text-gray-600 hover:bg-gray-100">
                Cancel
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={handleConfirm}
                className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {busy ? 'Scheduling...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </BroadcastModalShell>
  )
}