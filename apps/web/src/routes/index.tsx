import { createFileRoute } from "@tanstack/react-router"
import { QueryClient, dehydrate } from "@tanstack/react-query"
import type { Design } from "@/lib/types/design"
import { MarketingPage } from "@/features/marketing"
import { getPublicDesignsServerFn } from "@/lib/api/designs-server"
import { designKeys } from "@/lib/queries/designs"

// Generate preload links for first N design images (LCP optimization)
function generateImagePreloadLinks(designs: Array<Design>): Array<{ rel: string; href: string; as?: string; fetchpriority?: string; type?: string; crossOrigin?: "anonymous" | "use-credentials" | "" }> {
  const LCP_IMAGE_COUNT = 4 // First 4 images are most likely to be LCP
  
  return designs
    .slice(0, LCP_IMAGE_COUNT)
    .filter(d => d.thumbnailUrl)
    .map((design, index) => ({
      rel: "preload",
      href: design.thumbnailUrl!,
      as: "image",
      type: design.thumbnailUrl!.endsWith('.webp') ? 'image/webp' : design.thumbnailUrl!.endsWith('.png') ? 'image/png' : 'image/jpeg',
      fetchpriority: index === 0 ? "high" : "auto", // First image gets high priority
      crossOrigin: "anonymous" as const, // Required for R2 images
    }))
}

export const Route = createFileRoute("/")({
  head: ({ loaderData }) => {
    // Safely get designs array - ensure it's always an array
    const rawDesigns = loaderData?.designs
    const designs = Array.isArray(rawDesigns) ? rawDesigns : []
    
    // Generate preload links for first 4 images to improve LCP
    const imagePreloads = generateImagePreloadLinks(designs)
    
    return {
      meta: [
        {
          title: "tasteui - Drop-in design skills for your coding agent",
        },
        {
          name: "description",
          content: "Drop-in design skills for your coding agent. No setup, no configuration — just describe what you need and ship production-ready components in seconds.",
        },
        {
          name: "og:title",
          content: "tasteui - Drop-in design skills for your coding agent",
        },
        {
          name: "og:description",
          content: "Drop-in design skills for your coding agent. No setup, no configuration — just describe what you need and ship production-ready components in seconds.",
        },
        {
          name: "og:type",
          content: "website",
        },
        {
          name: "og:url",
          content: "https://tasteui.dev",
        },
        {
          name: "og:image",
          content: "https://tasteui.dev/og-image.png",
        },
        {
          name: "og:site_name",
          content: "tasteui",
        },
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          name: "twitter:title",
          content: "tasteui - Drop-in design skills for your coding agent",
        },
        {
          name: "twitter:description",
          content: "Drop-in design skills for your coding agent. No setup, no configuration — just describe what you need and ship production-ready components in seconds.",
        },
        {
          name: "twitter:image",
          content: "https://tasteui.dev/og-image.png",
        },
        {
          name: "keywords",
          content: "AI agents, UI design, landing page, design system, token-driven UI, component library",
        },
      ],
      links: [
        // Preload critical LCP images
        ...imagePreloads,
      ],
    }
  },
  loader: async () => {
    try {
      // Fetch designs on the server - this runs server-side during SSR
      const { designs, pagination } = await getPublicDesignsServerFn()
      
      // Create a QueryClient and hydrate the cache with infinite query format
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
          },
        },
      })
      
      // Pre-populate the infinite query cache with SSR data
      queryClient.setQueryData(
        [...designKeys.public(undefined), "infinite", undefined],
        {
          pages: [{ designs, pagination }],
          pageParams: [0],
        }
      )
      
      // Dehydrate the query client for hydration on the client
      const dehydratedState = dehydrate(queryClient)
      
      return { designs, dehydratedState }
    } catch (error) {
      console.error("Failed to load designs in loader:", error)
      // Return empty state on error so page still renders
      return { designs: [], dehydratedState: { queries: [], mutations: [] } }
    }
  },
  component: App,
})

function App() {
  // Get the server-fetched designs and dehydrated state from the route loader
  const { designs, dehydratedState } = Route.useLoaderData()
  
  // Ensure designs is always an array
  const safeDesigns = Array.isArray(designs) ? designs : []
  
  return <MarketingPage initialDesigns={safeDesigns} dehydratedState={dehydratedState} />
}
