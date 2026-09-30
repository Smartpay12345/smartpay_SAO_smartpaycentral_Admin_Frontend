'use client'

import { useState } from 'react'
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { cn } from '@/lib/utils'
import { formatCurrencyCompact, formatLoanDate } from '@/lib/utils/format'

export interface SalesPerformanceDatum {
  month: string
  date: string // ISO date, e.g. '2026-08-15'
  value: number // ₦
  volume: number // liters
}

interface SalesPerformanceChartProps {
  data: SalesPerformanceDatum[]
}

const PERIODS = ['Day', 'Week', 'Month', 'Year'] as const
type Period = (typeof PERIODS)[number]

function formatVolumeCompact(value: unknown): string {
  const num = Number(value)
  const safe = Number.isFinite(num) ? num : 0
  const abs = Math.abs(safe)
  if (abs >= 1_000_000) return `${(safe / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${(safe / 1_000).toFixed(0)}K`
  return safe.toLocaleString()
}

interface TooltipPayloadItem {
  value?: number
  payload?: SalesPerformanceDatum
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
}) {
  if (!active || !payload || payload.length === 0) return null
  const point = payload[0]?.payload
  if (!point) return null

  return (
    <div className="rounded-lg bg-white px-3 py-2 text-xs text-black shadow-lg">
      <p className="mb-1 font-medium">{formatLoanDate(point.date, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
      <p className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-red-600" /> Value: {formatCurrencyCompact(point.value)}
      </p>
      <p className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-blue-500" /> Volume: {formatVolumeCompact(point.volume)} L
      </p>
    </div>
  )
}

export function SalesPerformanceChart({ data }: SalesPerformanceChartProps) {
  const [period, setPeriod] = useState<Period>('Month')

  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-medium">Sales Performance</h2>
          <p className="text-xs text-gray-400">Volume vs Value over time</p>
        </div>
        <div className="flex gap-1 rounded-lg bg-[#FBD5D5] p-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={cn(
                'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                period === p
                  ? 'border border-red-200 bg-white text-black-600'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="salesValueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#DC2626" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#DC2626" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#F1F1F1" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
            />
            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              tickFormatter={(v: number) => (v === 0 ? '0' : `${v / 1_000_000}M`)}
              domain={[0, 100_000_000]}
            />
            <YAxis yAxisId="right" orientation="right" hide domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="value"
              stroke="#DC2626"
              strokeWidth={2}
              fill="url(#salesValueFill)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="volume"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex justify-between gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-600" /> Sales Value (₦)</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> Sales Volume (L)</span>
      </div>
    </div>
  )
}