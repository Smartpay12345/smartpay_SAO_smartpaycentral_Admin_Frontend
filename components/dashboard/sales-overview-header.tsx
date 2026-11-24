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
import { formatCurrencyFull } from '@/lib/utils/format'
import { Icon } from '../icons'
import { SALES_PERIODS, periodLabel, type SalesPeriodKey } from '@/lib/dashboard/sales-periods'

export interface SalesExportRow {
  code: string
  name: string
  sales: number
  quantity: number | null
  unit: string
  transactions: number
  share: number | null
}

interface SalesOverviewHeaderProps {
  selectedPeriod: SalesPeriodKey
  onPeriodChange: (period: SalesPeriodKey) => void
  exportRows?: SalesExportRow[]
}

export function SalesOverviewHeader({ selectedPeriod, onPeriodChange, exportRows }: SalesOverviewHeaderProps) {
  const label = periodLabel(selectedPeriod)

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold">Sales Overview</h1>
        <p className="text-sm text-gray-500">Analyze your revenue, volume, and performance trends.</p>
      </div>
      <div className="flex gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="secondary" className="gap-2 border border-[#E6BDB9] text-black-500" />}
          >
            <Icon />
            {label}
            <ChevronDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {SALES_PERIODS.map((p) => (
              <DropdownMenuItem key={p.key} onClick={() => onPeriodChange(p.key)}>
                {p.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <ExportButton
          filename={`sales-overview-${selectedPeriod}`}
          title={`Sales Overview Report - ${label}`}
          data={exportRows ?? []}
          disabled={!exportRows}
          columns={[
            { key: 'code', header: 'Code' },
            { key: 'name', header: 'Product' },
            {
              key: 'sales', header: 'Sales Value (NGN)', numeric: true, numFmt: '#,##0.00',
              formatter: (v) => formatCurrencyFull(v, { decimals: 2 })
            },
            {
              key: 'quantity', header: 'Quantity', numeric: true, numFmt: '#,##0',
              formatter: (v) => (v == null ? '' : Number(v).toLocaleString())
            },
            { key: 'unit', header: 'Unit' },
            {
              key: 'transactions', header: 'Transactions', numeric: true, numFmt: '#,##0',
              formatter: (v) => Number(v ?? 0).toLocaleString()
            },
            {
              key: 'share', header: 'Share (%)', numeric: true, numFmt: '0.0',
              formatter: (v) => (v == null ? '' : `${v}%`)
            },
          ]}
        />
      </div>
    </div>
  )
}