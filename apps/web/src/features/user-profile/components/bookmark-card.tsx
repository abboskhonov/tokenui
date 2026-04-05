import { Link } from "@tanstack/react-router"
import { ViewTransition } from "./view-transition"
import type { Bookmark } from "@/lib/types/design"

interface BookmarkCardProps {
  bookmark: Bookmark
}

export function BookmarkCard({ bookmark }: BookmarkCardProps) {
  const username = bookmark.authorUsername || "unknown"
  
  return (
    <Link 
      to="/s/$username/$designSlug" 
      params={{ username, designSlug: bookmark.designSlug }}
    >
      <ViewTransition name={`design-thumbnail-${bookmark.designId}`} share="morph-forward" default="none">
        <article className="group relative cursor-pointer">
          {/* Thumbnail */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted ring-1 ring-border/50 transition-all duration-300 ease-out group-hover:-translate-y-3 group-hover:shadow-lg group-hover:shadow-foreground/5 group-hover:ring-border">
            {bookmark.designThumbnailUrl ? (
              <img
                src={bookmark.designThumbnailUrl}
                alt={bookmark.designName}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                <span className="text-4xl font-bold text-muted-foreground">
                  {bookmark.designName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-between px-1 pt-2 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100">
            <h3 className="text-sm font-medium text-foreground truncate">
              {bookmark.designName}
            </h3>
            <span className="text-xs font-medium text-muted-foreground/70 tabular-nums shrink-0">
              {bookmark.designViewCount.toLocaleString()}
            </span>
          </div>
        </article>
      </ViewTransition>
    </Link>
  )
}
