// lib/dashboard/station-transaction-view.ts
import type { StationTransactionDetail } from './types'
import { clampPercent, formatNumber, formatQuantity, unitWord } from './format'

export function toStationTransactionView(d: StationTransactionDetail) {
  return {
    stationCode: d.station.station_code,
    title: `${d.station.station_code}, ${d.station.location}`, // "SAO-21182, Ibadan, Oyo State"
    managerName: d.manager?.full_name ?? 'No active manager',
    managerAvatar: d.manager?.avatar_url ?? null,

    products: d.products.map((p) => ({
      code: p.product_code,
      title: p.title, // "Petrol (PMS)"
      soldLabel: formatNumber(p.sold), // just the number: your bar adds the word "sold" itself
      capacityLabel: `${formatNumber(p.capacity)} ${unitWord(p.unit)}`, // "55,000 Liters" or "55,000 Kg"
      percent: clampPercent(p.percent_of_capacity),
      stockLabel:
        p.stock_remaining === null
          ? 'Starting stock not set'
          : `${formatNumber(p.stock_remaining)} ${unitWord(p.unit)} left`,
    })),

    pumps: d.pumps.map((p) => ({
      id: p.id,
      name: p.name,
      active: p.is_active,
      noOfSales: p.sales_count,
      initial: formatQuantity(p.meter_before, p.unit), // meter reading before the period
      remaining: formatQuantity(p.meter_latest, p.unit), // latest meter reading
      percent: clampPercent(p.percent_through_app),
    })),
  }
}

export type StationTransactionView = ReturnType<typeof toStationTransactionView>