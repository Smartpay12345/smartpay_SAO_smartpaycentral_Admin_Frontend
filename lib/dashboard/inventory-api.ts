import type { InventoryBoard, StationInventory, StationDayReport, StationStaff} from './inventory-types'
import { call } from './call'


export const inventoryApi = {
  stations: (p: { period?: string; search?: string; status?: string } = {}) =>
    call<InventoryBoard>('inventory-stations', {
      period: p.period,
      status: p.status === 'all' ? undefined : p.status,
      search: p.search?.trim() || undefined, // an empty search must not be sent
    }),


    stationInventory: (station_id: string, date: string) =>
    call<StationInventory>('station-inventory', { station_id, date }),

  stationStaff: (station_id: string, status: string) =>
    call<StationStaff>('station-staff', { station_id, status: status === 'all' ? undefined : status }),

  stationDayReport: (station_id: string, date: string) =>
    call<StationDayReport>('station-day-report', { station_id, date }),

}