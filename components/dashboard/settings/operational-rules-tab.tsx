'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Clock, Warn } from '@/components/icons'

interface FuelThreshold {
  key: string
  label: string
  value: number
}

export function OperationalRulesTab({ onDirtyChange }: { onDirtyChange: (dirty: boolean) => void }) {
  const [openingTime, setOpeningTime] = useState('06:00 AM')
  const [closingTime, setClosingTime] = useState('10:00 PM')
  const [thresholds, setThresholds] = useState<FuelThreshold[]>([
    { key: 'pms', label: 'PMS (Petrol)', value: 15 },
    { key: 'ago', label: 'AGO (Diesel)', value: 20 },
    { key: 'dpk', label: 'DPK (Kerosene)', value: 10 },
  ])

  function updateThreshold(key: string, value: number) {
    setThresholds((prev) => prev.map((t) => (t.key === key ? { ...t, value } : t)))
    onDirtyChange(true)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-white p-5">
        <p className="mb-4 flex items-center gap-2 font-semibold"><Clock/> Station Operating Hours</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Global Opening Time</label>
            <Input  className='border border-[#FFE1DF] p-5 bg-[#F9F9FC]' value={openingTime} onChange={(e) => { setOpeningTime(e.target.value); onDirtyChange(true) }} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Global Closing Time</label>
            <Input className='border border-[#FFE1DF] p-5 bg-[#F9F9FC]' value={closingTime} onChange={(e) => { setClosingTime(e.target.value); onDirtyChange(true) }} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <p className="mb-4 flex items-center gap-2 font-semibold"><Warn/> Low Stock Alert Thresholds</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {thresholds.map((t) => (
            <div key={t.key} className='border border-[#FFE1DF] p-3 rounded-xl bg-[#F9F9FC] '>
              <label className="mb-1.5 block text-sm font-medium">{t.label}</label>
              <div className="relative">
                <Input
                  type="number"
                  value={t.value}
                  onChange={(e) => updateThreshold(t.key, Number(e.target.value))}
                  className="pr-8 border-[#E6BDB9]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">%</span>
              </div>
              <div className="mt-2 h-1 w-full rounded-full bg-gray-100">
                <div className="h-1 rounded-full bg-primary" style={{ width: `${Math.min(t.value, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}