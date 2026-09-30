import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { ActivityLog } from '@/lib/types/activity-log'
import { Location } from '@/components/icons'

export function ActivityLogRow({ log }: { log: ActivityLog }) {
  return (
    <tr className="border-b">
      <td className="whitespace-nowrap py-3 px-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
              {log.userName.split(' ').map((n) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{log.userName}</p>
            <p className="text-xs text-gray-400">{log.userRole}</p>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap p-3">
        <p className={cn('flex items-center gap-1 font-medium', log.status === 'failed' && 'text-red-600')}>
          {log.actionIcon} {log.action}
        </p>
        <p className="text-xs text-gray-400">{log.actionDetail}</p>
      </td>
      <td className="whitespace-nowrap p-3">
        {log.target === 'All Stations (Global)' || log.target === 'Admin Portal' ? (
          <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-primary">{log.target}</span>
        ) : (
          <span className="text-gray-600 flex"><Location className='text-[#5D3F3D]'/> {log.target}</span>
        )}
      </td>
      <td className="whitespace-nowrap p-3 text-gray-400">{log.dateTime}</td>
      <td className="whitespace-nowrap p-3 font-mono text-xs text-gray-400">{log.ipAddress}</td>
      <td className="whitespace-nowrap p-3">
        <span className={cn('flex items-center gap-1.5 text-sm font-medium', log.status === 'success' ? 'text-green-600' : 'text-red-600')}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {log.status === 'success' ? 'Success' : 'Failed'}
        </span>
      </td>
    </tr>
  )
}