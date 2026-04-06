import { useMemo } from "react"
import { StatsCard } from "./StatsCard"
import type { Design } from "@/lib/types/design"
import { useViewAnalytics, useCliAnalytics } from "@/lib/queries/designs"
import {
  EyeIcon,
  CodeIcon,
  Copy01Icon,
  Download01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

interface StudioStatsProps {
  designs: Design[] | undefined
}

export function StudioStats({ designs }: StudioStatsProps) {
  const { data: viewAnalytics } = useViewAnalytics()
  const { data: cliAnalytics } = useCliAnalytics()
  
  const stats = useMemo(() => {
    if (!designs) {
      return { published: 0, drafts: 0, reviewing: 0, views: 0, bookmarks: 0, cliRuns: 0 }
    }
    return {
      published: designs.filter((d) => d.status === "approved").length,
      drafts: designs.filter((d) => d.status === "draft").length,
      reviewing: designs.filter((d) => d.status === "pending").length,
      views: viewAnalytics?.totalViews || designs.reduce((sum, d) => sum + d.viewCount, 0),
      bookmarks: 0, // Not implemented yet
      cliRuns: cliAnalytics?.totalRuns || 0,
    }
  }, [designs, viewAnalytics, cliAnalytics])

  return (
    <>
      {/* Summary */}
      <div className="mb-8 flex flex-wrap items-center gap-6 text-sm">
        <div>
          <span className="font-semibold">{stats.published}</span>{" "}
          <span className="text-muted-foreground">published</span>
        </div>
        <div>
          <span className="font-semibold">{stats.drafts}</span>{" "}
          <span className="text-muted-foreground">drafts</span>
        </div>
        <div>
          <span className="font-semibold">{stats.views}</span>{" "}
          <span className="text-muted-foreground">views</span>
        </div>
        <div>
          <span className="font-semibold">{stats.bookmarks}</span>{" "}
          <span className="text-muted-foreground">bookmarks</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Views"
          value={stats.views}
          icon={<HugeiconsIcon icon={EyeIcon} className="size-4" />}
          chartData={viewAnalytics?.dailyViews}
        />
        <StatsCard
          label="Code Copies"
          value={0}
          icon={<HugeiconsIcon icon={CodeIcon} className="size-4" />}
        />
        <StatsCard
          label="Prompt Copies"
          value={0}
          icon={<HugeiconsIcon icon={Copy01Icon} className="size-4" />}
        />
        <StatsCard
          label="CLI Runs"
          value={stats.cliRuns}
          icon={<HugeiconsIcon icon={Download01Icon} className="size-4" />}
          chartData={cliAnalytics?.dailyRuns}
        />
      </div>
    </>
  )
}
