import { useMemo } from "react"
import { Link } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, Search01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { Design } from "@/lib/types/design"

interface StudioFiltersProps {
  designs: Design[] | undefined
  activeTab: "approved" | "pending" | "draft" | "rejected"
  onTabChange: (tab: "approved" | "pending" | "draft" | "rejected") => void
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
    if (!designs) return { approved: 0, pending: 0, draft: 0, rejected: 0 }
    return {
      approved: designs.filter((d) => d.status === "approved").length,
      pending: designs.filter((d) => d.status === "pending").length,
      draft: designs.filter((d) => d.status === "draft").length,
      rejected: designs.filter((d) => d.status === "rejected").length,
    }
  }, [designs])

  const tabs = [
    { id: "approved", label: "Published", count: counts.approved },
    { id: "pending", label: "Reviewing", count: counts.pending },
    { id: "draft", label: "Draft", count: counts.draft },
    { id: "rejected", label: "Rejected", count: counts.rejected },
  ] as const

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "h-9 rounded-md px-3 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label} {tab.count}
          </button>
        ))}
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
          <Button size="lg" className="gap-2">
            <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
            Create New
          </Button>
        </Link>
      </div>
    </div>
  )
}
