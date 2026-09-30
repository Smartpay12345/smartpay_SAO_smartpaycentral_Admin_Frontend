import { cn } from '@/lib/utils'

interface RevenueStatCardProps {
  label: string
  value: string
  valueColor?: string
  icon: React.ReactNode
  iconBg: string
  trendIcon?: React.ReactNode
  trendValue?: string
  trendValueColor?: string
  trendLabel?: string
  trendLabelColor?: string
  subtext?: string
}

export function RevenueStatCard({
  label,
  value,
  valueColor,
  icon,
  iconBg,
  trendIcon,
  trendValue,
  trendValueColor = 'text-green-600',
  trendLabel,
  trendLabelColor = 'text-gray-400',
  subtext,
}: RevenueStatCardProps) {
  return (
    <div className="flex w-full flex-col rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-gray-500">{label}</p>
        <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', iconBg)}>
          {icon}
        </span>
      </div>

      <p className={cn('mt-2 text-xl font-bold text-[#111827] dark:text-card-foreground', valueColor)}>
        {value}
      </p>

      {trendValue && (
        <p className="mt-2 flex items-center gap-1 text-xs">
          {trendIcon}
          <span className={cn('font-medium', trendValueColor)}>{trendValue}</span>
          {trendLabel && <span className={trendLabelColor}>{trendLabel}</span>}
        </p>
      )}

      {!trendValue && subtext && <p className="mt-2 text-xs text-gray-400">{subtext}</p>}
    </div>
  )
}