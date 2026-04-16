import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useBookmarks, useDeleteBookmark } from "@/lib/queries/designs"
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation/main-navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  Bookmark01Icon,
  Cancel01Icon,
  ArrowLeftIcon,
} from "@hugeicons/core-free-icons"
import { Skeleton } from "@/components/ui/skeleton"
import { useCallback } from "react"

export const Route = createFileRoute("/bookmarks")({
  component: BookmarksPage,
  head: () => ({
    meta: [{ title: "Saved Skills - tasteui" }],
  }),
})

function BookmarksPage() {
  const { data: bookmarks, isLoading, error } = useBookmarks()
  const deleteBookmark = useDeleteBookmark()
  const navigate = useNavigate()

  const handleRemoveBookmark = useCallback((designId: string) => {
    deleteBookmark.mutate(designId)
  }, [deleteBookmark])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-16 xl:px-20 pt-[72px] pb-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate({ to: "/" })}
            className="h-8 w-8"
          >
            <HugeiconsIcon icon={ArrowLeftIcon} className="size-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Saved Skills</h1>
            <p className="text-sm text-muted-foreground">
              {bookmarks?.length || 0} {bookmarks?.length === 1 ? "skill" : "skills"} saved
            </p>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <BookmarksLoading />
        ) : error ? (
          <BookmarksError />
        ) : !bookmarks || bookmarks.length === 0 ? (
          <BookmarksEmpty />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((bookmark) => (
              <BookmarkCard 
                key={bookmark.id} 
                bookmark={bookmark} 
                onRemove={() => handleRemoveBookmark(bookmark.designId)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

interface BookmarkCardProps {
  bookmark: {
    id: string
    designId: string
    designName: string
    designSlug: string
    designDescription: string | null
    designCategory: string
    designThumbnailUrl: string | null
    designViewCount: number
    authorName: string | null
    authorUsername: string | null
    authorImage: string | null
  }
  onRemove: () => void
}

function BookmarkCard({ bookmark, onRemove }: BookmarkCardProps) {
  return (
    <div className="group relative">
      <Link 
        to="/s/$username/$designSlug" 
        params={{ 
          username: bookmark.authorUsername || "unknown", 
          designSlug: bookmark.designSlug 
        }}
      >
        <article className="relative cursor-pointer">
          {/* Thumbnail */}
          <div className="relative aspect-video overflow-hidden rounded-xl bg-muted ring-1 ring-border/50 transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:ring-border/80">
            {bookmark.designThumbnailUrl ? (
              <img
                src={bookmark.designThumbnailUrl}
                alt={bookmark.designName}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <HugeiconsIcon icon={Bookmark01Icon} className="size-8 text-muted-foreground" />
              </div>
            )}
          </div>
          
          {/* Metadata */}
          <div className="mt-3 flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-medium text-foreground truncate">
                {bookmark.designName}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                by {bookmark.authorName || bookmark.authorUsername || "Unknown"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0 text-primary hover:text-primary/80"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onRemove()
              }}
              aria-label="Remove bookmark"
            >
              <HugeiconsIcon icon={Bookmark01Icon} className="size-4 fill-current" />
            </Button>
          </div>
        </article>
      </Link>
    </div>
  )
}

function BookmarksLoading() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-video rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}

function BookmarksError() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <HugeiconsIcon icon={Cancel01Icon} className="size-8 text-destructive" />
      </div>
      <p className="text-lg font-medium mb-2">Failed to load bookmarks</p>
      <p className="text-sm text-muted-foreground mb-4">Please try again later</p>
      <Button variant="outline" onClick={() => window.location.reload()}>
        Retry
      </Button>
    </div>
  )
}

function BookmarksEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <HugeiconsIcon icon={Bookmark01Icon} className="size-8 text-muted-foreground" />
      </div>
      <p className="text-lg font-medium mb-2">No saved skills</p>
      <p className="text-sm text-muted-foreground mb-4">
        Save skills you find useful to access them later
      </p>
      <Button onClick={() => window.location.href = "/"}>Browse Skills</Button>
    </div>
  )
}
