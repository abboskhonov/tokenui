"use client"

import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  Cancel01Icon, 
  ArrowLeft01Icon,
  ArrowLeftIcon,
  Folder01Icon,
  Moon02Icon,
  File01Icon 
} from "@hugeicons/core-free-icons"

interface SkillDetailSkeletonProps {
  username: string
  designSlug: string
  thumbnailUrl?: string | null
  name?: string
}

// Skeleton for CodeView while files are loading
export function CodeViewSkeleton() {
  return (
    <div className="h-full flex bg-background">
      {/* File Tree Sidebar Skeleton */}
      <div className="w-64 border-r border-border bg-muted/30 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-3 border-b border-border bg-muted/50 flex items-center justify-between shrink-0">
          <div className="h-4 w-16 bg-muted animate-pulse rounded" />
        </div>
        {/* File tree items */}
        <div className="p-2 space-y-1">
          <div className="h-8 w-full bg-muted animate-pulse rounded" />
          <div className="h-8 w-full bg-muted animate-pulse rounded" />
          <div className="h-8 w-full bg-muted animate-pulse rounded" />
          <div className="h-8 w-3/4 bg-muted animate-pulse rounded ml-4" />
          <div className="h-8 w-3/4 bg-muted animate-pulse rounded ml-4" />
        </div>
      </div>

      {/* Code Editor Skeleton */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* File path header */}
        <div className="p-3 border-b border-border bg-muted/50 flex items-center shrink-0">
          <div className="h-4 w-48 bg-muted animate-pulse rounded" />
        </div>
        
        {/* Code content lines */}
        <div className="flex-1 overflow-auto bg-background p-4 space-y-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i} 
              className="h-4 bg-muted animate-pulse rounded" 
              style={{ width: `${Math.random() * 40 + 60}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function SkillDetailSkeleton({ username, designSlug, thumbnailUrl, name }: SkillDetailSkeletonProps) {
  // Format design name from slug if not provided
  const displayName = name || designSlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header - Matches SkillDetailHeader layout exactly */}
      <header className="sticky top-0 z-50 h-12 border-b border-border bg-background/95 backdrop-blur-xl">
        <div className="mx-auto h-full max-w-full px-3 sm:px-4 flex items-center justify-between">
          {/* Left: Back button + Menu placeholder */}
          <div className="flex items-center gap-1">
            <Link to="/" preload="intent">
              <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2 -ml-1">
                <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
                <span className="text-sm hidden sm:inline">Back</span>
              </Button>
            </Link>
            {/* Mobile menu button placeholder */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 lg:hidden"
              disabled
            >
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </Button>
          </div>

          {/* Center: Breadcrumb - matches actual header exactly */}
          <div className="flex items-center gap-1 sm:gap-2 text-sm absolute left-1/2 -translate-x-1/2 max-w-[50%] sm:max-w-none">
            <span className="text-muted-foreground truncate max-w-[80px] sm:max-w-[120px]">{username}</span>
            <span className="text-muted-foreground/50 shrink-0">/</span>
            <span className="font-medium truncate max-w-[100px] sm:max-w-[150px] md:max-w-[200px]">{displayName}</span>
          </div>

          {/* Right: Action buttons (skeleton version) */}
          <div className="flex items-center gap-1">
            {/* Toggle files button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs gap-1.5 px-2"
              disabled
            >
              <HugeiconsIcon icon={Folder01Icon} className="size-3.5" />
              <span className="hidden sm:inline bg-muted animate-pulse rounded w-12 h-3 inline-block" />
            </Button>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 hidden sm:flex"
              disabled
            >
              <HugeiconsIcon icon={Moon02Icon} className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-48px)]">
        {/* Left Sidebar Skeleton */}
        <aside className="hidden lg:block w-[320px] lg:h-full border-r border-border bg-card/30">
          <div className="p-6 space-y-6">
            {/* Title - Show actual name if available */}
            <div className="space-y-2">
              <h1 className="text-lg font-semibold">{displayName}</h1>
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

        {/* Main Preview - Show thumbnail as placeholder while loading */}
        <main className="flex-1 min-h-0 h-full bg-muted/30 flex items-center justify-center relative overflow-hidden">
          {thumbnailUrl ? (
            <>
              {/* Blurred thumbnail as background placeholder */}
              <img 
                src={thumbnailUrl} 
                alt=""
                className="absolute inset-0 w-full h-full object-cover blur-sm opacity-50 scale-105"
              />
              {/* Loading spinner overlay */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span className="text-sm text-muted-foreground">Loading preview...</span>
              </div>
            </>
          ) : (
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          )}
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
