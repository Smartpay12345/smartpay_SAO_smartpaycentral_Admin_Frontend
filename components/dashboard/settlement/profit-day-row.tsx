// components/dashboard/settlement/profit-day-row.tsx
import { cn } from '@/lib/utils'
import { formatLagosDay, formatNaira } from './settlement-format'
import type { ProfitDay } from '@/lib/dashboard/settlement-types'

/** One line per day. No destination, reference or status badge: profit is not a bank payout. */
export function ProfitDayRow({ day }: { day: ProfitDay }) {
  const income = day.income.service_charge + day.income.stamp_duty + day.income.withdrawal_fee
  const costs = day.costs.cashback + day.costs.deposit_fees

  return (
    <div className="flex items-start justify-between gap-3 border-b border-gray-100 py-3 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900">{formatLagosDay(day.date, true)}</p>
        <p className="mt-0.5 text-xs text-gray-400">
          {day.fuel_sales} fuel {day.fuel_sales === 1 ? 'sale' : 'sales'}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p
          className={cn(
            'text-sm font-semibold',
            day.profit < 0 ? 'text-red-600' : day.profit === 0 ? 'text-gray-500' : 'text-gray-900',
          )}
        >
          {formatNaira(day.profit)}
        </p>
        <p className="mt-0.5 text-xs text-gray-400">
          Income {formatNaira(income)} · Costs {formatNaira(costs)}
        </p>
      </div>
    </div>
  )
}
