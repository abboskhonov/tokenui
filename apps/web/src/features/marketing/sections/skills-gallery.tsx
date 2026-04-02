"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SkillCard } from "@/components/marketing/skill-card"
import { DesignDetailDialog } from "@/components/marketing/design-detail-dialog"
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

interface DesignCardProps {
  design: {
    id: string
    name: string
    description: string | null
    category: string
    thumbnailUrl: string | null
    demoUrl: string | null
    viewCount: number
    userId: string
  }
  onClick: () => void
}

function DesignCard({ design, onClick }: DesignCardProps) {
  return (
    <div 
      onClick={onClick}
      className="group relative overflow-hidden rounded-lg border border-border/20 bg-background/50 transition-all duration-300 hover:border-border/40 hover:bg-background cursor-pointer"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {design.thumbnailUrl ? (
          <img 
            src={design.thumbnailUrl} 
            alt={design.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <SkillCard variant="pattern" />
        )}
        
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Content overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[10px] font-medium text-white backdrop-blur-sm">
                {design.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-white">{design.name}</span>
                <span className="text-[10px] text-white/60">{design.category}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-white/60">
              <HugeiconsIcon icon={Download01Icon} className="size-3" />
              {design.viewCount.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Card info below image */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-foreground truncate">{design.name}</h3>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {design.description || "No description"}
        </p>
      </div>
    </div>
  )
}

export function SkillsGallery() {
  const { data: designs, isLoading, error } = usePublicDesigns()
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleDesignClick = (designId: string) => {
    setSelectedDesignId(designId)
    setDialogOpen(true)
  }

  return (
    <section className="flex flex-col" id="skills">
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
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
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
                onClick={() => handleDesignClick(design.id)}
              />
            ))
          )}
        </div>
      )}

      {/* Design Detail Dialog */}
      <DesignDetailDialog
        designId={selectedDesignId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </section>
  )
}
