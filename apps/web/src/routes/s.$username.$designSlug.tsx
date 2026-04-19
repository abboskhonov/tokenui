import { createFileRoute, useLocation } from "@tanstack/react-router"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback, useEffect, useState } from "react"
import type { Design } from "@/lib/types/design"
import { api } from "@/lib/api/client"
import {
  CodeView,
  CodeViewSkeleton,
  PreviewContent,
  SkillDetailError,
  SkillDetailHeader,
  SkillDetailSidebar,
  SkillDetailMobileSheet,
  SkillDetailSkeleton,
  SkillNotFound,
} from "@/features/design-detail/components"
import { useDesignActions } from "@/features/design-detail/hooks"
import { designKeys, useDesignFiles, useTrackView } from "@/lib/queries/designs"

type TabType = "preview" | "code"

// Generate page title from design data
function generatePageTitle(design: Design | undefined, params: { username: string; designSlug: string }): string {
  if (design?.name) {
    return `${design.name} by ${params.username} - tasteui`
  }
  // Fallback to formatted slug while loading
  const formattedSlug = params.designSlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
  return `${formattedSlug} by ${params.username} - tasteui`
}

// Generate meta description from design data
function generatePageDescription(design: Design | undefined, params: { username: string; designSlug: string }): string {
  if (design?.description) {
    return design.description
  }
  if (design?.name) {
    return `${design.name} - a reusable design skill by ${params.username} on tasteui. Browse and install this skill in your projects.`
  }
  return `Browse design skills by ${params.username} on tasteui. Reusable landing page skills, token-driven UI, and dev-focused building blocks.`
}

// Generate OG image URL from design data
function generateOgImage(design: Design | undefined): string {
  if (design?.thumbnailUrl) {
    return design.thumbnailUrl
  }
  return "https://tasteui.dev/og-image.png"
}

// Generate canonical URL
function generateCanonicalUrl(params: { username: string; designSlug: string }): string {
  return `https://tasteui.dev/s/${params.username}/${params.designSlug}`
}

export const Route = createFileRoute("/s/$username/$designSlug")({
  component: SkillDetailPage,
  loader: async ({ params }) => {
    // Fetch design data server-side for SEO
    const response = await api.get<{ design: Design }>(`/api/designs/${params.username}/${params.designSlug}`)
    return { design: response.design }
  },
  head: ({ loaderData, params }) => {
    const design = loaderData?.design
    const title = generatePageTitle(design, params)
    const description = generatePageDescription(design, params)
    const ogImage = generateOgImage(design)
    const canonicalUrl = generateCanonicalUrl(params)
    
    return {
      meta: [
        {
          title,
        },
        {
          name: "description",
          content: description,
        },
        {
          name: "og:title",
          content: title,
        },
        {
          name: "og:description",
          content: description,
        },
        {
          name: "og:type",
          content: "article",
        },
        {
          name: "og:url",
          content: canonicalUrl,
        },
        {
          name: "og:image",
          content: ogImage,
        },
        {
          name: "og:site_name",
          content: "tasteui",
        },
        {
          name: "og:author",
          content: params.username,
        },
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          name: "twitter:title",
          content: title,
        },
        {
          name: "twitter:description",
          content: description,
        },
        {
          name: "twitter:image",
          content: ogImage,
        },
        {
          name: "twitter:creator",
          content: `@${params.username}`,
        },
        {
          name: "canonical",
          content: canonicalUrl,
        },
        {
          name: "robots",
          content: "index, follow",
        },
      ],
    }
  },
  // No blocking loader - navigate immediately and show skeleton while loading
  // Data is already prefetched by the design card's intersection observer + hover
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
  
  // Use useQuery directly with initialData from cache for instant rendering
  const { data: design, isLoading, error } = useQuery({
    queryKey: designKeys.detail(username, designSlug),
    queryFn: async () => {
      const response = await api.get<{ design: Design }>(`/api/designs/${username}/${designSlug}`)
      return response.design
    },
    initialData: cachedDesign,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5,
    enabled: !!username && !!designSlug,
  })
  
  // Use cached/prefetched data immediately while loading for perceived instant navigation
  const displayDesign = design || cachedDesign
  const trackView = useTrackView()
  
  const [activeTab, setActiveTab] = useState<TabType>("preview")
  
  // Extract thumbnail and name for skeleton before displayDesign is narrowed
  const skeletonThumbnail = thumbnailFromState || previewFromStorage.thumbnailUrl || cachedDesign?.thumbnailUrl || null
  const skeletonName = nameFromState || previewFromStorage.name || cachedDesign?.name
  
  // Lazy load files when Code tab is active
  const { data: filesData, isLoading: isFilesLoading } = useDesignFiles(
    username, 
    designSlug, 
    activeTab === "code"
  )
  
  // Merge files into design when loaded
  const designWithFiles = displayDesign && filesData?.files
    ? { ...displayDesign, files: filesData.files }
    : displayDesign
  
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
        onError: (err) => {
          console.error("Failed to track view:", err)
        }
      })
    }
  }, [design?.id, isLoading, username, designSlug])

  const handleCopyInstall = useCallback(() => {
    const command = displayDesign ? `npx tasteui.dev@latest add ${displayDesign.author?.username || username}/${displayDesign.slug}` : ""
    handleCopy(command, "install")
  }, [displayDesign, username, handleCopy])

  // Mobile sidebar state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

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
        isShowingFiles={activeTab === "code"}
        onToggleFiles={() => setActiveTab(activeTab === "preview" ? "code" : "preview")}
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
      />

      <div className="flex flex-col lg:flex-row h-[calc(100vh-48px)] lg:h-[calc(100vh-48px)]">
        {/* Desktop Sidebar - hidden on mobile */}
        <div className="hidden lg:block">
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
        </div>

        {/* Mobile Sidebar Sheet */}
        <SkillDetailMobileSheet
          design={displayDesign}
          username={username}
          user={user}
          isCopied={isCopied}
          isStarredState={!!isStarredState}
          isBookmarkedState={!!isBookmarkedState}
          onCopyInstall={handleCopyInstall}
          onStarClick={handleStarClick}
          onBookmarkClick={handleBookmarkClick}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 min-h-0 overflow-hidden">
          {activeTab === "preview" ? (
            <PreviewContent
              design={displayDesign}
              previewTheme="light"
            />
          ) : isFilesLoading ? (
            <CodeViewSkeleton />
          ) : (
            <CodeView design={designWithFiles || displayDesign} />
          )}
        </main>
      </div>
    </div>
  )
}
