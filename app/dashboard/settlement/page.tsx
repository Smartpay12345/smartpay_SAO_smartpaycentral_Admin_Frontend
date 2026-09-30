// app/dashboard/settlement/page.tsx
import Link from 'next/link'
import { ArrowLeft} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HighlightBanner } from '@/components/dashboard/highlight-banner'
import { SettlementHistoryItem } from '@/components/dashboard/settlement-history-item'
import { BHouse } from '@/components/icons'

const settlements = [
  { destination: 'GTBank ****4589', date: 'Today, 10:45 AM', reference: 'WD-9928', amount: '₦5,000,000', status: 'completed' },
  { destination: 'GTBank ****4589', date: 'Oct 12, 2023', reference: 'WD-9840', amount: '₦12,500,000', status: 'completed' },
  { destination: 'GTBank ****4589', date: 'Oct 12, 2023', reference: 'WD-9840', amount: '₦12,500,000', status: 'completed' },
  { destination: 'GTBank ****4589', date: 'Oct 12, 2023', reference: 'WD-9840', amount: '₦12,500,000', status: 'completed' },
  { destination: 'GTBank ****4589', date: 'Oct 12, 2023', reference: 'WD-9840', amount: '₦12,500,000', status: 'completed' },
]

export default function SettlementPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Settlement Account</h1>
          <p className="text-sm text-gray-500">Settlement funds to your linked accounts.</p>
        </div>
        <Link href="/dashboard/revenue-analytics" className='flex'>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4 text-[#E50019]" />
            Back
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border bg-white p-4">
        <HighlightBanner label="All Settlement" value="₦485,200,000" />

        <div className="mt-4">
          <p className="mb-2 text-sm font-medium">Select Destination</p>
          <div className="flex items-center justify-between rounded-lg border px-4 py-3">
            <div className="flex items-center gap-3">
            
              <span className="text-sm">GTBank - **** 4589</span>
            </div>
            <Link href="/dashboard/settlement/add-bank" className="text-sm font-medium text-primary flex gap-4">
              Change Bank
                <BHouse className="h-4 w-4 text-gray-400" />
            </Link>
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-sm font-medium">Recent Settlements</p>
          <div>
            {settlements.map((s, i) => (
              <SettlementHistoryItem key={i} {...s} />
            ))}
          </div>
          <button className="mt-3 w-full text-center text-sm font-medium text-primary">
            View All History
          </button>
        </div>
      </div>
    </div>
  )
}