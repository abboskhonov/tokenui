"use client";

import { useState, useCallback, memo, useRef, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SkillCard } from "@/components/marketing/skill-card";
import { usePublicDesigns } from "@/lib/queries/designs";
import { useUser } from "@/lib/user-context";
import { signOut } from "@/lib/auth-client";
import { SettingsDialog } from "@/components/settings/settings-dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "@/components/theme-provider";
import type { Design } from "@/lib/types/design";
import {
  CommandLineIcon,
  Copy01Icon,
  Layers01Icon,
  Logout01Icon,
  Moon01Icon,
  Search01Icon,
  Settings01Icon,
  Sun01Icon,
  Tick02Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";

// Theme Toggle Component - memoized
const ThemeToggle = memo(function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleTheme}>
      <HugeiconsIcon
        icon={theme === "dark" ? Sun01Icon : Moon01Icon}
        className="size-4"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
});

// User Menu Component - memoized, now uses SSR data
const UserMenu = memo(function UserMenu() {
  // Use SSR user data from context instead of client-side hook
  const { user } = useUser();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();

  // Handle sign out with useCallback to prevent recreating function
  const handleSignOut = useCallback(async () => {
    await signOut();
    window.location.reload();
  }, []);

  const handleProfileClick = useCallback(() => {
    const username = user?.username || user?.email?.split("@")[0] || "user";
    navigate({ to: "/u/$username", params: { username } });
  }, [user, navigate]);

  if (!user) {
    return (
      <Link to="/login">
        <Button
          variant="ghost"
          className="h-8 px-3 gap-2 text-xs font-medium hover:bg-muted/50"
        >
          <HugeiconsIcon icon={UserIcon} className="size-4" />
          <span className="hidden sm:inline">Login</span>
        </Button>
      </Link>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className="h-8 w-8 rounded-full p-0 hover:bg-muted/50"
            >
              <Avatar className="h-7 w-7">
                <AvatarImage
                  src={user.image || ""}
                  alt={user.name || "User"}
                />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem 
            className="gap-2 text-sm cursor-pointer"
            onClick={handleProfileClick}
          >
            <HugeiconsIcon icon={UserIcon} className="size-4" />
            Profile
          </DropdownMenuItem>
          <Link to="/studio">
            <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
              <HugeiconsIcon icon={Layers01Icon} className="size-4" />
              Studio
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            className="gap-2 text-sm"
            onClick={() => setSettingsOpen(true)}
          >
            <HugeiconsIcon icon={Settings01Icon} className="size-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2 text-sm text-destructive"
            onClick={handleSignOut}
          >
            <HugeiconsIcon icon={Logout01Icon} className="size-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
});

// CLI Copy Component - memoized
const CLICopy = memo(function CLICopy() {
  const [copied, setCopied] = useState(false);

  // Memoize handler to prevent recreating on each render
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText("npx tokenui add <skill>");
      setCopied(true);
      // Use setTimeout with cleanup pattern
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, []);

  return (
    <button
      onClick={handleCopy}
      className="group inline-flex items-center gap-2.5 rounded-lg border border-border bg-muted/50 px-4 py-2.5 font-mono text-sm text-muted-foreground transition-all hover:border-foreground/30 hover:bg-muted hover:text-foreground"
    >
      <span className="text-muted-foreground/60">$</span>
      <span>npx tokenui add &lt;skill&gt;</span>
      <HugeiconsIcon
        icon={copied ? Tick02Icon : Copy01Icon}
        className={cn("ml-1 size-4", copied && "text-green-500")}
      />
    </button>
  );
});

// Design Card Component - extracted and memoized for performance
interface DesignCardProps {
  design: Design;
}

const DesignCard = memo(function DesignCard({ design }: DesignCardProps) {
  return (
    <Link to="/s/$username/$designSlug" params={{ 
      username: design.author?.username || "unknown", 
      designSlug: design.slug 
    }}>
      <article className="group relative cursor-pointer">
        {/* Thumbnail Container - moves up on hover */}
        <div className="relative aspect-video overflow-hidden rounded-xl bg-muted ring-1 ring-border/50 transition-all duration-300 ease-out group-hover:-translate-y-3 group-hover:ring-border/80">
          {design.thumbnailUrl ? (
            <img
              src={design.thumbnailUrl}
              alt={design.name}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <SkillCard variant="pattern" />
          )}
        </div>
        
        {/* Metadata - appears below the card on hover */}
        <div className="absolute -bottom-3 left-0 right-0 flex items-center justify-between px-1 pt-2 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
          <Link to="/u/$username" params={{ username: design.author?.username || "unknown" }} className="flex items-center gap-2 min-w-0">
            <div className="relative h-5 w-5 shrink-0">
              {design.author?.image ? (
                <img
                  src={design.author.image}
                  alt=""
                  className="h-full w-full rounded-full object-cover ring-1 ring-border/50"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground ring-1 ring-border/50">
                  {(design.author?.name || design.name).charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h3 className="text-xs font-medium text-foreground tracking-tight truncate hover:text-primary transition-colors">
              {design.name}
            </h3>
          </Link>
          <span className="text-[10px] font-medium text-muted-foreground/70 tabular-nums shrink-0">
            {design.viewCount.toLocaleString()}
          </span>
        </div>
      </article>
    </Link>
  );
});

// Navigation Component - extracted and memoized
const Navigation = memo(function Navigation() {
  return (
    <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
      <Link to="/" className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background">
          <HugeiconsIcon icon={CommandLineIcon} className="size-4" />
        </div>
        <span className="text-lg font-semibold tracking-tight text-foreground">
          tokenui
        </span>
      </Link>
      <div className="flex items-center gap-4">
        <Link
          to="/docs"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Docs
        </Link>
        <Link
          to="/publish"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Publish
        </Link>
        <ThemeToggle />
        <UserMenu />
      </div>
    </nav>
  );
});

// Empty State Component
const EmptyState = memo(function EmptyState() {
  return (
    <div className="py-12 text-center">
      <p className="text-sm text-muted-foreground">No skills published yet</p>
    </div>
  );
});

// Loading State Component
const LoadingState = memo(function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
    </div>
  );
});

// Error State Component
const ErrorState = memo(function ErrorState() {
  return (
    <div className="py-12 text-center">
      <p className="text-sm text-destructive">Failed to load skills</p>
    </div>
  );
});

// Main Hero Section
interface HeroSectionProps {
  initialDesigns?: Design[]
}

export function HeroSection({ initialDesigns }: HeroSectionProps) {
  // Use initial designs from SSR if available, otherwise fetch client-side
  const { data: designs, isLoading, error } = usePublicDesigns();
  
  // Use SSR data if available, otherwise fall back to client-fetched data
  const displayDesigns = initialDesigns || designs;
  const isLoadingDesigns = !initialDesigns && isLoading;
  
  // Search input ref for keyboard shortcut
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle "/" key to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search when "/" is pressed, but not when typing in an input
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
      {/* Optimized background - using CSS instead of heavy blur */}
      <div className="pointer-events-none absolute inset-0">
        <div 
          className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 bg-[radial-gradient(circle_at_center,var(--brand)/6%,transparent_70%)]"
          style={{ willChange: "transform" }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-12 md:pt-16">
        {/* Header */}
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

        {/* CLI - Subtle bottom command */}
        <div className="mt-8">
          <CLICopy />
        </div>

        {/* Design Grid */}
        <div className="mt-16 md:mt-20">
          {/* Section Title */}
          <div className="mb-6 flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Skills Leaderboard</span>
          </div>

          {/* Search Bar */}
          <div className="mb-6 flex items-center gap-4 border-b border-border pb-4">
            <div className="flex flex-1 items-center gap-3">
              <HugeiconsIcon icon={Search01Icon} className="size-5 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search skills..."
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded border border-border text-sm text-muted-foreground">
              /
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6 flex items-center gap-6 text-sm">
            <button className="border-b-2 border-foreground pb-2 font-medium text-foreground">
              All Time <span className="ml-1 text-muted-foreground">({displayDesigns?.length || 0})</span>
            </button>
            <button className="pb-2 text-muted-foreground transition-colors hover:text-foreground">
              Trending (24h)
            </button>
            <button className="pb-2 text-muted-foreground transition-colors hover:text-foreground">
              Hot
            </button>
          </div>

          {isLoadingDesigns ? (
            <LoadingState />
          ) : error && !initialDesigns ? (
            <ErrorState />
          ) : displayDesigns && displayDesigns.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-12">
              {displayDesigns.map((design) => (
              <DesignCard
                key={design.id}
                design={design}
              />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </main>
  );
}
