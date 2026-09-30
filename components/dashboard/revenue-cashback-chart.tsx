// components/dashboard/revenue-cashback-chart.tsx
'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface RevenueCashbackChartProps {
  data: { week: string; revenue: number; cashback: number }[]
}

export function RevenueCashbackChart({ data }: RevenueCashbackChartProps) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#F1F1F1" />
          <XAxis
            dataKey="week"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
          />
          <YAxis hide />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#E11D2A"
            strokeWidth={2.5}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="cashback"
            stroke="#2563EB"
            strokeWidth={2.5}
            strokeDasharray="6 6"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}