// components/dashboard/orders/order-tracking-timeline.tsx
import { cn } from '@/lib/utils'
import type { OrderTrackingStep } from '@/lib/types/order'

export function OrderTrackingTimeline({ steps }: { steps: OrderTrackingStep[] }) {
  return (
    <ol>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1
        const isPending = !step.done && !step.current
        return (
          <li key={step.label} className="relative flex gap-3 pb-6 last:pb-0">
            {!isLast && (
              <span
                className={cn(
                  'absolute bottom-[-4px] left-[6px] top-[18px] w-px',
                  step.done && !step.current ? 'bg-green-700' : 'bg-red-100'
                )}
              />
            )}
            <span
              className={cn(
                'relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full',
                step.current && 'border-[3px] border-primary bg-white',
                step.done && !step.current && 'bg-green-700',
                isPending && 'bg-red-100'
              )}
            />
            <div>
              <p className={cn('text-sm font-medium', step.current && 'text-primary', isPending && 'text-gray-400')}>
                {step.label}
              </p>
              <p className={cn('text-xs', isPending ? 'text-red-200' : 'text-gray-500')}>{step.date}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}