import { formatLagosDateTime } from '@/lib/dashboard/format'
import type { AppUserActivityResponse } from '@/lib/types/app-user'

const PLATFORM = { ios: 'iOS', android: 'Android' } as const

export function IpStatContent({ data }: { data: AppUserActivityResponse }) {
  const ip = data.ip_stats
  const device = data.device
  const platform = device?.platform ? PLATFORM[device.platform] : undefined

  return (
    <div>
      <p className="mb-4 text-base font-semibold text-gray-900">IP Stats</p>
      <div className="grid grid-cols-2 gap-2">
        <IpField label="Registered IP" value={ip?.registered_ip ?? '—'} />
        <IpField
          label="Last Login IP"
          value={ip?.last_login_ip ?? '—'}
          sub={ip?.last_login_at ? formatLagosDateTime(ip.last_login_at) : undefined}
        />
        <IpField
          label="Hardware Model"
          value={device?.model ?? platform ?? '—'}
          sub={platform && device?.os_version ? `${platform} ${device.os_version}` : undefined}
        />
        <IpField label="App Version" value={device?.app_version ? `SAO Pay v${device.app_version}` : '—'} />
      </div>
    </div>
  )
}

function IpField({ label, value, sub, subClass = 'text-gray-400' }: { label: string; value: string; sub?: string; subClass?: string }) {
  return (
    <div className="rounded-md bg-gray-50 p-3">
      <p className="text-[11px] text-gray-500">{label}</p>
      <p className="text-xs font-semibold text-gray-900">{value}</p>
      {sub && <p className={`text-[10px] ${subClass}`}>{sub}</p>}
    </div>
  )
}