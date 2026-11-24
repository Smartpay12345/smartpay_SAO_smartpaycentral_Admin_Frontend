'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { formatCurrencyCompact } from '@/lib/utils/format'

export interface ProductTypeDatum {
  name: string
  fullName: string
  value: number // raw ₦ amount
  color: string
}

interface SalesByProductTypeProps {
  data: ProductTypeDatum[]
}

export function SalesByProductType({ data }: SalesByProductTypeProps) {
const total = data.reduce((sum, d) => sum + (Number(d.value) || 0), 0)
const dominant = total > 0
  ? data.reduce((max, d) => (d.value > max.value ? d : max), data[0])
  : null
const dominantPct = dominant ? Math.round((dominant.value / total) * 100) : 0

  return (
    <div className="rounded-xl border bg-white p-4">
      <h2 className="mb-4 font-medium">Sales by Product Type</h2>
      <div className="flex items-center gap-6">
        <div className="relative h-[140px] w-[140px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={48}
                outerRadius={65}
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {dominant && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-semibold">{dominantPct}%</span>
              <span className="text-xs text-gray-400">{dominant.name}</span>
            </div>
          )}
        </div>

        <ul className="flex-1 space-y-3">
          {data.map((item) => (
            <li key={item.name} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-gray-600">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                {item.fullName}
              </span>
              <span className="font-medium">{formatCurrencyCompact(item.value)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}