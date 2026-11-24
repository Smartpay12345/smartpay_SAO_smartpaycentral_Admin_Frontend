export interface SettlementEntry {
  destination: string
  date: string
  reference: string
  amount: string
  status: string
}

export interface CompanyAccount {
  key: 'smartpay' | 'sao'
  label: string
  bankName: string
  accountLast4: string
  totalSettlement: string
  ref: string
  recentSettlements: SettlementEntry[]
}