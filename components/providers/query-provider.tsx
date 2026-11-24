// components/providers/query-provider.tsx
'use client'

import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ApiError } from '@/lib/auth/api'
import { useAuth } from '@/lib/auth/store'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const { status } = useAuth()
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: (failureCount, error) =>
              !(error instanceof ApiError && error.status >= 400 && error.status < 500) && failureCount < 1,
          },
        },
      })
  )

  // never let the next admin see the previous admin's cached data
  useEffect(() => {
    if (status === 'unauthenticated') client.clear()
  }, [status, client])

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}