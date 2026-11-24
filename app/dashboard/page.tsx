'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  Receipt,
  PieChart,
} from 'lucide-react'
import { RedArrowUp, Total, Arr, Bag, Icon, TotalCash, BankDeposit, BankPlus, In, Giftbox, ArrowDown  } from '@/components/icons'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { StatCard } from '@/components/dashboard/stat-card'
import { RevenueOverviewChart } from '@/components/dashboard/revenue-overview-chart'
import { PeriodToggle } from '@/components/dashboard/period-toggle'
import { FilterDropdown } from '@/components/dashboard/filter-dropdown'
import { StatsCardsGrid } from '@/components/dashboard/StatsCardsGrid'
import { useAuth } from '@/lib/auth/store'
import { toFormError } from '@/lib/auth/api'
import { getSummary, getRevenueChart, getToday, type SummaryResponse, type ChartResponse, type TodayResponse } from '@/lib/dashboard/api'
import { formatNaira, formatNumber, formatChange, comparisonLabel } from '@/lib/dashboard/format'
import { PERIOD_BY_LABEL, type PeriodLabel, type StandardPeriodKey } from '@/lib/dashboard/period'

const CARD_PERIODS: Record<string, StandardPeriodKey> = { 'Daily': 'today', 'This Month': 'this_month' }

// for StatCard
// for StatCard
function cardTrend(pct: number | null, vs: string) {
  const c = formatChange(pct)
  const icon =
    c.direction === 'up' ? <Arr className="h-3 w-3 text-green-600" />
    : c.direction === 'down' ? <ArrowDown className="h-3 w-3 text-red-600" />
    : undefined

  return {
    icon,
    changeValue: c.text,
    changeValueColor: c.direction === 'up' ? 'text-green-600' : c.direction === 'down' ? 'text-red-600' : 'text-gray-400',
    changeLabel: vs,
    changeLabelColor: 'text-gray-400',
  }
}

// for StatsCardsGrid (isPositive: null = neutral)
function gridTrend(pct: number | null, label: string) {
  const c = formatChange(pct)
  return { value: c.text, label, isPositive: c.direction === 'none' ? null : c.direction === 'up' }
}

export default function DashboardPage() {
  const { admin, status } = useAuth()
  const ready = status === 'authenticated' && !admin?.must_change_password

  const [period, setPeriod] = useState('This Month')
  const [chartPeriod, setChartPeriod] = useState<PeriodLabel>('Month')
  const [summary, setSummary] = useState<SummaryResponse | null>(null)
  const [chart, setChart] = useState<ChartResponse | null>(null)
  const [today, setToday] = useState<TodayResponse | null>(null)
  const [errors, setErrors] = useState<{ summary?: string; chart?: string; today?: string }>({})
  const firstName = admin?.full_name.split(' ')[0]
  
  console.log('auth', status, admin?.must_change_password)

  useEffect(() => {
    if (!ready) return
    let stale = false
    getSummary(CARD_PERIODS[period])
      .then((r) => { if (!stale) { setSummary(r); setErrors((e) => ({ ...e, summary: undefined })) } })
      .catch((err) => { if (!stale) setErrors((e) => ({ ...e, summary: toFormError(err).message })) })
    return () => { stale = true }
  }, [ready, period])

  useEffect(() => {
    if (!ready) return
    let stale = false
    getRevenueChart(PERIOD_BY_LABEL[chartPeriod])
      .then((r) => { if (!stale) { setChart(r); setErrors((e) => ({ ...e, chart: undefined })) } })
      .catch((err) => { if (!stale) setErrors((e) => ({ ...e, chart: toFormError(err).message })) })
    return () => { stale = true }
  }, [ready, chartPeriod])

  useEffect(() => {
    if (!ready) return
    let stale = false
    getToday()
      .then((r) => { if (!stale) { setToday(r); setErrors((e) => ({ ...e, today: undefined })) } })
      .catch((err) => { if (!stale) setErrors((e) => ({ ...e, today: toFormError(err).message })) })
    return () => { stale = true }
  }, [ready])

  const vs = comparisonLabel(CARD_PERIODS[period]) ?? ''
  const chartData = (chart?.points ?? [])
    .filter((p) => new Date(p.start) <= new Date()) // cut the line at "now"
    .map((p) => ({ month: p.label, income: p.deposit, cashback: p.cashback }))

  const metrics = today && [
    { id: 'total-deposit-today',  title: 'Total Deposit (today so far)',   value: formatNaira(today.deposit.today.amount),       icon: <BankPlus className="h-5 w-5" />,    trend: gridTrend(today.deposit.today.change_percent, 'vs yesterday') },
    { id: 'total-deposit-month',  title: 'Total Deposit (this month)',     value: formatNaira(today.deposit.this_month.amount),  icon: <BankDeposit className="h-5 w-5" />, trend: gridTrend(today.deposit.this_month.change_percent, 'vs last month') },
    { id: 'total-cashback-today', title: 'Total Cash back (today so far)', value: formatNaira(today.cashback.today.amount),      icon: <TotalCash className="h-5 w-5" />,   trend: gridTrend(today.cashback.today.change_percent, 'vs yesterday') },
    { id: 'total-cashback-month', title: 'Total Cashback (this month)',    value: formatNaira(today.cashback.this_month.amount), icon: <Giftbox className="h-5 w-5" />,     trend: gridTrend(today.cashback.this_month.change_percent, 'vs last month') },
    { id: 'number-of-sales',      title: 'Number of Sales (today)',        value: formatNumber(today.sales_today.count),         icon: <In className="h-4 w-4" />,          trend: gridTrend(today.sales_today.change_percent, 'vs yesterday') },
  ]

  return (
  <div className="flex min-h-full flex-col gap-4 rounded-lg border bg-white p-4">

      {/* header */}
      <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold sm:text-xl">
              {firstName ? `Hey ${firstName}, Welcome back!` : 'Welcome back!'}
            </h1>
            <Image
              src="/t.png"
              alt="Welcome"
              width={30}
              height={40}
              style={{ height: 'auto', width: 'auto' }}
            />
          </div>

          <p className="text-sm text-gray-500">
            Here is what is happening within SAO fuel
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/dashboard/revenue-analytics" className="flex-1 sm:flex-none">
            <Button className="w-full bg-[#E50019] hover:bg-red-700 sm:w-auto"> <Bag /> Revenue</Button>
          </Link>
          <FilterDropdown icon={<Icon />} options={['Daily', 'This Month']} value={period} onChange={setPeriod} />
        </div>
      </div>

      {/* stat card rows */}
  {/* stat card rows */}
<div className="grid shrink-0 grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 ">
        <StatCard
          icon={<RedArrowUp />}
          iconBgColor="bg-[#FEE2E2]"
          label="Total Sales"
          value={summary ? formatNaira(summary.total_sales.amount) : '…'}
          trend={cardTrend(summary?.total_sales.change_percent ?? null, vs)}
        />
        <StatCard
          icon={<Receipt className="h-5 w-5 text-red-500" />}
          iconBgColor="bg-red-50"
          label="Total Transactions"
          value={summary ? formatNumber(summary.transactions.count) : '…'}
          trend={cardTrend(summary?.transactions.change_percent ?? null, vs)}
        />
        <StatCard
          icon={<Total />}
          iconBgColor="bg-[#FEE2E2]"
          label="Total Liters Sold"
          value={summary ? `${formatNumber(summary.litres_sold.litres)} L` : '…'}
          trend={cardTrend(summary?.litres_sold.change_percent ?? null, vs)}
        />
        <StatCard
          icon={<PieChart className="h-5 w-5 text-amber-500" />}
          iconBgColor="bg-[#FFEDD5]"
          label="Gross Profit"
          value={summary ? formatNaira(summary.gross_profit.amount) : '…'}
          trend={cardTrend(summary?.gross_profit.change_percent ?? null, vs)}
        />
      </div>

     {errors.summary && (
      <p role="alert" className="shrink-0 text-xs text-red-600">{errors.summary}</p>
    )}

      {/* charts row */}
  
        <div className="flex min-h-[320px] flex-1 flex-col rounded-xl border bg-white p-4">
      <div className="mb-2 flex shrink-0 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col flex-wrap items-center gap-2">
              <h2 className="font-medium mr-3">Revenue Overview</h2>
              <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="h-1 w-4 bg-[#CB3CFF] rounded-full" /> Cashback</span>
                <span className="flex items-center gap-1"><span className="h-1 w-4 bg-[#00C2FF] rounded-full" /> Deposit</span>
              </div>
            </div>
            <PeriodToggle value={chartPeriod} onChange={setChartPeriod} />
          </div>
         {errors.chart && (
        <p role="alert" className="mb-2 shrink-0 text-xs text-red-600">{errors.chart}</p>
      )}
         <div className="relative min-h-[220px] flex-1">
  <RevenueOverviewChart data={chartData} />
</div>
        </div>
      

       <div className="shrink-0">
      {errors.today && (
        <p role="alert" className="mb-2 text-xs text-red-600">{errors.today}</p>
      )}
      {metrics && <StatsCardsGrid metrics={metrics} />}
    </div>
    </div>
  )
}