// components/dashboard/transactions/transaction-detail-panel.tsx
'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { buttonVariants } from '@/components/ui/button'
import { useReceiptExport } from '@/hooks/use-receipt-export'
import { STATUS_STYLE } from '@/lib/data/txn-status-colors'
import type { OverviewTxn } from '@/lib/types/transaction-overview'
import { cn } from '@/lib/utils'

function SummaryHeader({ txn }: { txn: OverviewTxn }) {
  const s = STATUS_STYLE[txn.status]
  return (
    <div className={cn('flex items-start justify-between border-l-4 rounded-lg bg-white p-3', s.border)}>
      <div className="flex items-start gap-3">
        {txn.customerAvatar ? (
          <Image src={txn.customerAvatar} alt={txn.customerName} width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-500">
            {txn.customerName.charAt(0)}
          </span>
        )}
        <div>
          <p className="text-xs text-gray-400">{txn.date}</p>
          <p className="text-sm font-semibold text-gray-900">{txn.customerName}</p>
          {txn.type === 'purchase' && txn.location && <p className="text-xs text-gray-400">{txn.location}</p>}
        </div>
      </div>
      <p className="text-sm font-semibold text-gray-900">{txn.amount}</p>
    </div>
  )
}

function StatusRow({ status, label }: { status: OverviewTxn['status']; label: string }) {
  const s = STATUS_STYLE[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium', s.badgeBg, s.badgeText)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', s.dot)} />
      {label}
    </span>
  )
}

export function TransactionDetailPanel({ txn }: { txn: OverviewTxn }) {
  const receiptRef = useRef<HTMLDivElement>(null)
  const { handleDownload, downloading } = useReceiptExport(
    receiptRef,
    `transaction-${txn.ref.replace(/[^\w-]/g, '')}`
  )

  // quantity labels follow the unit the API sends (litres, or kg for cooking gas)
  const unit = txn.type === 'purchase' ? txn.unit : null
  const quantityLabel = unit === 'kg' ? 'Kilograms' : unit === 'L' ? 'Liters' : 'Quantity'
  const priceLabel = unit === 'kg' ? 'Cost per kg' : unit === 'L' ? 'Cost per liter' : 'Unit price'

  return (
    <div className="space-y-4">
      <div ref={receiptRef} className="space-y-4 bg-white">
        <p className="text-sm font-semibold text-gray-900">Transaction details</p>
        <SummaryHeader txn={txn} />

        {txn.type === 'purchase' && (
          <>
            <div className="flex items-center justify-between text-sm">
              <StatusRow status={txn.status} label={txn.statusLabel} />
              <div className="text-right">
                <p className="text-xs text-gray-400">Cashback Back</p>
                <p className="font-semibold text-gray-900">{txn.cashback}</p>
              </div>
            </div>
            <Grid2>
              <Field label="Transaction ID" value={txn.transactionId} />
              <Field label="Reference" value={txn.sessionId} />
              <Field label="Product" valueNode={<span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">{txn.product}</span>} />
              <Field label={quantityLabel} value={txn.liters} />
              <Field label={priceLabel} value={txn.costPerLiter} />
            </Grid2>
            {txn.accountNumber && (
              <div>
                <p className="mb-2 text-sm font-semibold text-gray-900">Purchase Account details</p>
                <div className="flex items-center gap-2 rounded-lg border p-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-500">
                    {txn.customerName.charAt(0)}
                  </span>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{txn.customerName}</p>
                    <p className="text-xs text-gray-400">{txn.accountLabel}: {txn.accountNumber}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {txn.type === 'deposit' && (
          <>
            <div className="flex items-center justify-between text-sm">
              <StatusRow status={txn.status} label={txn.statusLabel} />
              {txn.vatCharges && (
                <div className="text-right">
                  <p className="text-xs text-gray-400">Transfer fee</p>
                  <p className="font-semibold text-gray-900">{txn.vatCharges}</p>
                </div>
              )}
            </div>
            <Grid2>
              <Field label="Transaction ID" value={txn.transactionId} />
              {txn.sessionId && <Field label="Session ID" value={txn.sessionId} />}
              {txn.from && <Field label="From" value={txn.from} />}
              <Field label="To" value={txn.to} />
              <Field label="Account number" value={txn.accountNumber} />
            </Grid2>
            <div className="rounded-lg bg-green-50 p-4">
              <p className="font-semibold text-gray-900">Deposit {txn.statusLabel}</p>
              <p className="text-sm text-gray-500">This wallet has been successfully credited.</p>
            </div>
          </>
        )}

        {txn.type === 'bill' && (
          <>
            <div className="flex items-center justify-between text-sm">
              <StatusRow status={txn.status} label={txn.statusLabel} />
            </div>
            <Grid2>
              <Field label="Transaction ID" value={txn.transactionId} />
              <Field label="Reference" value={txn.sessionId} />
              <Field label="Status" valueNode={<StatusRow status={txn.status} label={txn.statusLabel} />} />
              <Field label="Service" valueNode={<span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">{txn.service}</span>} />
              <Field label="Receiver" value={txn.receiver} />
              {txn.failureReason && <Field label="Failure reason" value={txn.failureReason} />}
            </Grid2>
          </>
        )}
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <p className="text-xs text-gray-400">Powered by smartpay</p>
       <button
  onClick={() => void handleDownload('png')}
  disabled={downloading !== null}
  className={cn(buttonVariants(), 'bg-red-600 hover:bg-red-700')}
>
  {downloading === 'png' ? 'Downloading...' : 'Download'}
</button>
      </div>
    </div>
  )
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">{children}</div>
}

function Field({ label, value, valueNode }: { label: string; value?: string; valueNode?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-50 py-2 text-sm">
      <span className="text-gray-400">{label}</span>
      {valueNode ?? <span className="font-medium text-gray-900">{value}</span>}
    </div>
  )
}