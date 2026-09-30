'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface RevenueOverviewChartProps {
  data: { month: string; income: number; cashback: number }[]
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null
  return (
    <div className="rounded-lg bg-white px-3 py-2 text-xs text-[#6B7280] shadow-lg">
      <p className="mb-1 font-medium ">{label} 2026</p>
      <p className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-blue-400" /> Income ₦{payload[0]?.value}
      </p>
      <p className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-green-400" /> Cashback ₦{payload[1]?.value}
      </p>
    </div>
  )
}

export function RevenueOverviewChart({ data }: RevenueOverviewChartProps) {
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="cashbackFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22C55E" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#F1F1F1" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} tickMargin={10}/>
          <YAxis
  axisLine={false}
  tickLine={false}
  tick={{ fontSize: 11, fill: '#9CA3AF' }}
  width={35}
/>
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="income" stroke="#3B82F6" strokeWidth={2} fill="url(#incomeFill)" />
          <Area type="monotone" dataKey="cashback" stroke="#22C55E" strokeWidth={2} fill="url(#cashbackFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}