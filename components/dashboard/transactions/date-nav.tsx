// components/dashboard/transactions/date-nav.tsx
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

export function DateNav({ label, onPrev, onNext, nextDisabled }: {
  label: string; onPrev?: () => void; onNext?: () => void; nextDisabled?: boolean
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border px-2 py-1.5 text-sm">
      <button onClick={onPrev} className="text-gray-400"><ChevronLeft className="h-4 w-4" /></button>
      <Calendar className="h-4 w-4 text-gray-400" />
      <span className="text-gray-700">{label}</span>
      <button onClick={onNext} disabled={nextDisabled} className="text-gray-400 disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button>
    </div>
  )
}