import { cn } from '@/lib/utils'

const colors: Record<string, string> = {
  PMS: 'bg-[#D6E3FF] text-[#00468B]',
  AGO: 'bg-[#FFE9E7] text-[#5D3F3D] ',
  DPK: 'bg-[#FFE9E7] text-[#5D3F3D] ',
  LPG: 'bg-[#FCDBD8] text-[#5D3F3D] ',
}

export function ProductChip({ product }: { product: string }) {
  return (
    <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', colors[product] ?? 'bg-gray-100 text-gray-600')}>
      {product}
    </span>
  )
}