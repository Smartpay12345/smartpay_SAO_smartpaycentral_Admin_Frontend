'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FilterDropdown } from '@/components/dashboard/filter-dropdown'
import { AlertCard } from '@/components/dashboard/alerts/alert-card'
import type { Alert } from '@/lib/types/alert'
import { Complete, Update, Add, Warn } from '@/components/icons'
import { CheckCheck } from 'lucide-react'

const initialAlerts: Alert[] = [
  { id: '1', icon: <Warn  />, iconBg: 'bg-[#FFDAD6]', title: 'Low stock detected at SAO Ikeja', description: 'PMS levels at Pump 3 have fallen below the 15% threshold. Refill required immediately to prevent service disruption.', timeAgo: '10 mins ago', read: false, priority: 'high', category: 'operational', linkLabel: 'View Station' },
  { id: '2', icon: <Add  />, iconBg: 'bg-[#D6E3FF]', title: 'New Manager Added', description: "Admin 'Tobi Adeyemi' has successfully onboarded a new station manager for the Idi Ape branch.", timeAgo: '1 hour ago', read: false, category: 'operational', linkLabel: 'Review Profile' },
  { id: '3', icon: <Update  />, iconBg: 'bg-[#FCDBD8]', title: 'System Update scheduled', description: 'Smartpay core infrastructure will undergo routine maintenance on Sunday at 02:00 AM WAT. Expected downtime is 15 minutes.', timeAgo: 'Yesterday, 14:30', read: true, category: 'system' },
  { id: '4', icon: <Complete  />, iconBg: 'bg-[#9CF7A2]', title: 'Daily Reconciliation Complete', description: 'All stations have successfully reported end-of-day sales figures. No discrepancies found.', timeAgo: 'Yesterday, 23:59', read: true, category: 'system', linkLabel: 'View Report' },
]

const tabs = [
  { key: 'all', label: 'All Alerts' },
  { key: 'unread', label: 'Unread' },
  { key: 'system', label: 'System' },
] as const

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(initialAlerts)
  const [tab, setTab] = useState<(typeof tabs)[number]['key']>('all')
  const [priorityFilter, setPriorityFilter] = useState('All Priorities')

  const unreadCount = alerts.filter((a) => !a.read).length
  const systemCount = alerts.filter((a) => a.category === 'system').length

  const filtered = alerts.filter((a) => {
    if (tab === 'unread') return !a.read
    if (tab === 'system') return a.category === 'system'
    return true
  })

  function markAllRead() {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Alerts & Notifications</h1>
          <p className="text-sm text-gray-500">Review and manage system-wide operational alerts across all stations.</p>
        </div>
        <div className="flex gap-3">
          <FilterDropdown options={['All Priorities', 'High', 'Normal']} value={priorityFilter} onChange={setPriorityFilter} />
          <Button onClick={markAllRead} variant="outline" className="border-red-200 bg-red-50 text-primary hover:bg-red-100">
            <CheckCheck/> Mark all as read
          </Button>
        </div>
      </div>

      <div className="flex gap-6 border-b text-sm">
        <button onClick={() => setTab('all')} className={tab === 'all' ? 'border-b-2 border-primary pb-2 font-medium text-primary' : 'pb-2 text-gray-400'}>
          All Alerts ({alerts.length})
        </button>
        <button onClick={() => setTab('unread')} className={tab === 'unread' ? 'border-b-2 border-primary pb-2 font-medium text-primary' : 'pb-2 text-gray-400'}>
          Unread ({unreadCount})
        </button>
        <button onClick={() => setTab('system')} className={tab === 'system' ? 'border-b-2 border-primary pb-2 font-medium text-primary' : 'pb-2 text-gray-400'}>
          System ({systemCount})
        </button>
      </div>

      <div className="space-y-3">
        {filtered.map((alert) => (
          <AlertCard
            key={alert.id}
            alert={alert}
            onLinkClick={() => setAlerts((prev) => prev.map((a) => (a.id === alert.id ? { ...a, read: true } : a)))}
          />
        ))}
      </div>

      <div className="flex justify-center">
        <button className="rounded-lg border px-4 py-2 text-sm text-gray-500 hover:bg-gray-50">
          Load More Notifications
        </button>
      </div>
    </div>
  )
}