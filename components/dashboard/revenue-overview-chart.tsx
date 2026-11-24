'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatNaira } from '@/lib/dashboard/format'

interface RevenueOverviewChartProps {
  data: { month: string; income: number; cashback: number }[]
}

const DEPOSIT = '#00C2FF'
const CASHBACK = '#CB3CFF'

const compact = (v: number) =>
  new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(v)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const get = (key: string) => payload.find((p: { dataKey: string }) => p.dataKey === key)?.value ?? 0
  return (
    <div className="w-[250px] rounded-lg bg-white px-3 py-2 text-xs text-[#6B7280] shadow-lg">
      <p className="mb-1 font-medium">{label} {new Date().getFullYear()}</p>
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: DEPOSIT }} /> Deposit
        </p>
        <span className="text-right font-bold">{formatNaira(get('income'))}</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: CASHBACK }} /> Cashback
        </p>
        <span className="text-right font-bold">{formatNaira(get('cashback'))}</span>
      </div>
    </div>
  )
}

// The parent must be `relative` and have a height; this fills it exactly.
export function RevenueOverviewChart({ data }: RevenueOverviewChartProps) {
  return (
    <div className="absolute inset-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 4 }}>
          <defs>
            <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={DEPOSIT} stopOpacity={0.25} />
              <stop offset="100%" stopColor={DEPOSIT} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="cashbackFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CASHBACK} stopOpacity={0.25} />
              <stop offset="100%" stopColor={CASHBACK} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#F1F1F1" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            tickMargin={10}
            padding={{ left: 12, right: 12 }}
            interval="preserveStartEnd"
            minTickGap={16}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            width={44}
            allowDecimals={false}
            tickFormatter={compact}
            domain={[0, (max: number) => Math.max(max, 4)]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="income" stroke={DEPOSIT} strokeWidth={2} fill="url(#incomeFill)" />
          <Area type="monotone" dataKey="cashback" stroke={CASHBACK} strokeWidth={2} fill="url(#cashbackFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}