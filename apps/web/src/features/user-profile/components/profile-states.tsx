import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, ArrowLeftIcon } from "@hugeicons/core-free-icons"

// Skeleton profile page - shows immediately while data loads
interface ProfileSkeletonProps {
  username: string
}

export function ProfileSkeleton({}: ProfileSkeletonProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 h-14 border-b border-border bg-background/95 backdrop-blur-xl">
        <div className="mx-auto h-full max-w-[1280px] px-4 sm:px-6 lg:px-8 flex items-center">
          <Link to="/" preload="intent">
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2 -ml-2">
              <HugeiconsIcon icon={ArrowLeftIcon} className="size-4" />
              <span className="text-sm">Back</span>
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-6">
        {/* GitHub-style 2-column layout skeleton */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Left Sidebar Skeleton */}
          <aside className="w-full lg:w-[296px] shrink-0">
            {/* Avatar Skeleton - Large circular */}
            <div className="mb-4">
              <div className="h-[296px] w-[296px] rounded-full bg-muted animate-pulse" />
            </div>

            {/* Name & Username Skeleton */}
            <div className="mb-4 space-y-2">
              <div className="h-8 w-48 bg-muted animate-pulse rounded" />
              <div className="h-5 w-32 bg-muted animate-pulse rounded" />
            </div>

            {/* Bio Skeleton */}
            <div className="mb-6 space-y-2">
              <div className="h-4 w-full bg-muted animate-pulse rounded" />
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
            </div>

            {/* Share Button Skeleton */}
            <div className="mb-6">
              <div className="h-9 w-full bg-muted animate-pulse rounded-md" />
            </div>

            {/* Social Links Skeleton */}
            <div className="mb-6 space-y-2">
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              <div className="h-4 w-36 bg-muted animate-pulse rounded" />
              <div className="h-4 w-40 bg-muted animate-pulse rounded" />
            </div>

            {/* Stats Skeleton */}
            <div className="flex items-center gap-3">
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              <div className="h-4 w-1 bg-muted animate-pulse rounded" />
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
            </div>
          </aside>

          {/* Main Content Skeleton */}
          <div className="flex-1 min-w-0">
            {/* Tabs & Search Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4">
              <div className="flex items-center gap-1">
                <div className="h-9 w-24 bg-muted animate-pulse rounded-md" />
                <div className="h-9 w-28 bg-muted animate-pulse rounded-md" />
                <div className="h-9 w-24 bg-muted animate-pulse rounded-md" />
              </div>
              <div className="h-9 w-56 bg-muted animate-pulse rounded-lg" />
            </div>

            {/* Skills Grid Skeleton */}
            <div className="grid gap-6 grid-cols-2 pb-12">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  {/* Device frame wrapper skeleton */}
                  <div className="p-1.5 md:p-2 rounded-xl md:rounded-2xl bg-muted/30">
                    {/* Thumbnail skeleton - aspect-video */}
                    <div className="aspect-video rounded-md md:rounded-lg bg-muted animate-pulse" />
                    {/* Metadata skeleton */}
                    <div className="mt-2 px-2 py-1.5 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                        <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                      </div>
                      <div className="h-4 w-10 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export function ProfileError() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
          <HugeiconsIcon icon={Cancel01Icon} className="size-8 text-destructive" />
        </div>
        <div>
          <p className="text-lg font-medium">Failed to load profile</p>
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

export function ProfileNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
          <span className="text-2xl text-muted-foreground">?</span>
        </div>
        <div>
          <p className="text-lg font-medium">Profile not found</p>
          <p className="text-sm text-muted-foreground">The user you're looking for doesn't exist</p>
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
