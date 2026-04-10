import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { QueryClient } from "@tanstack/react-query"
import { routeTree } from "./routeTree.gen"

// Shared queryClient configuration
const defaultQueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes for static data
      gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 0,
    },
  },
}

// Create a singleton queryClient for use in router context
// This is created once and shared between router and QueryProvider
export const queryClient = new QueryClient(defaultQueryClientConfig)

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 1000 * 60 * 5, // 5 minutes - keep data fresh longer
    defaultPreloadDelay: 0, // Start preloading immediately on intent
    defaultGcTime: 1000 * 60 * 10, // 10 minutes garbage collection
    // View transitions disabled globally - only used for specific shared element morphs
  })

  return router
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
  
  interface RouterContext {
    queryClient: typeof queryClient
  }
}
