'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle className="h-7 w-7 text-red-500" />
      </span>
      <div>
        <h1 className="text-lg font-semibold">This page ran into a problem</h1>
        <p className="mt-1 text-sm text-gray-500">
          Try reloading this page. If the problem continues, head back to the dashboard.
        </p>
      </div>
      <div className="flex gap-3">
        <Link href="/dashboard" className={buttonVariants({ variant: 'outline' })}>
          Back to Dashboard
        </Link>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  )
}