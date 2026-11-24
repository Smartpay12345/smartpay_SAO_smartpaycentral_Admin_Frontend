'use client'

import { useMemo } from 'react'
import { useEndpoint } from '@/hooks/use-endpoint'
import { inventoryApi } from '@/lib/dashboard/inventory-api'

export function useStationFilterOptions() {
  const board = useEndpoint('filter-stations', null, () => inventoryApi.stations({ period: 'this_month' }))
  return useMemo(
    () => ({
      states: board.data?.groups.map((g) => ({ value: g.state, label: g.label })) ?? [],
      stations:
        board.data?.groups.flatMap((g) =>
          g.stations.map((s) => ({ value: s.id, label: `${s.name} (${s.station_code})` })),
        ) ?? [],
    }),
    [board.data],
  )
}