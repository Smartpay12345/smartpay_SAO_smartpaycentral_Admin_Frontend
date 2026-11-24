import { cn } from '@/lib/utils'
import { formatDateTime } from '@/lib/utils/date'
import type { TrackingStep } from '@/lib/dashboard/orders-types'

export function OrderTrackingTimeline({ steps }: { steps: TrackingStep[] }) {
  return (
    <ol>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1
        const done = step.state === 'done'
        const current = step.state === 'current'
        const isPending = step.state === 'upcoming'
        return (
          <li key={step.key} className="relative flex gap-3 pb-6 last:pb-0">
            {!isLast && (
              <span
                className={cn(
                  'absolute bottom-[-4px] left-[6px] top-[18px] w-px',
                  done ? 'bg-green-600' : 'bg-red-100'
                )}
              />
            )}
            <span
              className={cn(
                'relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full',
                current && 'border-[3px] border-primary bg-white',
                done && 'bg-green-600',
                isPending && 'bg-red-100'
              )}
            />
            <div>
              <p className={cn('text-sm font-medium', current && 'text-primary', isPending && 'text-gray-400')}>
                {step.label}
              </p>
              <p className={cn('text-xs', isPending ? 'text-gray-300' : 'text-gray-500')}>
                {step.at ? formatDateTime(step.at) : '-'}
              </p>
              {step.note && <p className="mt-0.5 text-xs text-gray-500">{step.note}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}