"use client";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { usePublicDesignsInfinite, useTopContributors } from "@/lib/queries/designs";
import type { Design } from "@/lib/types/design";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";

import { Navigation } from "@/components/navigation/main-navigation";
import { CLICopy } from "@/components/marketing/cli-copy";
import { DesignCard } from "@/components/marketing/design-card";
import { LoadingState, ErrorState, EmptyState } from "@/components/marketing/state-components";
import { categories as designCategories } from "@/features/marketing/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

type TabType = "all" | string;
type SortOption = "newest" | "trending" | "mostStarred" | "mostViewed" | "contributors";

interface HeroSectionProps {
  initialDesigns?: Design[];
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function HeroSection({ initialDesigns }: HeroSectionProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  
  // Debounce search query to avoid too many requests
  const debouncedSearch = useDebounce(searchQuery, 300);
  
  // Always fetch ALL designs - don't filter by category at API level
  // We need all designs to show category tabs
  const searchParam = debouncedSearch.trim() || undefined;

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePublicDesignsInfinite(undefined, searchParam);

  // Flatten all pages into single array
  const allDesigns = useMemo(() => {
    if (!data) return initialDesigns || [];
    return data.pages.flatMap((page) => page.designs);
  }, [data, initialDesigns]);

  // Debug logging
  useEffect(() => {
    console.log("Search debug:", {
      searchQuery,
      debouncedSearch,
      searchParam,
      dataPages: data?.pages?.length,
      firstPageDesigns: data?.pages?.[0]?.designs?.length,
      allDesignsCount: allDesigns.length,
      isLoading,
      error: error?.message,
    })
  }, [searchQuery, debouncedSearch, searchParam, data, allDesigns.length, isLoading, error])

  // Filter designs client-side based on selected category
  const filteredDesigns = useMemo(() => {
    let designs = activeTab === "all" ? allDesigns : allDesigns.filter(d => d.category === activeTab);
    
    // Apply sorting
    switch (sortBy) {
      case "trending":
        // Trending: combination of views and recency (using viewCount as proxy)
        designs = [...designs].sort((a, b) => b.viewCount - a.viewCount);
        break;
      case "mostStarred":
        // Most starred - using viewCount as a proxy for popularity until starCount is available
        designs = [...designs].sort((a, b) => b.viewCount - a.viewCount);
        break;
      case "mostViewed":
        designs = [...designs].sort((a, b) => b.viewCount - a.viewCount);
        break;
      case "newest":
      default:
        // Default is newest - already sorted by the API
        break;
    }
    
    return designs;
  }, [allDesigns, activeTab, sortBy]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Get count for each category
  const getCategoryCount = useCallback((cat: string) => {
    if (cat === "all") {
      return allDesigns.length;
    }
    return allDesigns.filter(d => d.category === cat).length;
  }, [allDesigns]);

  const isLoadingDesigns = isLoading && !data && !initialDesigns;

  return (
    <div className="relative min-h-screen bg-background">
      {/* Navigation at root level - before main content */}
      <Navigation />

      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-[72px]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 bg-[radial-gradient(circle_at_center,var(--brand)/6%,transparent_70%)]" style={{ willChange: "transform" }} />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        <div className="relative z-10 pt-12 md:pt-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-medium leading-[1.15] tracking-tight text-foreground md:text-5xl">
              The design layer for your coding agent
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              One command. Beautiful UI.
            </p>
            <p className="mt-3 text-base text-muted-foreground/80 max-w-xl">
              Drop-in design skills for your agent. No setup, no configuration—just describe what you need and ship production-ready components in seconds.
            </p>
          </div>

          <div className="mt-8">
            <CLICopy command="npx tokenui.sh add <skill>" />
          </div>

          <section id="skills-section" className="mt-16 md:mt-20">
            <div className="mb-6 flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Skills Leaderboard</span>
            </div>

            <div className="mb-6 flex items-center gap-4 border-b border-border pb-4">
              <div className="flex flex-1 items-center gap-3">
                <HugeiconsIcon icon={Search01Icon} className="size-5 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search all skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
              <div className="flex items-center gap-2">
                {/* Category Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger render={
                    <Button variant="ghost" size="sm" className="gap-2 h-8 text-sm text-muted-foreground hover:text-foreground">
                      <span className="capitalize">{activeTab === "all" ? "All" : activeTab}</span>
                      <span className="text-xs text-muted-foreground/70">({getCategoryCount(activeTab)})</span>
                      <HugeiconsIcon icon={ArrowRight01Icon} className="size-3 rotate-90" />
                    </Button>
                  } />
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem 
                      className="gap-2 text-sm"
                      onClick={() => setActiveTab("all")}
                    >
                      <span>All</span>
                      <span className="text-xs text-muted-foreground ml-auto">({getCategoryCount("all")})</span>
                    </DropdownMenuItem>
                    {designCategories.map((cat) => (
                      <DropdownMenuItem 
                        key={cat.name}
                        className="gap-2 text-sm"
                        onClick={() => setActiveTab(cat.name)}
                      >
                        <span>{cat.name}</span>
                        <span className="text-xs text-muted-foreground ml-auto">({getCategoryCount(cat.name)})</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <kbd className="flex h-8 w-8 items-center justify-center rounded border border-border text-sm text-muted-foreground">
                  /
                </kbd>
              </div>
            </div>

            {/* Sort Tabs (Newest, Trending, Most Starred, Most Viewed) */}
            <div className="mb-6 flex items-center gap-6 text-sm border-b border-border overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <button
                onClick={() => setSortBy("newest")}
                className={cn(
                  "flex items-center gap-2 pb-3 transition-colors whitespace-nowrap",
                  sortBy === "newest"
                    ? "border-b-2 border-foreground font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span>Newest</span>
              </button>
              <button
                onClick={() => setSortBy("trending")}
                className={cn(
                  "flex items-center gap-2 pb-3 transition-colors whitespace-nowrap",
                  sortBy === "trending"
                    ? "border-b-2 border-foreground font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span>Trending</span>
              </button>
              <button
                onClick={() => setSortBy("mostStarred")}
                className={cn(
                  "flex items-center gap-2 pb-3 transition-colors whitespace-nowrap",
                  sortBy === "mostStarred"
                    ? "border-b-2 border-foreground font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span>Most Starred</span>
              </button>
              <button
                onClick={() => setSortBy("mostViewed")}
                className={cn(
                  "flex items-center gap-2 pb-3 transition-colors whitespace-nowrap",
                  sortBy === "mostViewed"
                    ? "border-b-2 border-foreground font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span>Most Viewed</span>
              </button>
              <button
                onClick={() => setSortBy("contributors")}
                className={cn(
                  "flex items-center gap-2 pb-3 transition-colors whitespace-nowrap",
                  sortBy === "contributors"
                    ? "border-b-2 border-foreground font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span>Top Contributors</span>
              </button>
            </div>
            
            {sortBy === "contributors" ? (
              <ContributorsView />
            ) : isLoadingDesigns ? (
              <LoadingState />
            ) : error ? (
              <ErrorState />
            ) : filteredDesigns.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-12">
                  {filteredDesigns.map((design) => (
                    <DesignCard key={design.id} design={design} />
                  ))}
                </div>
                
                {/* Infinite scroll trigger - only show when "all" is selected or more items might exist */}
                {(activeTab === "all" || hasNextPage) && (
                  <div ref={loadMoreRef} className="flex justify-center py-8">
                    {isFetchingNextPage ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Loading more...
                      </div>
                    ) : hasNextPage ? (
                      <div className="text-sm text-muted-foreground">Scroll for more</div>
                    ) : (
                      <div className="text-sm text-muted-foreground">No more skills</div>
                    )}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

// Contributors View Component
function ContributorsView() {
  const { data: contributors, isLoading } = useTopContributors(12)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!contributors || contributors.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-muted-foreground">No contributors yet</p>
        <p className="text-xs text-muted-foreground mt-1">Be the first to publish a skill!</p>
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 pb-12">
      {contributors.map((contributor) => (
        <ContributorCard key={contributor.userId} contributor={contributor} />
      ))}
    </div>
  )
}

// Single Contributor Card - minimal design
interface ContributorCardProps {
  contributor: {
    userId: string
    name: string | null
    username: string
    image: string | null
    skillCount: number
    totalStars: number
  }
}

function ContributorCard({ contributor }: ContributorCardProps) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate({ to: "/u/$username", params: { username: contributor.username } })}
      className="group flex items-center gap-3 p-3 rounded-xl bg-card ring-1 ring-foreground/10 hover:ring-foreground/20 transition-all cursor-pointer"
    >
      {/* Avatar */}
      <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden ring-1 ring-foreground/10">
        {contributor.image ? (
          <img
            src={contributor.image}
            alt={contributor.name || contributor.username}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
            {(contributor.name || contributor.username).charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      
      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
          {contributor.name || contributor.username}
        </p>
        <p className="text-xs text-muted-foreground truncate">@{contributor.username}</p>
      </div>
      
      {/* Stats */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <svg className="size-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          {contributor.totalStars}
        </span>
        <span className="flex items-center gap-1">
          <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M9 9h6v6H9z"/>
          </svg>
          {contributor.skillCount}
        </span>
      </div>
    </div>
  )
}
