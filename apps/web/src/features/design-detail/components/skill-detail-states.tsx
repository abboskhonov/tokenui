import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  Cancel01Icon, 
  ArrowLeftIcon,
  File01Icon 
} from "@hugeicons/core-free-icons"

interface SkillDetailSkeletonProps {
  username: string
  designSlug: string
}

export function SkillDetailSkeleton({ username, designSlug }: SkillDetailSkeletonProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 h-12 border-b border-border bg-background/95 backdrop-blur-xl">
        <div className="mx-auto h-full max-w-[1800px] px-4 flex items-center">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Skills
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">{username}</span>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">{designSlug}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Left Sidebar Skeleton */}
        <aside className="w-[320px] min-h-[calc(100vh-48px)] border-r border-border bg-card/30 hidden lg:block">
          <div className="p-6 space-y-6">
            {/* Title Skeleton */}
            <div className="space-y-2">
              <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
              <div className="h-4 w-full bg-muted animate-pulse rounded" />
            </div>

            {/* Author Skeleton */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
              <div className="space-y-1">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-3 w-16 bg-muted animate-pulse rounded" />
              </div>
            </div>

            {/* Install Command Skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              <div className="h-10 w-full bg-muted animate-pulse rounded" />
            </div>

            {/* Buttons Skeleton */}
            <div className="flex gap-2">
              <div className="h-8 w-24 bg-muted animate-pulse rounded" />
              <div className="h-8 w-20 bg-muted animate-pulse rounded" />
              <div className="h-8 w-20 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </aside>

        {/* Main Preview Skeleton */}
        <main className="flex-1 min-h-[calc(100vh-48px)] h-[calc(100vh-48px)] bg-muted/30 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </main>
      </div>
    </div>
  )
}

export function SkillDetailError() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
          <HugeiconsIcon icon={Cancel01Icon} className="size-8 text-destructive" />
        </div>
        <div>
          <p className="text-lg font-medium">Failed to load skill</p>
          <p className="text-sm text-muted-foreground">Please try again later</p>
        </div>
        <Link to="/">
          <Button variant="outline" className="mt-4">
            <HugeiconsIcon icon={ArrowLeftIcon} className="size-4 mr-2" />
            Back to home
          </Button>
        </Link>
      </div>
    </div>
  )
}

export function SkillNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
          <HugeiconsIcon icon={File01Icon} className="size-8 text-muted-foreground" />
        </div>
        <div>
          <p className="text-lg font-medium">Skill not found</p>
          <p className="text-sm text-muted-foreground">The skill you're looking for doesn't exist</p>
        </div>
        <Link to="/">
          <Button variant="outline" className="mt-4">
            <HugeiconsIcon icon={ArrowLeftIcon} className="size-4 mr-2" />
            Back to home
          </Button>
        </Link>
      </div>
    </div>
  )
}
