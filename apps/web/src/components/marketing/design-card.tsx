"use client";

import { memo, useCallback } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import type { Design } from "@/lib/types/design"
import { SkillCard } from "@/components/marketing/skill-card"
import { HugeiconsIcon } from "@hugeicons/react"
import { Bookmark01Icon } from "@hugeicons/core-free-icons"
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
  const navigate = useNavigate();
  const { data: isBookmarked } = useBookmarkCheck(design.id);
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
  
  return (
    <Link 
      to="/s/$username/$designSlug" 
      params={{ username, designSlug: design.slug }}
    >
      <article className="group relative cursor-pointer">
        {/* Thumbnail Container - moves up on hover */}
        <div className="relative aspect-video overflow-hidden rounded-xl bg-muted ring-1 ring-border/50 transition-all duration-300 ease-out group-hover:-translate-y-3 group-hover:ring-border/80">
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
            />
          ) : (
            <SkillCard variant="pattern" />
          )}
        </div>
        
        {/* Metadata - appears below the card on hover */}
        <div className="absolute -bottom-3 left-0 right-0 flex items-center justify-between px-1 pt-2 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100">
          <div 
            className="flex items-center gap-2 min-w-0 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate({ to: "/u/$username", params: { username } });
            }}
          >
            <AuthorAvatar 
              image={design.author?.image} 
              name={design.author?.name || design.name} 
            />
            <h3 className="text-xs font-medium text-foreground tracking-tight truncate hover:text-primary transition-colors">
              {design.name}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {user && (
              <button
                onClick={handleBookmarkClick}
                disabled={isPending}
                className={cn(
                  "flex items-center justify-center rounded-md p-1 transition-all duration-200",
                  isBookmarkedState 
                    ? "text-primary" 
                    : "text-muted-foreground/70 hover:text-foreground",
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
            <span className="text-[10px] font-medium text-muted-foreground/70 tabular-nums shrink-0">
              {design.viewCount.toLocaleString()}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
});

/**
 * AuthorAvatar - Sub-component for displaying author avatar
 */
interface AuthorAvatarProps {
  image: string | null | undefined;
  name: string;
}

const AuthorAvatar = memo(function AuthorAvatar({ image, name }: AuthorAvatarProps) {
  return (
    <div className="relative h-5 w-5 shrink-0">
      {image ? (
        <img
          src={image}
          alt=""
          width={20}
          height={20}
          className="h-full w-full rounded-full object-cover ring-1 ring-border/50"
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground ring-1 ring-border/50">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
});
