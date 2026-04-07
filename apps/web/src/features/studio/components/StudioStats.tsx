import { useMemo } from "react"
import { StatsCard, StatsCardSkeleton } from "./StatsCard"
import type { Design } from "@/lib/types/design"
import type { CliAnalytics } from "@/lib/queries/designs"
import {
  EyeIcon,
  StarIcon,
  Download01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

interface StudioStatsProps {
  designs: Design[] | undefined
  viewAnalytics?: { dailyViews: number[]; totalViews: number }
  starAnalytics?: { dailyStars: number[]; totalStars: number }
  downloadAnalytics?: { dailyDownloads: number[]; totalDownloads: number }
  cliAnalytics?: CliAnalytics
  isAnalyticsLoading?: boolean
  isCliLoading?: boolean
}

export function StudioStats({ 
  designs, 
  viewAnalytics, 
  starAnalytics,
  downloadAnalytics,
  cliAnalytics,
  isAnalyticsLoading = false,
  isCliLoading = false,
}: StudioStatsProps) {
  
  const stats = useMemo(() => {
    if (!designs) {
      return { published: 0, drafts: 0, reviewing: 0, views: 0, stars: 0, downloads: 0, cliRuns: 0 }
    }
    return {
      published: designs.filter((d) => d.status === "approved").length,
      drafts: designs.filter((d) => d.status === "draft").length,
      reviewing: designs.filter((d) => d.status === "pending").length,
      views: viewAnalytics?.totalViews || designs.reduce((sum, d) => sum + d.viewCount, 0),
      stars: starAnalytics?.totalStars || designs.reduce((sum, d) => sum + (d.starCount || 0), 0),
      downloads: downloadAnalytics?.totalDownloads || designs.reduce((sum, d) => sum + (d.downloadCount || 0), 0),
      cliRuns: cliAnalytics?.totalRuns || 0,
    }
  }, [designs, viewAnalytics, starAnalytics, downloadAnalytics, cliAnalytics])

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
          <span className="font-semibold">{stats.downloads}</span>{" "}
          <span className="text-muted-foreground">downloads</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isAnalyticsLoading ? (
          <StatsCardSkeleton icon={<HugeiconsIcon icon={EyeIcon} className="size-4" />} />
        ) : (
          <StatsCard
            label="Views"
            value={stats.views}
            icon={<HugeiconsIcon icon={EyeIcon} className="size-4" />}
            chartData={viewAnalytics?.dailyViews}
          />
        )}
        
        {isAnalyticsLoading ? (
          <StatsCardSkeleton icon={<HugeiconsIcon icon={StarIcon} className="size-4" />} />
        ) : (
          <StatsCard
            label="Stars"
            value={stats.stars}
            icon={<HugeiconsIcon icon={StarIcon} className="size-4" />}
            chartData={starAnalytics?.dailyStars}
          />
        )}
        
        {isAnalyticsLoading ? (
          <StatsCardSkeleton icon={<HugeiconsIcon icon={Download01Icon} className="size-4" />} />
        ) : (
          <StatsCard
            label="Downloads"
            value={stats.downloads}
            icon={<HugeiconsIcon icon={Download01Icon} className="size-4" />}
            chartData={downloadAnalytics?.dailyDownloads}
          />
        )}
        
        {isCliLoading ? (
          <StatsCardSkeleton icon={<HugeiconsIcon icon={Download01Icon} className="size-4" />} />
        ) : (
          <StatsCard
            label="CLI Runs"
            value={stats.cliRuns}
            icon={<HugeiconsIcon icon={Download01Icon} className="size-4" />}
            chartData={cliAnalytics?.dailyRuns}
          />
        )}
      </div>
    </>
  )
}
