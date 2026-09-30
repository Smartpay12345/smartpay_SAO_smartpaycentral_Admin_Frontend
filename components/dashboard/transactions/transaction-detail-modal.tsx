'use client'

import { useRef } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { X } from 'lucide-react'
import type { Transaction } from './transaction-table'
import { ReceiptFooter } from '@/components/dashboard/receipt-footer'
import { useReceiptExport } from '@/hooks/use-receipt-export'
import { Success, Dot } from '@/components/icons'

interface TransactionDetail extends Transaction {
  stationLocation: string
  managerName: string
  sessionId: string
  liters: string
  costPerLiter: string
  cashback: string
  location: string
}

interface TransactionDetailModalProps {
  transaction: TransactionDetail | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TransactionDetailModal({ transaction, open, onOpenChange }: TransactionDetailModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null)

  
  const { handleDownload, handleShare, downloading, sharing } = useReceiptExport(
    receiptRef,
    transaction ? `receipt-${transaction.id}` : 'receipt'
  )

  if (!transaction) return null
  const txn = transaction

  const details = [
    { label: 'Transaction ID', value: `#${txn.id}` },
    { label: 'Session ID', value: txn.sessionId },
    { label: 'Date & Time', value: `${txn.date} | ${txn.time}` },
    { label: 'Status', value: txn.status === 'completed' ? 'Sent' : 'Pending', pill: true },
    { label: 'Product', value: txn.product.split(' ')[0], pill: true },
    { label: 'Liters', value: txn.liters },
    { label: 'Cost per liter', value: txn.costPerLiter },
    { label: 'Cashback', value: txn.cashback },
    { label: 'Location', value: txn.location },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="!max-w-[90vw] gap-0 overflow-hidden p-0 sm:!max-w-xl lg:!max-w-3xl"
      >
        <div className="no-scrollbar max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b p-5">
            <h2 className="text-base font-semibold sm:text-lg">{txn.stationLocation}</h2>
            <button onClick={() => onOpenChange(false)} className="shrink-0 rounded-full p-1 hover:bg-gray-100">
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

        
          <div ref={receiptRef} className="bg-white">
            <div className="flex items-center justify-end gap-2 px-5 pt-4">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 font-medium text-primary">
                  {txn.managerName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="font-bold">Manager</p>
                <p className="text-sm font-medium">{txn.managerName}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
              <div className="flex flex-col items-center justify-center rounded-xl border p-6 text-center">
                <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#53E16F33]">
                  <Success className='h-8 w-8'/>
                </span>
                <p className="font-bold">Sao fuel pay</p>
                <p className="font-bold">Payment Successful</p>
                <p className="mt-1 text-xs text-[#5D3F3D]">Purchase ID: {txn.id}</p>

                <div className="mt-5 w-full rounded-xl bg-gray-50 py-4 text-center">
                  <p className="text-xs uppercase tracking-wide text-[#5D3F3D]">Amount</p>
                  <p className="text-2xl font-bold text-primary">₦{txn.amount}</p>
                </div>
              </div>

              <div className="rounded-xl border p-4">
                <p className="mb-3 text-sm font-medium">Payment Details</p>
                <div className="space-y-3">
                  {details.map((d) => (
                    <div key={d.label} className="flex items-center justify-between gap-4 text-sm">
                      <span className="shrink-0 whitespace-nowrap text-gray-400">{d.label}</span>
                      {d.pill ? (
                        <span className="whitespace-nowrap rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-600 flex gap-2">
                        <Dot className='h-2 w-2 mt-1'/>{d.value}
                        </span>
                      ) : (
                        <span className="truncate text-right font-medium">{d.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <ReceiptFooter
            onShare={handleShare}
            onDownload={handleDownload}
            sharing={sharing}
            downloading={downloading}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}