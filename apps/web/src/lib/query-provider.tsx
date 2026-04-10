import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState } from "react"

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
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
