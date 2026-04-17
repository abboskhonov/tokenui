import { Link } from "@tanstack/react-router"
import { ViewTransition } from "./view-transition"
import type { Design } from "@/lib/types/design"
import type { UserProfile } from "@/lib/queries/users"

interface DesignCardProps {
  design: Design
  username: string
  user?: UserProfile
}

export function DesignCard({ design, username, user }: DesignCardProps) {
  return (
    <Link to="/s/$username/$designSlug" params={{ username, designSlug: design.slug }}>
      <ViewTransition name={`design-thumbnail-${design.id}`} share="morph-forward" default="none">
        <article className="group relative cursor-pointer">
          {/* Device Frame Wrapper */}
          <div className="relative p-1.5 md:p-2 rounded-xl md:rounded-2xl bg-muted/30 ring-1 ring-border/40">
            {/* Inner Thumbnail Container - aspect-video like hero */}
            <div className="relative aspect-video overflow-hidden rounded-md md:rounded-lg bg-muted">
              {design.thumbnailUrl ? (
                <img
                  src={design.thumbnailUrl}
                  alt={design.name}
                  width={400}
                  height={225}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                  <span className="text-4xl font-bold text-muted-foreground">
                    {design.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>

            {/* Card name with author - inside wrapper below thumbnail */}
            <div className="mt-2 px-2 py-1.5 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-medium text-foreground truncate leading-tight">
                  {design.name}
                </h2>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.name || username}
                </p>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground shrink-0">
                <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <span className="text-xs font-medium tabular-nums">
                  {design.viewCount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </article>
      </ViewTransition>
    </Link>
  )
}
