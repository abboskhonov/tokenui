"use client"

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
import { usePublicDesigns } from "@/lib/queries/designs"
import { Link } from "@tanstack/react-router"

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
}

function DesignCard({ design }: DesignCardProps) {
  return (
    <Link to="/s/$username/$designSlug" params={{ 
      username: design.author?.username || "unknown", 
      designSlug: design.slug 
    }}>
      <article className="group relative cursor-pointer">
        {/* Thumbnail Container */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted ring-1 ring-border/50 transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:shadow-lg group-hover:shadow-foreground/5 group-hover:ring-border/80">
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
        
        {/* Metadata - appears below card on hover */}
        <div className="absolute -bottom-10 left-0 right-0 flex items-center justify-between px-1 pt-3 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100">
          <div className="flex items-center gap-2">
            <div className="relative h-5 w-5">
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
            <h3 className="text-sm font-medium text-foreground tracking-tight">
              {design.name}
            </h3>
          </div>
          <span className="text-xs font-medium text-muted-foreground/70 tabular-nums">
            {design.viewCount.toLocaleString()} views
          </span>
        </div>
      </article>
    </Link>
  )
}

export function SkillsGallery() {
  const { data: designs, isLoading, error } = usePublicDesigns()

  return (
    <section className="relative w-full" id="skills">
      {/* Main bordered container */}
      <div className="relative mx-auto flex w-full max-w-full flex-col border-y bg-[radial-gradient(35%_80%_at_50%_0%,--theme(--color-foreground/.08),transparent)] px-4 py-8">
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
            <div className="grid gap-6 grid-cols-2 lg:grid-cols-4 pb-12">
              {designs.length === 0 ? (
                <div className="col-span-full py-12 text-center">
                  <p className="text-sm text-muted-foreground">No designs published yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Be the first to publish!</p>
                </div>
              ) : (
                designs.map((design) => (
                  <DesignCard 
                    key={design.id} 
                    design={design} 
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}