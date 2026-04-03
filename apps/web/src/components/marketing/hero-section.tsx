"use client";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { usePublicDesignsInfinite } from "@/lib/queries/designs";
import type { Design } from "@/lib/types/design";
import { cn } from "@/lib/utils";

import { Navigation } from "@/components/navigation/main-navigation";
import { CLICopy } from "@/components/marketing/cli-copy";
import { DesignCard } from "@/components/marketing/design-card";
import { LoadingState, ErrorState, EmptyState } from "@/components/marketing/state-components";

type TabType = "all" | string;

interface HeroSectionProps {
  initialDesigns?: Design[];
  initialCategories?: string[];
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

export function HeroSection({ initialDesigns, initialCategories }: HeroSectionProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
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

  // Get unique categories from ALL designs (not filtered)
  const categories = useMemo(() => {
    const cats = new Set<string>();
    
    // Add from initial categories if provided
    if (initialCategories) {
      initialCategories.forEach(c => cats.add(c));
    }
    
    // Add from all fetched designs
    allDesigns.forEach((d) => {
      if (d.category) cats.add(d.category);
    });
    
    return Array.from(cats).sort();
  }, [allDesigns, initialCategories]);

  // Filter designs client-side based on selected category
  const filteredDesigns = useMemo(() => {
    if (activeTab === "all") return allDesigns;
    return allDesigns.filter(d => d.category === activeTab);
  }, [allDesigns, activeTab]);

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
    <main className="relative min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 bg-[radial-gradient(circle_at_center,var(--brand)/6%,transparent_70%)]" style={{ willChange: "transform" }} />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <Navigation />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-12 md:pt-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-medium leading-tight tracking-tight text-foreground md:text-5xl">
            The design layer
            <br />
            <span className="text-muted-foreground">for your coding agent</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A CLI tool that applies a consistent, beautiful design layer on top of AI-generated code.
          </p>
        </div>

        <div className="mt-8">
          <CLICopy command="npx tokenui add <skill>" />
        </div>

        <section className="mt-16 md:mt-20">
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
            <kbd className="flex h-8 w-8 items-center justify-center rounded border border-border text-sm text-muted-foreground">
              /
            </kbd>
          </div>

          {/* Category Tabs */}
          <div className="mb-6 flex items-center gap-6 text-sm border-b border-border overflow-x-auto custom-scrollbar">
            <button
              onClick={() => setActiveTab("all")}
              className={cn(
                "flex items-center gap-2 pb-3 transition-colors whitespace-nowrap",
                activeTab === "all"
                  ? "border-b-2 border-foreground font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span>All</span>
              <span className={cn("text-xs text-muted-foreground", activeTab !== "all" && "opacity-50")}>
                ({getCategoryCount("all")})
              </span>
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={cn(
                  "flex items-center gap-2 pb-3 transition-colors whitespace-nowrap capitalize",
                  activeTab === category
                    ? "border-b-2 border-foreground font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span>{category}</span>
                <span className={cn("text-xs text-muted-foreground", activeTab !== category && "opacity-50")}>
                  ({getCategoryCount(category)})
                </span>
              </button>
            ))}
          </div>
          
          {isLoadingDesigns ? (
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
  );
}
