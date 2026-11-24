import { cn } from '@/lib/utils'

export type DetailView = 'account' | 'ip' | 'activity' | 'message' | 'restrict' | 'remove' | 'transactions'

interface DetailHeaderTabsProps {
  view: DetailView
  onChange: (v: DetailView) => void
  restrictLabel: 'Restrict' | 'Reinstate' | 'Restricted'
  showRemove?: boolean
  removeLabel?: 'Remove' | 'Restore'
  hide?: DetailView[]
}

export function DetailHeaderTabs({ view, onChange, restrictLabel, showRemove, removeLabel = 'Remove', hide = [] }: DetailHeaderTabsProps) {
  const allTabs: { key: DetailView; label: string; color: string }[] = [
    { key: 'ip', label: 'IP Stat', color: 'text-gray-500' },
    { key: 'activity', label: 'User App Activities', color: 'text-orange-500' },
    { key: 'message', label: 'Message', color: 'text-blue-500' },
    { key: 'transactions', label: 'Transactions', color: 'text-purple-500' },
    { key: 'restrict', label: restrictLabel, color: restrictLabel === 'Reinstate' ? 'text-green-600' : 'text-red-500' },
    ...(showRemove
      ? [{ key: 'remove' as DetailView, label: removeLabel, color: removeLabel === 'Restore' ? 'text-green-600' : 'text-red-600' }]
      : []),
  ]

  const tabs = allTabs.filter((t) => !hide.includes(t.key))

  return (
    <div className="flex flex-wrap gap-4 text-xs font-medium">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(view === t.key ? 'account' : t.key)}
          className={cn(view === t.key ? 'underline underline-offset-4' : '', t.color)}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}