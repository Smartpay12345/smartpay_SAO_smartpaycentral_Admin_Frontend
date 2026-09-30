// components/dashboard/products-chart.tsx
'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ProductsChartProps {
  data: { x: number; pms: number; dpk: number; lpg: number; hnk: number }[]
}

export function ProductsChart({ data }: ProductsChartProps) {
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
          <CartesianGrid vertical={false} stroke="#F1F1F1" />
          <XAxis dataKey="x" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }}   tickMargin={20}/>
         <YAxis
  axisLine={false}
  tickLine={false}
  tick={{ fontSize: 11, fill: '#9CA3AF' }}
  width={35}
/>
          <Tooltip />
          <Line type="monotone" dataKey="pms" stroke="#EC4899" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="dpk" stroke="#3B82F6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="lpg" stroke="#F97316" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="hnk" stroke="#22C55E" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}