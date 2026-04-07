import { createFileRoute } from "@tanstack/react-router"
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

// Loader function to prefetch design data during route resolution
async function designLoader({ params }: { params: { username: string; designSlug: string } }) {
  const { username, designSlug } = params
  
  // Fetch the design data immediately
  const response = await api.get<{ design: Design }>(`/api/designs/${username}/${designSlug}`)
  
  // Prefetch the demo URL HTML content if available (browser only)
  if (typeof window !== "undefined" && response.design.demoUrl) {
    const link = document.createElement("link")
    link.rel = "prefetch"
    link.href = response.design.demoUrl
    link.as = "document"
    document.head.appendChild(link)
  }
  
  return {
    design: response.design,
    username,
    designSlug,
  }
}

export const Route = createFileRoute("/s/$username/$designSlug")({
  component: SkillDetailPage,
  loader: designLoader,
  head: ({ params }) => ({
    meta: [
      {
        title: `${params.designSlug} by ${params.username} - tokenui`,
      },
    ],
  }),
  errorComponent: () => <SkillDetailError />,
  notFoundComponent: () => <SkillNotFound />,
})

type TabType = "preview" | "code"

function SkillDetailPage() {
  const { username, designSlug } = Route.useParams()
  const loaderData = Route.useLoaderData()
  const queryClient = useQueryClient()
  
  // Hydrate React Query cache with loader data immediately
  useEffect(() => {
    if (loaderData?.design) {
      queryClient.setQueryData(designKeys.detail(username, designSlug), loaderData.design)
    }
  }, [loaderData, queryClient, username, designSlug])
  
  const { data: design, isLoading, error } = useDesign(username, designSlug)
  const trackView = useTrackView()
  
  const [activeTab, setActiveTab] = useState<TabType>("preview")
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light")
  
  // Only use design actions when design is loaded
  const designActions = useDesignActions(design)
  
  const { user, isBookmarkedState, handleBookmarkClick, isStarredState, handleStarClick, isCopied, handleCopy } = designActions

  // Track view when page loads
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
    const command = design ? `npx tokenui.sh add ${design.author?.username || username}/${design.slug}` : ""
    handleCopy(command, "install")
  }, [design, username, handleCopy])

  // Preview handlers
  const togglePreviewTheme = useCallback(() => {
    setPreviewTheme(prev => prev === "light" ? "dark" : "light")
  }, [])

  if (error) {
    console.error("Route error:", error)
    return <SkillDetailError />
  }

  if (!design) {
    return <SkillDetailSkeleton username={username} designSlug={designSlug} />
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
          design={design}
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
              design={design}
              demoUrl={design.demoUrl}
              previewTheme={previewTheme}
            />
          ) : (
            <CodeView design={design} />
          )}
        </main>
      </div>
    </div>
  )
}
