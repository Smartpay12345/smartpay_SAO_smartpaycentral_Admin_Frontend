export interface Branch {
  id: string
  name: string
  createdDate: string
  state: string
  percentChange: number
  status: 'healthy' | 'refill-required' | 'not-accessible'
}

export interface FuelStock {
  label: string
  fuelType: string
  tank: string
  current: number
  capacity: number
  unit: 'L' | 'KG'
  status: 'healthy' | 'low' | 'critical' | 'monitor'
  note: string
}