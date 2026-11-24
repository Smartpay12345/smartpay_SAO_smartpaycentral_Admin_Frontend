'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { Dm, Wallet, ArrowUp, ArrowDown, TotalCash, Giftbox, Iconpetrol, RedD, Tank, Fire } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { RevenueStatCard } from '@/components/dashboard/revenue-stat-card'
import { StatsCardsGrid } from '@/components/dashboard/StatsCardsGrid'
import { AsyncPanel } from '@/lib/dashboard/async-panel' // use the same import as your Sales Overview page
import { useEndpoint } from '@/hooks/use-endpoint'
import { revenueSummary, cashbackBreakdown } from '@/lib/dashboard/api'

import { comparisonLabel, formatChange } from '@/lib/dashboard/format'
import { formatCurrencyFull } from '@/lib/utils/format'
import type { PeriodFilter, PeriodInfo, ProductCode } from '@/lib/dashboard/types'

const CARDS_FILTER: PeriodFilter = { period: 'this_week' }

const BREAKDOWN_PERIODS = [
  { label: 'Today', key: 'today', text: 'today' },
  { label: 'This Week', key: 'this_week', text: 'this week' },
  { label: 'This Month', key: 'this_month', text: 'this month' },
] as const

// icon follows the product code, so it stays right whatever order the API returns
const PRODUCT_ICON: Record<ProductCode, ReactNode> = {
  PMS: <Iconpetrol className="h-5 w-5" />,
  AGO: <RedD className="h-5 w-5" />,
  DPK: <Tank className="h-5 w-5" />,
  LPG: <Fire className="h-5 w-5" />,
}

// props for RevenueStatCard. null change shows "-" and no label, never 0%
function cardTrend(change: number | null, key: PeriodInfo['key']) {
  const { text, direction } = formatChange(change)
  return {
    trendIcon: direction === 'up' ? <ArrowUp /> : direction === 'down' ? <ArrowDown /> : <span />,
    trendValue: text,
    trendValueColor: direction === 'up' ? 'text-green-600' : direction === 'down' ? 'text-red-600' : 'text-gray-400',
    trendLabel: change === null ? '' : (comparisonLabel(key) ?? ''),
    trendLabelColor: 'text-gray-400',
  }
}

// trend for StatsCardsGrid (isPositive: null = neutral)
function gridTrend(change: number | null, key: PeriodInfo['key']) {
  const { text, direction } = formatChange(change)
  return {
    value: text,
    label: change === null ? '' : (comparisonLabel(key) ?? ''),
    isPositive: direction === 'none' ? null : direction === 'up',
  }
}

export default function RevenueAnalyticsPage() {
  const [breakdownKey, setBreakdownKey] = useState<(typeof BREAKDOWN_PERIODS)[number]['key']>('today')
  const breakdownPeriod = BREAKDOWN_PERIODS.find((p) => p.key === breakdownKey) ?? BREAKDOWN_PERIODS[0]

const summary = useEndpoint('revenue-summary', CARDS_FILTER, () => revenueSummary(CARDS_FILTER))

const breakdownFilter: PeriodFilter = { period: breakdownKey }   // built from the dropdown's current value
const breakdown = useEndpoint(
  'cashback-breakdown',
  breakdownFilter,
  () => cashbackBreakdown(breakdownFilter),
  { keepPrevious: false },
)

  return (
    <div className="flex min-h-full flex-col gap-4 rounded-lg border bg-white p-4 lg:h-full lg:overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Revenue Analytics</h1>
          <p className="text-sm text-gray-500">Track your incoming revenue and overall financial health.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard">
            <Button variant="secondary">
              <ArrowLeft className="mr-2 h-4 w-4 text-[#CD0102]" />
              Back
            </Button>
          </Link>
          <Link href="/dashboard/settlement">
            <Button>View Settlement</Button>
          </Link>
        </div>
      </div>

      <AsyncPanel state={summary} height="h-28">
        {(d) => {
          const loss = d.settlement.amount < 0
          return (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <RevenueStatCard
                icon={<Wallet />}
                label="Total Revenue"
                value={formatCurrencyFull(d.total_revenue.amount)}
                iconBg="bg-red-50"
                {...cardTrend(d.total_revenue.change_percent, d.period.key)}
              />
              <RevenueStatCard
                icon={<TotalCash />}
                label="Total Cashback"
                value={formatCurrencyFull(d.total_cashback.amount)}
                iconBg="bg-red-50"
                {...cardTrend(d.total_cashback.change_percent, d.period.key)}
              />
              <RevenueStatCard
                icon={<Dm />}
                label="Settlement"
                value={loss ? `-${formatCurrencyFull(Math.abs(d.settlement.amount))}` : formatCurrencyFull(d.settlement.amount)}
                subtext="Available for payout"
                iconBg="bg-green-50"
                valueColor={loss ? 'text-red-600' : 'text-primary'}
              />
            </div>
          )
        }}
      </AsyncPanel>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="font-bold text-[#111827]">Cashback Break down</p>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<button type="button" className="text-sm text-gray-500 border rounded-lg flex p-2" />}
            >
              Showing results for {breakdownPeriod.label}
              <span><ChevronDown className="h-4 w-4 mt-1" /></span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {BREAKDOWN_PERIODS.map((p) => (
                <DropdownMenuItem key={p.key} onClick={() => setBreakdownKey(p.key)}>
                  {p.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <AsyncPanel state={breakdown} height="h-28">
          {(d) => (
            <StatsCardsGrid
              metrics={[
                ...d.products.map((p) => ({
                  id: `cashback-${p.code.toLowerCase()}`,
                  title: `${p.code} (${p.name})`,
                  value: formatCurrencyFull(p.amount, { decimals: 2 }),
                  icon: PRODUCT_ICON[p.code],
                  trend: gridTrend(p.change_percent, d.period.key),
                })),
                {
                  id: 'cashback-total',
                  title: `Total Cashback (${breakdownPeriod.text})`,
                  value: formatCurrencyFull(d.total.amount, { decimals: 2 }),
                  icon: <Giftbox className="h-5 w-5" />,
                  trend: gridTrend(d.total.change_percent, d.period.key),
                },
              ]}
            />
          )}
        </AsyncPanel>
      </div>
    </div>
  )
}