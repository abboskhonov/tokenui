"use client";

import { useState, useCallback, memo, useEffect } from "react";
import { Link } from "@tanstack/react-router";
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
import { useSession, signOut } from "@/lib/auth-client";
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

// FadeIn - memoized to prevent unnecessary re-renders
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const FadeIn = memo(function FadeIn({ children, delay = 0, className }: FadeInProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Small delay to ensure animation plays after mount
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div
      className={cn(
        "transition-opacity duration-500",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
      style={{ 
        transitionDelay: `${delay}s`,
        willChange: "opacity, transform"
      }}
    >
      {children}
    </div>
  );
});

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

// User Menu Component - memoized
const UserMenu = memo(function UserMenu() {
  const { data: session, isPending } = useSession();
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Handle sign out with useCallback to prevent recreating function
  const handleSignOut = useCallback(async () => {
    await signOut();
    window.location.reload();
  }, []);

  if (isPending) {
    // Show neutral state - looks like login button but inactive
    return (
      <Button variant="ghost" className="h-8 px-3 gap-2 text-xs font-medium" disabled>
        <HugeiconsIcon icon={UserIcon} className="size-4" />
        <span className="hidden sm:inline">Login</span>
      </Button>
    );
  }

  if (!session?.user) {
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
                  src={session.user.image || ""}
                  alt={session.user.name || "User"}
                />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {session.user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem className="gap-2 text-sm">
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
  index: number;
}

const DesignCard = memo(function DesignCard({ design, index }: DesignCardProps) {
  const delay = Math.min(0.1 + index * 0.05, 0.5);

  return (
    <FadeIn delay={delay}>
      <Link to="/s/$username/$designSlug" params={{ 
        username: design.author?.username || "unknown", 
        designSlug: design.slug 
      }}>
        <article className="group relative cursor-pointer">
          {/* Thumbnail Container */}
          <div className="relative aspect-video overflow-hidden rounded-xl bg-muted ring-1 ring-border/50 transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:shadow-lg group-hover:shadow-foreground/5 group-hover:ring-border/80">
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
          
          {/* Metadata - appears below card on hover */}
          <div className="absolute -bottom-10 left-0 right-0 flex items-center justify-between px-1 pt-3 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100">
            <div className="flex items-center gap-2">
              <div className="relative h-5 w-5">
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
              <h3 className="text-sm font-medium text-foreground tracking-tight">
                {design.name}
              </h3>
            </div>
            <span className="text-xs font-medium text-muted-foreground/70 tabular-nums">
              {design.viewCount.toLocaleString()} views
            </span>
          </div>
        </article>
      </Link>
    </FadeIn>
  );
});

// Navigation Component - extracted and memoized
const Navigation = memo(function Navigation() {
  return (
    <FadeIn>
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
    </FadeIn>
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
export function HeroSection() {
  const { data: designs, isLoading, error } = usePublicDesigns();

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
          <FadeIn delay={0.1}>
            <h1 className="text-4xl font-medium leading-tight tracking-tight text-foreground md:text-5xl">
              The design layer
              <br />
              <span className="text-muted-foreground">for your coding agent</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-4 text-lg text-muted-foreground">
              A CLI tool that applies a consistent, beautiful design layer on top of AI-generated code.
            </p>
          </FadeIn>
        </div>

        {/* CLI - Subtle bottom command */}
        <FadeIn delay={0.3}>
          <div className="mt-8">
            <CLICopy />
          </div>
        </FadeIn>

        {/* Design Grid */}
        <div className="mt-16 md:mt-20">
          {/* Section Title */}
          <FadeIn delay={0.35}>
            <div className="mb-6 flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Skills Leaderboard</span>
            </div>
          </FadeIn>

          {/* Search Bar */}
          <FadeIn delay={0.4}>
            <div className="mb-6 flex items-center gap-4 border-b border-border pb-4">
              <div className="flex flex-1 items-center gap-3">
                <HugeiconsIcon icon={Search01Icon} className="size-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search skills..."
                  className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded border border-border text-sm text-muted-foreground">
                /
              </div>
            </div>
          </FadeIn>

          {/* Filter Tabs */}
          <FadeIn delay={0.45}>
            <div className="mb-6 flex items-center gap-6 text-sm">
              <button className="border-b-2 border-foreground pb-2 font-medium text-foreground">
                All Time <span className="ml-1 text-muted-foreground">({designs?.length || 0})</span>
              </button>
              <button className="pb-2 text-muted-foreground transition-colors hover:text-foreground">
                Trending (24h)
              </button>
              <button className="pb-2 text-muted-foreground transition-colors hover:text-foreground">
                Hot
              </button>
            </div>
          </FadeIn>

          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState />
          ) : designs && designs.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-12">
              {designs.map((design, index) => (
              <DesignCard
                key={design.id}
                design={design}
                index={index}
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
