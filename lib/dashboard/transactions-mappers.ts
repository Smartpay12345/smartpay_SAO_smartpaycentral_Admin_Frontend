import { formatCurrencyFull } from '@/lib/utils/format'
import { formatDateTime } from '@/lib/utils/date'
import type { OverviewTxn } from '@/lib/types/transaction-overview'
import type { TransactionDetail, DepositDetail } from './transactions-types'

const money = (n: number) => formatCurrencyFull(n, { decimals: 2 })

export function toTxn(d: TransactionDetail): OverviewTxn {
  const t = d.transaction
  const base = {
    ref: t.transaction_id,
    status: t.status,
    statusLabel: t.status_label,
    date: formatDateTime(t.time),
    customerName: d.customer.full_name,
    customerAvatar: d.customer.avatar_url ?? undefined,
    amount: money(t.amount),
  }

  if (t.kind === 'bill') {
    return {
      ...base,
      type: 'bill',
      transactionId: t.transaction_id,
      sessionId: t.purchase_reference, // the provider reference
      service: t.product_name ?? t.category,
      receiver: t.customer_identifier ?? '-',
      failureReason: t.failure_reason ?? null,
    }
  }

  const va = d.customer.virtual_account
  return {
    ...base,
    type: 'purchase',
    accountLabel: va?.bank_name ?? null,
    accountNumber: va?.account_number ?? null,
    cashback: money(t.cashback),
    transactionId: t.transaction_id,
    sessionId: t.purchase_reference, // purchases have no separate session id
    product: t.product_code ?? '-',
    unit: t.unit,
    liters: t.quantity == null ? '-' : [t.quantity.toLocaleString(), t.unit].filter(Boolean).join(' '),
    costPerLiter: t.unit_price == null ? '-' : money(t.unit_price),
    location: t.station ? `${t.station.station_code}, ${t.station.location}` : null,
  }
}

export function toDepositTxn(d: DepositDetail): OverviewTxn {
  const x = d.deposit
  return {
    ref: x.reference,
    status: 'completed', // only successful deposits exist
    statusLabel: x.status_label,
    date: formatDateTime(x.time),
    customerName: d.customer.full_name,
    customerAvatar: d.customer.avatar_url ?? undefined,
    amount: money(x.amount),
    type: 'deposit',
    vatCharges: x.fee == null ? null : money(x.fee), // the transfer fee
    transactionId: x.reference,
    sessionId: x.session_id,
    from: x.from?.name ?? null,
    to: x.to.account_name,
    accountNumber: x.to.account_number,
  }
}