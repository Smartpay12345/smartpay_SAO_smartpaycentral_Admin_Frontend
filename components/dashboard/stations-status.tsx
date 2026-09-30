import { StatusBadge } from './status-badge'

interface StationStatus {
  name: string
  status: string
}

export function StationsStatus({ stations }: { stations: StationStatus[] }) {
  return (
    <div className="flex flex-col rounded-xl border bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-medium">Stations Status</h2>
        <button className="text-xs font-medium text-primary">View All</button>
      </div>
      <div className="flex flex-col divide-y">
        {stations.map((s) => (
          <div key={s.name} className="flex items-center justify-between py-2.5 text-sm">
            <p>{s.name}</p>
            <StatusBadge status={s.status} />
          </div>
        ))}
      </div>
      <button className="mt-4 w-full rounded-lg border py-2 text-sm font-medium text-[#E50019]">
        View All Status
      </button>
    </div>
  )
}