
export type TxnStatus = 'completed' | 'pending' | 'failed' | 'expired' | 'cancelled'

interface BaseTxn {
  ref: string
  status: TxnStatus
  statusLabel: string
  date: string
  customerName: string
  customerAvatar?: string
  amount: string
}

export interface PurchaseTxn extends BaseTxn {
  type: 'purchase'
  accountLabel: string | null
  accountNumber: string | null
  cashback: string
  transactionId: string
  sessionId: string
  product: string
  unit: 'L' | 'kg' | null
  liters: string
  costPerLiter: string
  location: string | null
}

export interface DepositTxn extends BaseTxn {
  type: 'deposit'
  vatCharges: string | null
  transactionId: string
  sessionId: string | null
  from: string | null
  to: string
  accountNumber: string
}

export interface BillTxn extends BaseTxn {
  type: 'bill'
  transactionId: string
  sessionId: string
  service: string
  receiver: string
  failureReason?: string | null
}

export type OverviewTxn = PurchaseTxn | DepositTxn | BillTxn