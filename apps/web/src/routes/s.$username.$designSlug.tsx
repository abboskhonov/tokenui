import { createFileRoute, useLocation } from "@tanstack/react-router"
import { useQueryClient } from "@tanstack/react-query"
import { useDesign, useTrackView, designKeys } from "@/lib/queries/designs"
import { useState, useCallback, useEffect } from "react"
import { useDesignActions } from "@/features/design-detail/hooks"
import {
  SkillDetailHeader,
  SkillDetailSidebar,
  PreviewContent,
  CodeView,
  SkillDetailSkeleton,
  SkillDetailError,
  SkillNotFound,
} from "@/features/design-detail/components"
import type { Design } from "@/lib/types/design"
import { api } from "@/lib/api/client"
import { queryClient } from "@/router"

type TabType = "preview" | "code"

// Generate page title from design data
function generatePageTitle(design: Design | undefined, params: { username: string; designSlug: string }): string {
  if (design?.name) {
    return `${design.name} by ${params.username} - tokenui`
  }
  // Fallback to formatted slug while loading
  const formattedSlug = params.designSlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
  return `${formattedSlug} by ${params.username} - tokenui`
}

// Prefetch design data before navigation completes
async function prefetchDesign(username: string, slug: string) {
  const queryKey = designKeys.detail(username, slug)
  
  // Only prefetch if not already in cache
  if (!queryClient.getQueryData(queryKey)) {
    await queryClient.prefetchQuery({
      queryKey,
      queryFn: async () => {
        const response = await api.get<{ design: Design }>(`/api/designs/${username}/${slug}`)
        return response.design
      },
      staleTime: 1000 * 60 * 2, // 2 minutes
    })
  }
}

export const Route = createFileRoute("/s/$username/$designSlug")({
  component: SkillDetailPage,
  head: ({ params }) => ({
    meta: [
      {
        title: generatePageTitle(undefined, params),
      },
    ],
  }),
  // Prefetch design data during navigation for instant page load
  loader: async ({ params }) => {
    const { username, designSlug } = params
    await prefetchDesign(username, designSlug)
    return { prefetched: true }
  },
  errorComponent: () => <SkillDetailError />,
  notFoundComponent: () => <SkillNotFound />,
})

// Extended cached design type that may include extra fields from prefetch
interface CachedDesign extends Design {
  // thumbnailUrl is already in Design, but prefetch may add it if not in type
}

// Router state type for navigation from gallery
interface GalleryNavigationState {
  thumbnailUrl?: string
  name?: string
}

function SkillDetailPage() {
  const { username, designSlug } = Route.useParams()
  const location = useLocation()
  const queryClient = useQueryClient()
  
  // Get cached data immediately for instant UI (if prefetched from gallery)
  const cachedDesign = queryClient.getQueryData<CachedDesign>(designKeys.detail(username, designSlug))
  
  // Get thumbnail from router state (passed during navigation from gallery)
  const navState = location.state as GalleryNavigationState | undefined
  const thumbnailFromState = navState?.thumbnailUrl
  const nameFromState = navState?.name
  
  // Fallback to sessionStorage if router state is not available
  const [previewFromStorage, setPreviewFromStorage] = useState<{thumbnailUrl?: string; name?: string}>({})
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(`skill-preview:${username}/${designSlug}`)
      if (stored) {
        try {
          setPreviewFromStorage(JSON.parse(stored))
        } catch {
          // Ignore parse errors
        }
      }
    }
  }, [username, designSlug])
  
  const { data: design, isLoading, error } = useDesign(username, designSlug)
  
  // Use cached/prefetched data immediately while loading for perceived instant navigation
  const displayDesign = design || cachedDesign
  const trackView = useTrackView()
  
  const [activeTab, setActiveTab] = useState<TabType>("preview")
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light")
  
  // Extract thumbnail and name for skeleton before displayDesign is narrowed
  const skeletonThumbnail = thumbnailFromState || previewFromStorage.thumbnailUrl || cachedDesign?.thumbnailUrl || null
  const skeletonName = nameFromState || previewFromStorage.name || cachedDesign?.name
  
  // Only use design actions when design is loaded (use displayDesign for instant UI)
  const designActions = useDesignActions(displayDesign)
  
  const { user, isBookmarkedState, handleBookmarkClick, isStarredState, handleStarClick, isCopied, handleCopy } = designActions

  // Track view when page loads (only track when we have real loaded data, not cached)
  useEffect(() => {
    if (design?.id && !isLoading) {
      trackView.mutate(design.id, {
        onSuccess: (data) => {
          if (data.isNewView) {
            queryClient.invalidateQueries({ queryKey: designKeys.my() })
            queryClient.invalidateQueries({ queryKey: designKeys.detail(username, designSlug) })
          }
        },
        onError: (error) => {
          console.error("Failed to track view:", error)
        }
      })
    }
  }, [design?.id, isLoading, username, designSlug])

  const handleCopyInstall = useCallback(() => {
    const command = displayDesign ? `npx tokenui.sh add ${displayDesign.author?.username || username}/${displayDesign.slug}` : ""
    handleCopy(command, "install")
  }, [displayDesign, username, handleCopy])

  // Preview handlers
  const togglePreviewTheme = useCallback(() => {
    setPreviewTheme(prev => prev === "light" ? "dark" : "light")
  }, [])

  if (error) {
    console.error("Route error:", error)
    return <SkillDetailError />
  }

  // Show skeleton only if we have no cached data AND we're loading
  if (!displayDesign) {
    return (
      <SkillDetailSkeleton 
        username={username} 
        designSlug={designSlug}
        thumbnailUrl={skeletonThumbnail}
        name={skeletonName}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SkillDetailHeader
        username={username}
        designSlug={designSlug}
        previewTheme={previewTheme}
        isShowingFiles={activeTab === "code"}
        onToggleFiles={() => setActiveTab(activeTab === "preview" ? "code" : "preview")}
        onToggleTheme={togglePreviewTheme}
      />

      <div className="flex">
        <SkillDetailSidebar
          design={displayDesign}
          username={username}
          user={user}
          isCopied={isCopied}
          isStarredState={!!isStarredState}
          isBookmarkedState={!!isBookmarkedState}
          onCopyInstall={handleCopyInstall}
          onStarClick={handleStarClick}
          onBookmarkClick={handleBookmarkClick}
        />

        <main className="flex-1 h-[calc(100vh-56px)] overflow-hidden">
          {activeTab === "preview" ? (
            <PreviewContent
              design={displayDesign}
              demoUrl={displayDesign.demoUrl}
              previewTheme={previewTheme}
            />
          ) : (
            <CodeView design={displayDesign} />
          )}
        </main>
      </div>
    </div>
  )
}
