interface ProductStatCardProps {
  icon: React.ReactNode
  iconBg: string
  name: string
  subtitle: string
  amount: string
  quantity: string
  unit: string
}

export function ProductStatCard({ icon, iconBg, name, subtitle, amount, quantity, unit }: ProductStatCardProps) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="mb-4 flex items-center gap-3">
        <span className={`flex h-9 w-9 items-center justify-center rounded-full ${iconBg}`}>
          {icon}
        </span>
        <div>
          <p className="text-sm font-semibold">{name}</p>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-lg font-bold">{amount}</p>
          <p className="text-xs text-gray-400">Sold</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold">{quantity}</p>
          <p className="text-xs text-gray-400">{unit}</p>
        </div>
      </div>
    </div>
  )
}