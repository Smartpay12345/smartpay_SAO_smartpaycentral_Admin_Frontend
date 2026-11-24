// lib/dashboard/products.ts
import type { ProductsChart } from './types'

export const PRODUCT_LINES = [
  { code: 'PMS', key: 'pms', label: 'PMS', color: '#EC4899', dot: 'bg-pink-500' },
  { code: 'AGO', key: 'ago', label: 'AGO', color: '#22C55E', dot: 'bg-green-500' },
  { code: 'DPK', key: 'dpk', label: 'DPK', color: '#3B82F6', dot: 'bg-blue-500' },
  { code: 'LPG', key: 'lpg', label: 'LPG', color: '#F97316', dot: 'bg-orange-500' },
] as const

export interface ProductSeriesPoint {
  label: string
  pms: number
  ago: number
  dpk: number
  lpg: number
}

// API points -> one flat row per bucket, in naira
export const toProductSeries = (d: ProductsChart): ProductSeriesPoint[] =>
  d.points.map((p) => ({
    label: p.label,
    pms: p.products.PMS.sales,
    ago: p.products.AGO.sales,
    dpk: p.products.DPK.sales,
    lpg: p.products.LPG.sales,
  }))