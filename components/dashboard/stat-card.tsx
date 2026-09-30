import { cn } from '@/lib/utils'

interface StatCardTrend {
  icon: React.ReactNode
  changeValue: string
  changeValueColor?: string
  changeLabel?: string
  changeLabelColor?: string
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  trend?: StatCardTrend
  subtext?: string
  iconBgColor?: string
  valueColor?: string
  iconPosition?: 'left' | 'right'
}

export function StatCard({
  icon,
  label,
  value,
  trend,
  subtext,
  iconBgColor = 'bg-primary/10',
  valueColor,
  iconPosition = 'left',
}: StatCardProps) {
  return (
    <div
      className={cn(
        'flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-card py-4 px-4',
        // If icon is on the right, reverse the flex direction
        iconPosition === 'left' && 'flex-row-reverse'
      )}
    >
      {/* Text Content Wrapper: flex-1 ensures it fills the remaining space */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <p className="text-[13.35px] font-medium leading-[19.07px] text-[#6B7280] truncate">{label}</p>

        <p className={cn('text-[17px] font-bold leading-[26.7px] text-[#111827] dark:text-card-foreground', valueColor)}>
          {value}
        </p>

        {trend && (
          <p className="flex items-center gap-1 text-[10.5px] whitespace-nowrap">
            <span>{trend.icon}</span>
            <span
              className={cn(
                trend.changeValueColor ?? 'text-green-600'
              )}
            >
              {trend.changeValue}
            </span>
            {trend.changeLabel && (
              <span className={trend.changeLabelColor ?? 'text-muted-foreground'}>{trend.changeLabel}</span>
            )}
          </p>
        )}

        {!trend && subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
      </div>

      {/* Icon Container */}
      <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', iconBgColor)}>
        {icon}
      </div>
    </div>
  )
}