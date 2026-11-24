import { Button } from '@/components/ui/button'
import type { Pagination } from '@/lib/dashboard/types'

export function Pager({ pagination, onChange }: { pagination: Pagination; onChange: (page: number) => void }) {
  const { page, total, total_pages, showing_from, showing_to } = pagination
  if (total === 0) return null
  return (
    <div className="mt-3 flex items-center justify-between">
      <p className="text-xs text-gray-400">Showing {showing_from}–{showing_to} of {total}</p>
      <div className="flex gap-2">
        <Button variant="secondary" disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</Button>
        <Button variant="secondary" disabled={page >= total_pages} onClick={() => onChange(page + 1)}>Next</Button>
      </div>
    </div>
  )
}