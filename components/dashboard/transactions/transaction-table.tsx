'use client'

import { StatusBadge } from '@/components/dashboard/status-badge'
import { Receipt, Clock } from 'lucide-react'

export interface Transaction {
  id: string
  date: string
  time: string
  station: string
  product: string
  productDetail: string
  amount: string
  status: string
}

interface TransactionTableProps {
  transactions: Transaction[]
  onRowClick: (txn: Transaction) => void
}

export function TransactionTable({ transactions, onRowClick }: TransactionTableProps) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left text-xs text-gray-400">
          <th className="py-2 font-normal">TRANSACTION ID</th>
          <th className="py-2 font-normal">DATE & TIME</th>
          <th className="py-2 font-normal">STATION</th>
          <th className="py-2 font-normal">PRODUCT</th>
          <th className="py-2 font-normal">AMOUNT (₦)</th>
          <th className="py-2 font-normal">STATUS</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((t, i) => {
          const isPending = t.status === 'pending'
          return (
            <tr
              key={i}
              onClick={() => onRowClick(t)}
              className="cursor-pointer border-b transition-colors hover:bg-gray-50"
            >
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-md ${
                      isPending ? 'bg-orange-50' : 'bg-red-50'
                    }`}
                  >
                    {isPending ? (
                      <Clock className="h-4 w-4 text-orange-500" />
                    ) : (
                      <Receipt className="h-4 w-4 text-primary" />
                    )}
                  </span>
                  <span className="font-medium">{t.id}</span>
                </div>
              </td>
              <td className="py-3">
                <p>{t.date}</p>
                <p className="text-xs text-gray-400">{t.time}</p>
              </td>
              <td className="py-3">{t.station}</td>
              <td className="py-3">
                <p>{t.product}</p>
                <p className="text-xs text-gray-400">{t.productDetail}</p>
              </td>
              <td className="py-3 font-medium">{t.amount}</td>
              <td className="py-3">
                <StatusBadge status={t.status} />
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}