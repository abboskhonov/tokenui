"use client";

import { memo, useCallback, useState } from "react"
import { Link } from "@tanstack/react-router"
import { toast } from "sonner"
import type { Design } from "@/lib/types/design"
import { SkillCard } from "@/components/marketing/skill-card"
import { HugeiconsIcon } from "@hugeicons/react"
import { Bookmark01Icon, Copy01Icon, Tick02Icon, Download02Icon } from "@hugeicons/core-free-icons"
import { useBookmarkCheck, useCreateBookmark, useDeleteBookmark } from "@/lib/queries/designs"
import { useUser } from "@/lib/user-context"
import { cn } from "@/lib/utils"

/**
 * DesignCard - Displays a design thumbnail with hover metadata
 * Links to both the design detail page and author profile
 */
interface DesignCardProps {
  design: Design;
}

export const DesignCard = memo(function DesignCard({ design }: DesignCardProps) {
  const username = design.author?.username || "unknown";
  const { user } = useUser();
  const { data: isBookmarked } = useBookmarkCheck(design.id, false, !!user);
  const createBookmark = useCreateBookmark();
  const deleteBookmark = useDeleteBookmark();
  
  // Optimistic state for instant feedback
  const isBookmarkedState = isBookmarked || createBookmark.variables === design.id;
  const isPending = createBookmark.isPending || deleteBookmark.isPending;
  
  const handleBookmarkClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error("Please sign in to save skills");
      return;
    }
    
    if (isPending) return;
    
    if (isBookmarked) {
      deleteBookmark.mutate(design.id, {
        onSuccess: () => {
          toast.success("Removed from saved");
        },
        onError: () => {
          toast.error("Failed to remove");
        }
      });
    } else {
      createBookmark.mutate(design.id, {
        onSuccess: () => {
          toast.success("Saved to your collection");
        },
        onError: () => {
          toast.error("Failed to save");
        }
      });
    }
  }, [isBookmarked, isPending, design.id, design.name, deleteBookmark, createBookmark, user]);
  
  // Copy command state
  const [isCopied, setIsCopied] = useState(false);
  
  const handleCopyClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const command = `npx tasteui.dev add ${username}/${design.slug}`;
    navigator.clipboard.writeText(command).then(() => {
      setIsCopied(true);
      toast.success("Command copied to clipboard");
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(() => {
      toast.error("Failed to copy");
    });
  }, [username, design.slug]);
  
  return (
      <Link 
      to="/s/$username/$designSlug" 
      params={{ username, designSlug: design.slug }}
    >
      <article className="group relative cursor-pointer">
        {/* Device Frame Wrapper - subtle tint to distinguish from bg */}
        <div className="relative p-1.5 md:p-2 rounded-xl md:rounded-2xl bg-muted/30 ring-1 ring-border/40">
          {/* Inner Thumbnail Container */}
          <div className="relative aspect-video overflow-hidden rounded-md md:rounded-lg bg-muted">
          {design.thumbnailUrl ? (
            <img
              src={design.thumbnailUrl}
              alt={design.name}
              width={400}
              height={225}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <SkillCard variant="pattern" />
          )}
          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          
          {/* Description - appears on hover at bottom */}
          {design.description && (
            <div className="absolute bottom-4 left-3 right-3 opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
              <p className="text-xs text-white/90 line-clamp-2 drop-shadow-sm">
                {design.description}
              </p>
            </div>
          )}
          
          {/* Action buttons - appear on hover at top right */}
          <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            {/* Copy command button */}
            <button
              onClick={handleCopyClick}
              className={cn(
                "flex items-center justify-center rounded-md p-1.5 bg-black/50 backdrop-blur-sm transition-all duration-200",
                isCopied 
                  ? "text-green-400" 
                  : "text-white/80 hover:text-white hover:bg-black/70"
              )}
              aria-label={isCopied ? "Copied!" : "Copy install command"}
            >
              <HugeiconsIcon 
                icon={isCopied ? Tick02Icon : Copy01Icon} 
                className={cn(
                  "size-3.5 transition-all duration-200",
                  isCopied && "scale-110"
                )} 
              />
            </button>
            {user && (
              <button
                onClick={handleBookmarkClick}
                disabled={isPending}
                className={cn(
                  "flex items-center justify-center rounded-md p-1.5 bg-black/50 backdrop-blur-sm transition-all duration-200",
                  isBookmarkedState 
                    ? "text-white" 
                    : "text-white/80 hover:text-white hover:bg-black/70",
                  isPending && "opacity-50"
                )}
                aria-label={isBookmarkedState ? "Remove bookmark" : "Add bookmark"}
              >
                <HugeiconsIcon 
                  icon={Bookmark01Icon} 
                  className={cn(
                    "size-3.5 transition-all duration-200",
                    isBookmarkedState && "fill-current scale-110"
                  )} 
                />
              </button>
            )}
          </div>
          </div>
          
          {/* Card name with install count - inside wrapper below thumbnail */}
          <div className="mt-2 px-2 py-1.5 flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-medium text-foreground truncate leading-tight">
                {design.name}
              </h2>
              <p className="text-xs text-muted-foreground truncate">
                {username}
              </p>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground shrink-0">
              <HugeiconsIcon icon={Download02Icon} className="size-3.5" />
              <span className="text-xs font-medium tabular-nums">
                {(design.installCount ?? 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
});


