'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { StatusBadge } from '@/components/dashboard/status-badge'
import type { Manager } from '@/lib/types/manager'

interface ManagerTableProps {
  managers: Manager[]
  onLearnMore: (manager: Manager) => void
}

export function ManagerTable({ managers, onLearnMore }: ManagerTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b bg-[#F9E8E7] text-left text-xs font-medium text-gray-600">
              <th className="py-3 pl-4 font-semibold">MANAGER INFO</th>
              <th className="py-3 font-semibold">ASSIGNED STATION</th>
              <th className="py-3 font-semibold">LOCATION</th>
              <th className="py-3 font-semibold">STATUS</th>
              <th className="py-3 font-semibold">LAST ACTIVE</th>
              <th className="py-3 pr-4 font-semibold">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {managers.map((m) => (
              <tr key={m.id} className="transition-colors hover:bg-muted/50">
                <td className="py-3 pl-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={m.avatarUrl} alt={m.name} />
                      <AvatarFallback>{m.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{m.name}</p>
                      <p className="text-xs text-gray-400">ID: {m.managerId}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-foreground">{m.assignedStation}</td>
                <td className="py-3 text-foreground">{m.location}</td>
                <td className="py-3"><StatusBadge status={m.status} /></td>
                <td className="py-3 text-gray-400">{m.lastActive}</td>
                <td className="py-3 pr-4">
                  <button onClick={() => onLearnMore(m)} className="font-medium text-primary hover:underline">
                    Learn more
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}