"use client"

import * as React from "react"
import { useCallback } from "react"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SkillCard } from "@/components/marketing/skill-card"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Download01Icon,
  ArrowRight01Icon,
  Clock01Icon,
  StarIcon,
  FireIcon,
} from "@hugeicons/core-free-icons"
import { ChevronRight } from "lucide-react"
import { usePublicDesigns, designKeys } from "@/lib/queries/designs"
import { useNavigate } from "@tanstack/react-router"
import { useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api/client"
import type { Design } from "@/lib/types/design"

interface DesignCardProps {
  design: {
    id: string
    name: string
    slug: string
    description: string | null
    category: string
    thumbnailUrl: string | null
    demoUrl: string | null
    viewCount: number
    userId: string
    author?: {
      name: string | null
      username: string | null
      image: string | null
    }
  }
  queryClient: ReturnType<typeof useQueryClient>
}

function DesignCard({ design, queryClient }: DesignCardProps) {
  const navigate = useNavigate()
  const username = design.author?.username || "unknown"
  
  // Prefetch design data on hover for instant navigation
  const handleMouseEnter = useCallback(() => {
    const username = design.author?.username || "unknown"
    const slug = design.slug
    
    queryClient.prefetchQuery({
      queryKey: designKeys.detail(username, slug),
      queryFn: async () => {
        const response = await api.get<{ design: Design }>(`/api/designs/${username}/${slug}`)
        return response.design
      },
      staleTime: 1000 * 60 * 2,
    })
  }, [design, queryClient])
  
  const handleCardClick = useCallback(() => {
    navigate({
      to: "/s/$username/$designSlug",
      params: { username, designSlug: design.slug }
    })
  }, [navigate, username, design.slug])
  
  const handleAuthorClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    navigate({
      to: "/u/$username",
      params: { username }
    })
  }, [navigate, username])
  
  return (
    <article 
      className="group relative cursor-pointer z-0 hover:z-50"
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
    >
      {/* Thumbnail Container - moves up on hover */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted ring-1 ring-border/50 transition-all duration-300 ease-out group-hover:-translate-y-3 group-hover:shadow-lg group-hover:shadow-foreground/5 group-hover:ring-border group-hover:scale-[1.02]">
        <div style={{ viewTransitionName: `design-thumbnail-${design.id}` }}>
          {design.thumbnailUrl ? (
            <img 
              src={design.thumbnailUrl} 
              alt={design.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <SkillCard variant="pattern" />
          )}
        </div>
      </div>
      
      {/* Metadata - appears below the card on hover */}
      <div className="absolute -bottom-3 left-0 right-0 flex items-center justify-between px-1 pt-3 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100">
        <div 
          className="flex items-center gap-3 min-w-0 cursor-pointer"
          onClick={handleAuthorClick}
        >
          <div className="relative h-6 w-6 shrink-0">
            {design.author?.image ? (
              <img
                src={design.author.image}
                alt=""
                className="h-full w-full rounded-full object-cover ring-1 ring-border/50"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground ring-1 ring-border/50">
                {(design.author?.name || design.name).charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h3 
            className="text-sm font-medium text-foreground tracking-tight truncate hover:text-primary transition-colors"
            style={{ viewTransitionName: `design-name-${design.id}` }}
          >
            {design.name}
          </h3>
        </div>
        <span className="text-xs font-medium text-muted-foreground/70 tabular-nums shrink-0">
          {design.viewCount.toLocaleString()}
        </span>
      </div>
    </article>
  )
}

export function SkillsGallery() {
  const { data: designs, isLoading, error } = usePublicDesigns()
  const queryClient = useQueryClient()

  return (
    <section className="relative w-full" id="skills">
      {/* Main bordered container */}
      <div className="relative mx-auto flex w-full max-w-full flex-col border-y bg-[radial-gradient(35%_80%_at_50%_0%,--theme(--color-foreground/.08),transparent)] px-4 pt-16 pb-8 overflow-visible">
        {/* Corner PlusIcons */}
        <PlusIcon
          className="absolute top-[-12.5px] left-[-11.5px] z-1 size-6"
          strokeWidth={1}
        />
        <PlusIcon
          className="absolute top-[-12.5px] right-[-11.5px] z-1 size-6"
          strokeWidth={1}
        />
        <PlusIcon
          className="absolute bottom-[-12.5px] left-[-11.5px] z-1 size-6"
          strokeWidth={1}
        />
        <PlusIcon
          className="absolute right-[-11.5px] bottom-[-12.5px] z-1 size-6"
          strokeWidth={1}
        />

        {/* Extended side border lines */}
        <div className="-inset-y-6 pointer-events-none absolute left-0 w-px border-l" />
        <div className="-inset-y-6 pointer-events-none absolute right-0 w-px border-r" />

        {/* Content */}
        <div className="relative z-10 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/30 pb-3 mb-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                Components
              </span>
              <ChevronRight className="size-3 text-muted-foreground/50" />
              <span className="text-foreground font-medium">All</span>
            </div>
            
            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="ghost" size="sm" className="gap-2 h-8 text-sm text-muted-foreground hover:text-foreground">
                  <span>Newest</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-3 rotate-90" />
                </Button>
              } />
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem className="gap-2 text-sm">
                  <HugeiconsIcon icon={Clock01Icon} className="size-4" />
                  Newest
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 text-sm">
                  <HugeiconsIcon icon={Download01Icon} className="size-4" />
                  Most Downloaded
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 text-sm">
                  <HugeiconsIcon icon={StarIcon} className="size-4" />
                  Best Rated
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 text-sm">
                  <HugeiconsIcon icon={FireIcon} className="size-4" />
                  Trending
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Section Title */}
          <div className="mb-4">
            <h2 className="text-sm font-medium text-foreground">Newest</h2>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="py-12 text-center">
              <p className="text-sm text-destructive">Failed to load designs</p>
              <p className="text-xs text-muted-foreground mt-1">Please try again later</p>
            </div>
          )}

          {/* Grid - Linear style 4 columns */}
          {!isLoading && !error && designs && (
            <div className="grid gap-8 grid-cols-2 lg:grid-cols-4 pb-12 isolate">
              {designs.length === 0 ? (
                <div className="col-span-full py-12 text-center">
                  <p className="text-sm text-muted-foreground">No designs published yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Be the first to publish!</p>
                </div>
              ) : (
                designs.map((design) => (
                  <DesignCard key={design.id} design={design} queryClient={queryClient} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
