'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatCurrencyCompact, formatCurrencyFull } from '@/lib/utils/format'

interface MoneyDisplayProps {
  value: unknown
  currency?: string
  className?: string
}

export function MoneyDisplay({ value, currency = '₦', className }: MoneyDisplayProps) {
  const compact = formatCurrencyCompact(value, { currency })
  const full = formatCurrencyFull(value, { currency, decimals: 2 })

  if (compact === full) {
    return <span className={className}>{compact}</span>
  }

  return (
    <Tooltip>
      <TooltipTrigger render={<span className={className}>{compact}</span>} />
      <TooltipContent>
        <p>{full}</p>
      </TooltipContent>
    </Tooltip>
  )
}