import { formatLagosDateTime } from '@/lib/dashboard/format'
import type { AppUserActivityResponse } from '@/lib/types/app-user'

export function ActivityLogContent({ data }: { data: AppUserActivityResponse }) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-gray-900">App Activities &amp; Security logs</p>
      {data.activities.length === 0 ? (
        <p className="text-sm text-gray-400">No activity reported yet.</p>
      ) : (
        <div className="space-y-4">
          {data.activities.map((log, i) => (
            <div key={i} className="flex gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{log.title}</p>
                  <p className="text-xs text-gray-400">{formatLagosDateTime(log.time)}</p>
                </div>
                {log.detail && <p className="text-xs text-gray-400">{log.detail}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}