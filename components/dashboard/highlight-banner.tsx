interface HighlightBannerProps {
  label: string
  value: string
}

export function HighlightBanner({ label, value }: HighlightBannerProps) {
  return (
    <div className="rounded-xl bg-red-50 py-6 text-center">
      <p className="text-xs font-medium uppercase tracking-wide text-[#5D3F3D]">{label}</p>
      <p className="mt-1 text-2xl font-bold text-primary">{value}</p>
    </div>
  )
}