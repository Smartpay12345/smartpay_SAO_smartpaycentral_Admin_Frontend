// components/dashboard/transactions/transaction-summary-card.tsx
import { cn } from '@/lib/utils'

interface TransactionSummaryCardProps {
  icon: React.ReactNode
  iconBg: string
  label: string
  subtext: string
  value: string
  trendValue: string
  trendDirection: 'up' | 'down'
  trendIcon?: React.ReactNode
}

export function TransactionSummaryCard({
  icon,
  iconBg,
  label,
  subtext,
  value,
  trendValue,
  trendDirection,
  trendIcon,
}: TransactionSummaryCardProps) {
  const isUp = trendDirection === 'up'

  return (
    <div className="flex w-full flex-col rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', iconBg)}>
          {icon}
        </span>
        <div>
          <p className="text-sm font-semibold text-[#111827] dark:text-card-foreground">{label}</p>
          <p className="text-xs text-gray-400">{subtext}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xl font-bold text-[#111827] dark:text-card-foreground">{value}</p>
        <span
          className={cn(
            'flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
            isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
          )}
        >
          {trendIcon ?? (isUp ? '↑' : '↓')}
          {trendValue}
        </span>
      </div>
    </div>
  )
}