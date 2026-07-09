'use client'

import { useEffect, useRef, useState } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createStore, type AppStore } from '@store/create-store'
import { createQueryClient } from '@lib/query-client'
import { enableMocking } from '@infrastructure/mocks/init'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState<QueryClient>(() => createQueryClient())
  const storeRef = useRef<AppStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = createStore()
  }

  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    enableMocking().finally(() => setIsReady(true))
  }, [])

  if (!isReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-alt">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    )
  }

  return (
    <ReduxProvider store={storeRef.current}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ReduxProvider>
  )
}
