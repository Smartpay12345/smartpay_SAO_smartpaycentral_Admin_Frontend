import { Button } from '@/components/ui/button'
import { StatusBadge } from './status-badge'
import { Inv } from '../icons'

interface Transaction {
  id: string
  station: string
  amount: string
  liters: string
  status: string
  time: string
}

export function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="flex flex-col rounded-xl border bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-medium">Recent Transactions</h2>
        <button className="rounded-md border px-2 py-1 text-xs text-gray-500">This Week</button>
      </div>
      <div className="flex flex-col divide-y ">
        {transactions.map((t) => (
          <div key={t.id} className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50">
                <Inv />
              </span>
              <div className="max-w-[90px] lg:max-w-[70px]">
                <p className="text-sm font-medium leading-tight">{t.id}</p>
                <p className="text-xs text-gray-400">{t.station}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{t.amount}</p>
              <p className="text-xs text-gray-400">{t.liters}</p>
            </div>
            <div className="text-right">
              <StatusBadge status={t.status} />
              <p className="mt-1 text-xs text-gray-400">{t.time}</p>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" className="mt-4 w-full text-[#E50019]">
        View All Transactions
      </Button>
    </div>
  )
}