export interface Branch {
  id: string
  name: string
  createdDate: string
  state: string
  percentChange: number | null
  changeDirection: 'up' | 'down' | 'flat' | null
  vsLabel: string
  status: 'healthy' | 'refill-required' | 'not-accessible' | 'setup-pending'

}

export interface FuelStock {
  label: string
  fuelType: string
  tank: string
  current: number | null
  capacity: number | null
  status: 'healthy' | 'low' | 'critical' | 'monitor' | 'pending'
  unit: 'L' | 'KG'
  note: string
}