import { cn } from '@/lib/utils'

type Variant = 'success' | 'warning' | 'danger' | 'neutral' | 'info'


const statusMap: Record<string, { label: string; variant: Variant }> = {
  completed: { label: 'Completed', variant: 'success' },
  pending: { label: 'Pending', variant: 'info' },
  online: { label: 'Online', variant: 'success' },
  maintenance: { label: 'Maintenance', variant: 'warning' },
  offline: { label: 'Offline', variant: 'danger' },
  active: { label: 'Active', variant: 'success' },
  suspended: { label: 'Suspended', variant: 'danger' },
}

const variantStyles: Record<Variant, string> = {
  success: 'bg-green-50 text-green-600',
  warning: 'bg-orange-50 text-orange-600',
  danger: 'bg-red-50 text-red-600',
  info: 'bg-blue-50 text-blue-600',
  neutral: 'bg-gray-100 text-gray-600',
}

export function StatusBadge({ status }: { status: string }) {
  const entry = statusMap[status.toLowerCase()] ?? { label: status, variant: 'neutral' as Variant }
  return (
    <span className={cn('rounded-full px-4 py-1 text-xs font-medium', variantStyles[entry.variant])}>
      {entry.label}
    </span>
  )
}