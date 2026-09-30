'use client'

import { MoreVertical } from 'lucide-react'
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts'

export interface PeakHourDatum {
  hour: string
  value: number
  isPeak: boolean
}

interface PeakSalesHoursProps {
  data: PeakHourDatum[]
}

const PEAK_COLOR = '#B91C1C'
const OFF_PEAK_COLOR = '#FBD5D5'

export function PeakSalesHours({ data }: PeakSalesHoursProps) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-medium">Peak Sales Hours</h2>
        <button type="button" aria-label="More options">
          <MoreVertical className="h-4 w-4 text-gray-400" />
        </button>
      </div>
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="hour"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={28}>
              {data.map((entry) => (
                <Cell key={entry.hour} fill={entry.isPeak ? PEAK_COLOR : OFF_PEAK_COLOR} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}