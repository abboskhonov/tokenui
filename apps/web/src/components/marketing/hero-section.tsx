"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Search01Icon, 
  Layers01Icon, 
  ComponentIcon,
  TextIcon,
  ColorsIcon,
  RulerIcon,
  LayoutGridIcon,
  Mouse02Icon,
} from "@hugeicons/core-free-icons";
import { usePublicDesigns } from "@/lib/queries/designs";
import type { Design } from "@/lib/types/design";
import { cn } from "@/lib/utils";

// Components
import { Navigation } from "@/components/navigation/main-navigation";
import { CLICopy } from "@/components/marketing/cli-copy";
import { DesignCard } from "@/components/marketing/design-card";
import { LoadingState, ErrorState, EmptyState } from "@/components/marketing/state-components";

type CategoryTab = "all" | string;

// Category definitions with icons
const CATEGORIES = [
  { id: "all", label: "All", icon: Layers01Icon },
  { id: "layout", label: "Layout", icon: LayoutGridIcon },
  { id: "component", label: "Components", icon: ComponentIcon },
  { id: "typography", label: "Typography", icon: TextIcon },
  { id: "color", label: "Colors", icon: ColorsIcon },
  { id: "spacing", label: "Spacing", icon: RulerIcon },
  { id: "interaction", label: "Interaction", icon: Mouse02Icon },
];

interface HeroSectionProps {
  initialDesigns?: Design[];
}

/**
 * HeroSection - Main landing page section
 * Composed of smaller, reusable components following SOLID principles
 */
export function HeroSection({ initialDesigns }: HeroSectionProps) {
  const { data: designs, isLoading, error } = usePublicDesigns();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const displayDesigns = initialDesigns || designs;
  const isLoadingDesigns = !initialDesigns && isLoading;

  // Filter designs based on category and search
  const filteredDesigns = useMemo(() => {
    if (!displayDesigns) return [];
    
    let filtered = displayDesigns;
    
    // Apply category filter
    if (activeCategory !== "all") {
      filtered = filtered.filter(d => 
        d.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [displayDesigns, activeCategory, searchQuery]);

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: displayDesigns?.length || 0 };
    
    CATEGORIES.forEach(cat => {
      if (cat.id !== "all") {
        counts[cat.id] = displayDesigns?.filter(d => 
          d.category.toLowerCase() === cat.id.toLowerCase()
        ).length || 0;
      }
    });
    
    return counts;
  }, [displayDesigns]);

  // Keyboard shortcut: "/" to focus search
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

  return (
    <main className="relative min-h-screen bg-background">
      {/* Background gradient */}
      <BackgroundGradient />

      {/* Navigation */}
      <Navigation />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-12 md:pt-16">
        {/* Header */}
        <HeroHeader />

        {/* CLI Command */}
        <div className="mt-8">
          <CLICopy command="npx tokenui add <skill>" />
        </div>

        {/* Design Grid Section */}
        <section className="mt-16 md:mt-20">
          <SectionTitle />
          <SearchBar 
            inputRef={searchInputRef} 
            value={searchQuery}
            onChange={setSearchQuery}
          />
          <CategoryTabs 
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            counts={categoryCounts}
          />
          
          {/* Content */}
          <DesignGrid 
            designs={filteredDesigns} 
            isLoading={isLoadingDesigns} 
            error={error} 
          />
        </section>
      </div>
    </main>
  );
}

/**
 * BackgroundGradient - Optimized background effect
 */
function BackgroundGradient() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div 
        className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 bg-[radial-gradient(circle_at_center,var(--brand)/6%,transparent_70%)]"
        style={{ willChange: "transform" }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  );
}

/**
 * HeroHeader - Main headline and subtitle
 */
function HeroHeader() {
  return (
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
  );
}

/**
 * SectionTitle - Grid section header
 */
function SectionTitle() {
  return (
    <div className="mb-6 flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Skills Leaderboard</span>
    </div>
  );
}

/**
 * SearchBar - Search input with keyboard shortcut indicator
 */
interface SearchBarProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (value: string) => void;
}

function SearchBar({ inputRef, value, onChange }: SearchBarProps) {
  return (
    <div className="mb-6 flex items-center gap-4 border-b border-border pb-4">
      <div className="flex flex-1 items-center gap-3">
        <HugeiconsIcon icon={Search01Icon} className="size-5 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search skills..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>
      <kbd className="flex h-8 w-8 items-center justify-center rounded border border-border text-sm text-muted-foreground">
        /
      </kbd>
    </div>
  );
}

/**
 * CategoryTabs - Horizontal scrollable category tabs
 */
interface CategoryTabsProps {
  activeCategory: CategoryTab;
  onCategoryChange: (category: CategoryTab) => void;
  counts: Record<string, number>;
}

function CategoryTabs({ activeCategory, onCategoryChange, counts }: CategoryTabsProps) {
  return (
    <div className="mb-6 flex items-center gap-1 overflow-x-auto pb-2 scrollbar-hide">
      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap",
            activeCategory === category.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          <HugeiconsIcon icon={category.icon} className="size-4" />
          <span>{category.label}</span>
          <span className={cn(
            "ml-0.5 text-xs",
            activeCategory === category.id 
              ? "text-primary-foreground/80" 
              : "text-muted-foreground/60"
          )}>
            ({counts[category.id] || 0})
          </span>
        </button>
      ))}
    </div>
  );
}

/**
 * DesignGrid - Grid of design cards with state handling
 */
interface DesignGridProps {
  designs: Design[];
  isLoading: boolean;
  error: Error | null;
}

function DesignGrid({ designs, isLoading, error }: DesignGridProps) {
  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  if (designs.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-12">
      {designs.map((design) => (
        <DesignCard key={design.id} design={design} />
      ))}
    </div>
  );
}