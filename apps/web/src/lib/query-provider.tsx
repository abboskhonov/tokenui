import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState, lazy, Suspense } from "react"

// Lazy load devtools only in development to reduce bundle size
const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() => import("@tanstack/react-query-devtools").then(m => ({ default: m.ReactQueryDevtools })))
  : () => null

interface QueryProviderProps {
  children: React.ReactNode
  queryClient?: QueryClient
}

export function QueryProvider({ children, queryClient: externalQueryClient }: QueryProviderProps) {
  const [internalQueryClient] = useState(() =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes for static data
          gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
          refetchOnWindowFocus: false,
          refetchOnMount: false,
          retry: 1,
          retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        },
        mutations: {
          retry: 0,
        },
      },
    })
  )

  const queryClient = externalQueryClient ?? internalQueryClient

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      )}
    </QueryClientProvider>
  )
}
