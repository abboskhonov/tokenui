import { HugeiconsIcon } from "@hugeicons/react"
import {
  Edit01Icon,
  Delete01Icon,
  MoreVerticalIcon,
  EyeIcon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Link } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import type { Design } from "@/lib/types/design"

interface DesignsGridProps {
  designs: Design[]
  isLoading: boolean
  activeTab: "published" | "draft"
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

function DesignCard({ 
  design, 
  onEdit, 
  onDelete 
}: { 
  design: Design
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}) {
  const copies = Math.max(1, Math.floor(design.viewCount * 0.1))
  
  return (
    <div className="group relative rounded-xl bg-card ring-1 ring-border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-foreground/5 hover:ring-border/80">
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {design.thumbnailUrl ? (
          <img
            src={design.thumbnailUrl}
            alt={design.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-xs text-muted-foreground">No preview</span>
          </div>
        )}
        
        {/* Hover overlay with actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex items-center justify-center gap-2">
          <Button 
            variant="secondary" 
            size="sm" 
            className="gap-2"
            onClick={() => onEdit(design.id)}
          >
            <HugeiconsIcon icon={Edit01Icon} className="size-4" />
            Edit
          </Button>
          <Link to="/s/$username/$designSlug" params={{ 
            username: design.author?.username || "unknown", 
            designSlug: design.slug 
          }}>
            <Button variant="outline" size="sm" className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white">
              <HugeiconsIcon icon={EyeIcon} className="size-4" />
              View
            </Button>
          </Link>
        </div>
        
        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs font-medium border-0",
              design.isPublic 
                ? "bg-green-500/90 text-white" 
                : "bg-amber-500/90 text-white"
            )}
          >
            {design.isPublic ? "Published" : "Draft"}
          </Badge>
        </div>
        
        {/* Actions dropdown */}
        <div className="absolute top-3 right-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/50 text-white hover:bg-black/70 hover:text-white">
                  <HugeiconsIcon icon={MoreVerticalIcon} className="size-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onEdit(design.id)}>
                <HugeiconsIcon icon={Edit01Icon} className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(design.id)}
                className="text-destructive focus:text-destructive"
              >
                <HugeiconsIcon icon={Delete01Icon} className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-medium text-foreground">{design.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{design.category}</p>
          </div>
        </div>
        
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="tabular-nums font-medium text-foreground">{design.viewCount.toLocaleString()}</span>
            <span>views</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="tabular-nums font-medium text-foreground">{copies.toLocaleString()}</span>
            <span>copies</span>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {design.author?.image ? (
              <img
                src={design.author.image}
                alt=""
                className="h-5 w-5 rounded-full object-cover ring-1 ring-border"
              />
            ) : (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground ring-1 ring-border">
                {(design.author?.name || design.name).charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-xs text-muted-foreground">@{design.author?.username || "unknown"}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {new Date(design.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  )
}

export function DesignsGrid({
  designs,
  isLoading,
  activeTab,
  onEdit,
  onDelete,
}: DesignsGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    )
  }

  if (designs.length === 0) {
    return (
      <div className="rounded-xl bg-card/50 ring-1 ring-border py-12 text-center">
        <p className="text-muted-foreground">
          No {activeTab === "published" ? "published designs" : "drafts"} yet
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Create your first design to get started
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {designs.map((design) => (
        <DesignCard
          key={design.id}
          design={design}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}