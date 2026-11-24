// app/dashboard/settlement/[id]/page.tsx
'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/dashboard/status-badge'
import { useEndpoint } from '@/hooks/use-endpoint'
import { AsyncPanel } from '@/lib/dashboard/async-panel'
import { adminSettlementApi } from '@/lib/dashboard/settlement-api'
import { toEntry } from '@/lib/dashboard/settlement-entry'
import { formatNaira, formatLagosDateTime } from '@/lib/dashboard/format'
import { TAB_ACCENT } from '@/lib/data/settlement-accounts'
import { cn } from '@/lib/utils'

const ATTEMPT_STYLE = {
  success: { label: 'Successful', className: 'text-green-700' },
  failed: { label: 'Failed', className: 'text-red-700' },
  pending: { label: 'Pending', className: 'text-amber-700' },
} as const

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 text-sm">
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-right font-medium text-gray-900">{children}</dd>
    </div>
  )
}

export default function SettlementDetailPage() {
  const { id } = useParams<{ id: string }>()
  const detail = useEndpoint(`sao-settlement-detail-${id}`, null, () => adminSettlementApi.saoDetail(id))

  return (
    <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Settlement Details</h1>
          <p className="text-sm text-gray-500">Full record of this payout.</p>
        </div>
        <Link href="/dashboard/settlement" className="flex">
          <Button variant="secondary">
            <ArrowLeft className="mr-2 h-4 w-4 text-[#E50019]" />
            Back
          </Button>
        </Link>
      </div>

      <div className="mx-auto max-w-2xl">
        <AsyncPanel state={detail} height="h-96">
          {({ settlement: s }) => (
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className={cn('rounded-xl py-6 text-center', TAB_ACCENT.sao.banner)}>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Amount received</p>
                <p className="mt-1 text-2xl font-bold text-primary">{formatNaira(s.amount)}</p>
                <div className="mt-2 flex justify-center">
                  <StatusBadge status={toEntry(s).status} />
                </div>
              </div>

              {s.status_note && (
                <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{s.status_note}</p>
              )}
              {s.needs_review && (
                <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  The bank result is still unclear after 30 minutes. This payout needs review.
                </p>
              )}

              <dl className="mt-4 divide-y divide-gray-100">
                <Row label="Reference">{s.reference}</Row>
                <Row label="Destination">
                  {s.destination ? (
                    <>
                      {s.destination.label}
                      <span className="block text-xs font-normal text-gray-400">{s.destination.account_name}</span>
                    </>
                  ) : (
                    'Not yet sent to a bank'
                  )}
                </Row>
                <Row label="Type">{s.kind === 'withdrawal' ? 'Wallet withdrawal' : 'Sale payout'}</Row>
                {s.source && <Row label="Source">{s.source === 'auto' ? 'Automatic' : 'Manual'}</Row>}
                {s.gross_amount !== null && <Row label="Taken from wallet">{formatNaira(s.gross_amount)}</Row>}
                <Row label="Fee">{formatNaira(s.fee)}</Row>
                {s.station && <Row label="Station">{s.station.name}</Row>}
                {s.transaction_id && <Row label="Transaction ID">{s.transaction_id}</Row>}
                <Row label="Created">{formatLagosDateTime(s.created_at)}</Row>
                {s.completed_at && <Row label="Completed">{formatLagosDateTime(s.completed_at)}</Row>}
              </dl>

              {s.attempts.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium text-gray-900">Payout attempts</p>
                  {s.attempts.map((a) => (
                    <div key={a.attempt} className="flex items-center justify-between border-b border-gray-100 py-2 text-sm last:border-0">
                      <span className="text-gray-500">
                        Attempt {a.attempt} · {formatLagosDateTime(a.time)}
                      </span>
                      <span className={cn('font-medium', ATTEMPT_STYLE[a.result].className)}>
                        {ATTEMPT_STYLE[a.result].label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </AsyncPanel>
      </div>
    </div>
  )
}