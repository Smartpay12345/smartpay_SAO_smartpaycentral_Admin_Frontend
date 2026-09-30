export interface Manager {
  id: string
  name: string
  managerId: string
  avatarUrl?: string
  email: string
  phone: string
  homeAddress?: string
  assignedStation: string
  location: string
  status: 'active' | 'suspended'
  lastActive: string
  joinedYear: string
  yearsOfService: number
  totalSales: string
  totalRevenue: string
}