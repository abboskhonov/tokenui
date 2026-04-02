import { useMemo } from "react"
import { Link } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, Search01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { Design } from "@/lib/types/design"

interface StudioFiltersProps {
  designs: Design[] | undefined
  activeTab: "published" | "draft"
  onTabChange: (tab: "published" | "draft") => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function StudioFilters({
  designs,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
}: StudioFiltersProps) {
  const counts = useMemo(() => {
    if (!designs) return { published: 0, drafts: 0 }
    return {
      published: designs.filter((d) => d.isPublic).length,
      drafts: designs.filter((d) => !d.isPublic).length,
    }
  }, [designs])

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2 rounded-lg bg-muted p-1">
        <button
          onClick={() => onTabChange("published")}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            activeTab === "published"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Published {counts.published}
        </button>
        <button
          onClick={() => onTabChange("draft")}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            activeTab === "draft"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Draft {counts.drafts}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <HugeiconsIcon
            icon={Search01Icon}
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 w-64 rounded-lg bg-muted pl-9 pr-3 text-sm outline-none ring-1 ring-border transition-all placeholder:text-muted-foreground focus:ring-foreground/20"
          />
        </div>
        <Link to="/publish">
          <Button className="gap-2">
            <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
            Create New
          </Button>
        </Link>
      </div>
    </div>
  )
}
