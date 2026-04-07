import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,

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
}
