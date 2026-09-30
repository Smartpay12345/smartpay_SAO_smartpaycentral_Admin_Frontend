'use client'

import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ExportButton } from '@/components/shared/export-button'
import { formatCurrencyFull, formatLoanDate } from '@/lib/utils/format'
import { Icon } from '../icons'

export const salesPerformanceData = [
  {
    month: 'January',
    date: '2026-01-31',
    value: 4520000.50,
    volume: 125000,
  },
  {
    month: 'February',
    date: '2026-02-28',
    value: 5120500.00,
    volume: 142000,
  },
  {
    month: 'March',
    date: '2026-03-31',
    value: 4890000.25,
    volume: 135500,
  },
  {
    month: 'April',
    date: '2026-04-30',
    value: 6200000.00,
    volume: 171000,
  },
  {
    month: 'May',
    date: '2026-05-31',
    value: 5850400.75,
    volume: 160200,
  },
  {
    month: 'June',
    date: '2026-06-30',
    value: 7100000.00,
    volume: 195000,
  },
]

const PERIOD_OPTIONS = ['This Week', 'This Month', 'This Quarter', 'This Year']

interface SalesOverviewHeaderProps {
  selectedPeriod: string
  onPeriodChange: (period: string) => void
  onExport: () => void
}

export function SalesOverviewHeader({
  selectedPeriod,
  onPeriodChange,
}: SalesOverviewHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold">Sales Overview</h1>
        <p className="text-sm text-gray-500">Analyze your revenue, volume, and performance trends.</p>
      </div>
      <div className="flex gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline" className="gap-2">
              <Icon />
              {selectedPeriod}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {PERIOD_OPTIONS.map((option) => (
              <DropdownMenuItem key={option} onClick={() => onPeriodChange(option)}>
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <ExportButton
          filename="sales-overview"
          title="Sales Overview Report"
          data={salesPerformanceData}
          columns={[
            { key: 'month', header: 'Month' },
            { key: 'date', header: 'Date', formatter: (v) => formatLoanDate(v) },
            { key: 'value', header: 'Sales Value', formatter: (v) => formatCurrencyFull(v, { decimals: 2 }) },
            { key: 'volume', header: 'Volume (L)', formatter: (v) => `${Number(v ?? 0).toLocaleString()} L` },
          ]}
        />
      </div>
    </div>
  )
}