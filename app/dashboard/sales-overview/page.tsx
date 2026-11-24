'use client'

import { useState } from 'react'
import { StatCard } from '@/components/dashboard/stat-card'
import { SalesOverviewHeader } from '@/components/dashboard/sales-overview-header'
import { SalesByProductType} from '@/components/dashboard/sales-by-product-type'
import { PeakSalesHours} from '@/components/dashboard/peak-sales-hours'
import { formatCurrencyFull } from '@/lib/utils/format'
import { Liter, Trans, Tsales, Circle, ArrowDown, ArrowUp, Fire, Iconpetrol, RedD, Tank,} from '@/components/icons'
import { ProductStatCard } from '@/components/dashboard/transactions/product-stat-card'
import { AsyncPanel } from '@/lib/dashboard/async-panel'
import { ReactNode } from 'react'
import { useEndpoint } from '@/hooks/use-endpoint'
import { getSalesOverview, getPeakHours } from '@/lib/dashboard/api'
import { formatNumber, formatChange, comparisonLabel } from '@/lib/dashboard/format'
import type { StandardPeriodKey } from '@/lib/dashboard/period'
import { type SalesPeriodKey } from '@/lib/dashboard/sales-periods'



// colour and icon follow the product code, so labels can come straight from the API
const PRODUCT_COLOR: Record<string, string> = { PMS: '#B91C1C', DPK: '#2563EB', LPG: '#F59E0B', AGO: '#10B981' }
const PRODUCT_VISUAL: Record<string, { icon: ReactNode; bg: string }> = {
  PMS: { icon: <Iconpetrol />, bg: 'bg-red-50' },
  AGO: { icon: <RedD />, bg: 'bg-blue-50' },
  DPK: { icon: <Tank />, bg: 'bg-blue-50' },
  LPG: { icon: <Fire />, bg: 'bg-blue-50' },
}

// change_percent -> props for StatCard's trend. null shows "-", never 0%
function trendProps(pct: number | null, label: string) {
  const c = formatChange(pct)
  return {
    icon: c.direction === 'none' ? undefined : c.direction === 'up' ? <ArrowUp /> : <ArrowDown />,
    changeValue: c.text,
    changeValueColor: c.direction === 'up' ? 'text-green-600' : c.direction === 'down' ? 'text-red-600' : 'text-gray-400',
    changeLabel: label,
    changeLabelColor: 'text-gray-400',
  }
}


export default function SalesOverviewPage() {
const [period, setPeriod] = useState<SalesPeriodKey>('today')
const vs = comparisonLabel(period as StandardPeriodKey) ?? ''

const overview = useEndpoint('sales-overview', period, () => getSalesOverview(period), { keepPrevious: false })
const peak = useEndpoint('sales-peak-hours', period, () => getPeakHours(period), { keepPrevious: false })

// one row per product, plus a total row
const exportRows = overview.data && [
  ...overview.data.products.map((p) => ({
    code: p.code, name: p.name, sales: p.sales, quantity: p.quantity,
    unit: p.unit, transactions: p.transactions, share: p.share_percent,
  })),
  {
    code: 'TOTAL', name: 'All products', sales: overview.data.total_sales.amount,
    quantity: null, unit: '', transactions: overview.data.transactions.count, share: null,
  },
]

  return (
    <div className="space-y-6 bg-white p-6 border rounded-lg">
      <SalesOverviewHeader selectedPeriod={period} onPeriodChange={setPeriod} exportRows={exportRows} />

      {/* top cards */}
      <AsyncPanel state={overview} height="h-28">
        {(d) => (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <StatCard
              icon={<Tsales className="h-5 w-5 text-primary" />}
              iconBgColor="bg-pink-50"
              label="Total Sales"
              value={formatCurrencyFull(d.total_sales.amount)}
              trend={trendProps(d.total_sales.change_percent, vs)}
            />
            <StatCard
              icon={<Liter className="h-5 w-5 text-primary" />}
              iconBgColor="bg-blue-50"
              label="Total Liters Sold"
              value={`${formatNumber(d.litres_sold.litres)} L`}
              trend={trendProps(d.litres_sold.change_percent, vs)}
            />
            <StatCard
              icon={<Trans className="h-5 w-5 text-primary" />}
              iconBgColor="bg-green-50"
              label="Transaction Counts"
              value={formatNumber(d.transactions.count)}
              trend={trendProps(d.transactions.change_percent, vs)}
            />
            <StatCard
              icon={<Circle className="h-5 w-5 text-primary" />}
              iconBgColor="bg-[#FCDBD8]"
              label="Sales Growth"
              value={formatChange(d.sales_growth.change_percent).text}
            />
          </div>
        )}
      </AsyncPanel>

      {/* product cards */}
      <AsyncPanel state={overview} height="h-28">
        {(d) => (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            {d.products.map((p) => (
              <ProductStatCard
                key={p.code}
                icon={PRODUCT_VISUAL[p.code].icon}
                iconBg={PRODUCT_VISUAL[p.code].bg}
                name={p.code}
                subtitle={p.name}
                amount={formatCurrencyFull(p.sales)}
                quantity={formatNumber(p.quantity)}
                unit={p.unit === 'kg' ? 'Kilograms' : 'Liters'}
              />
            ))}
          </div>
        )}
      </AsyncPanel>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AsyncPanel state={overview} title="Sales by Product Type">
          {(d) => (
            <SalesByProductType
              data={d.products.map((p) => ({
                name: p.code,
                fullName: `${p.code} (${p.name})`,
                value: p.sales,
                color: PRODUCT_COLOR[p.code],
              }))}
            />
          )}
        </AsyncPanel>

        <AsyncPanel state={peak} title="Peak Sales Hours">
          {(d) => (
            <PeakSalesHours
              data={d.slots.map((s) => ({ hour: s.label, value: s.sales, isPeak: s.is_peak }))}
            />
          )}
        </AsyncPanel>
      </div>
    </div>
  )
}