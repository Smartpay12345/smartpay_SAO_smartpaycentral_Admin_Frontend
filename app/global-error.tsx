'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Root layout crashed:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
          <h1 className="text-lg font-semibold">Something went wrong</h1>
          <button onClick={() => reset()} className="rounded-lg bg-red-600 px-4 py-2 text-white">
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}