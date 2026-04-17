import { createFileRoute } from "@tanstack/react-router"
import { lazy, Suspense } from "react"
import { Loader2 } from "lucide-react"

// Lazy load studio page - only fetched when user visits /studio
const StudioPage = lazy(() => import("@/features/studio/page"))

// Loading fallback for studio
function StudioLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Loading studio...</span>
      </div>
    </div>
  )
}

function LazyStudioPage() {
  return (
    <Suspense fallback={<StudioLoading />}>
      <StudioPage />
    </Suspense>
  )
}

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Studio - tasteui" },
      { name: "description", content: "Manage your design skills" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LazyStudioPage,
})
