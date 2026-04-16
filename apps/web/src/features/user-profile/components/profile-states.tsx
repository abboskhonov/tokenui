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
        <div className="mx-auto h-full max-w-[1600px] px-6 md:px-12 lg:px-16 xl:px-20 flex items-center">
          <Link to="/" preload="intent">
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2 -ml-2">
              <HugeiconsIcon icon={ArrowLeftIcon} className="size-4" />
              <span className="text-sm">Back</span>
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-16 xl:px-20 py-4">
        {/* Profile Info Skeleton */}
        <div className="flex items-start gap-6 py-6">
          {/* Avatar Skeleton */}
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-muted animate-pulse" />
          </div>
          
          {/* Info Skeleton */}
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="h-7 w-48 bg-muted animate-pulse rounded" />
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            </div>
            
            {/* Stats Skeleton */}
            <div className="flex items-center gap-6">
              <div className="h-5 w-20 bg-muted animate-pulse rounded" />
              <div className="h-5 w-20 bg-muted animate-pulse rounded" />
              <div className="h-5 w-20 bg-muted animate-pulse rounded" />
            </div>
            
            {/* Bio Skeleton */}
            <div className="space-y-2 max-w-lg">
              <div className="h-4 w-full bg-muted animate-pulse rounded" />
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <div className="flex items-center gap-1">
            <div className="h-9 w-24 bg-muted animate-pulse rounded" />
            <div className="h-9 w-24 bg-muted animate-pulse rounded" />
            <div className="h-9 w-24 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-9 w-48 bg-muted animate-pulse rounded" />
        </div>

        {/* Skills Grid Skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[4/3] rounded-xl bg-muted animate-pulse" />
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-muted animate-pulse" />
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              </div>
            </div>
          ))}
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
