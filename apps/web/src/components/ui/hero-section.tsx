"use client";

import { useState, useCallback, memo } from "react";
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
import { DesignDetailDialog } from "@/components/marketing/design-detail-dialog";
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
  // Use CSS custom property for delay to avoid inline style object recreation
  return (
    <div
      className={cn("animate-fade-in opacity-0", className)}
      style={{ 
        animationDelay: `${delay}s`,
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
    return (
      <Button variant="ghost" className="h-8 px-2" disabled>
        <span className="text-xs text-muted-foreground">Loading...</span>
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
  onClick: (designId: string) => void;
}

const DesignCard = memo(function DesignCard({ design, index, onClick }: DesignCardProps) {
  // Memoize click handler to prevent recreating on each render
  const handleClick = useCallback(() => {
    onClick(design.id);
  }, [design.id, onClick]);

  // Calculate delay once per card
  const delay = Math.min(0.1 + index * 0.05, 0.5);

  return (
    <FadeIn delay={delay}>
      <div onClick={handleClick} className="group cursor-pointer">
        {/* Thumbnail - hardware accelerated */}
        <div 
          className="relative aspect-video overflow-hidden rounded-xl bg-card/50 ring-1 ring-border transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-foreground/10"
          style={{ willChange: "transform" }}
        >
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
        
        {/* Info below image - hidden by default, shows on hover */}
        <div className="mt-3 flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {design.author?.image ? (
            <img
              src={design.author.image}
              alt={design.author.name || "Author"}
              className="h-5 w-5 rounded-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
              {(design.author?.name || design.name).charAt(0).toUpperCase()}
            </div>
          )}
          <h3 className="text-sm font-medium text-foreground">
            {design.name}
          </h3>
        </div>
      </div>
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
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Memoize event handler to prevent recreating on each render
  const handleDesignClick = useCallback((designId: string) => {
    setSelectedDesignId(designId);
    setDialogOpen(true);
  }, []);

  // Memoize dialog close handler
  const handleDialogClose = useCallback((open: boolean) => {
    setDialogOpen(open);
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
        <div className="mt-12 md:mt-16">
          {/* Search */}
          <div className="mb-4 flex items-center justify-between">
            <div className="relative w-64">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <HugeiconsIcon icon={Search01Icon} className="size-4" />
              </div>
              <input
                type="text"
                placeholder="Search skills..."
                className="h-9 w-full rounded-lg bg-muted/50 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground ring-1 ring-border outline-none transition-all focus:bg-muted focus:ring-foreground/20"
              />
            </div>
          </div>

          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState />
          ) : designs && designs.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {designs.map((design, index) => (
                <DesignCard
                  key={design.id}
                  design={design}
                  index={index}
                  onClick={handleDesignClick}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      {/* Design Detail Dialog */}
      <DesignDetailDialog
        designId={selectedDesignId}
        open={dialogOpen}
        onOpenChange={handleDialogClose}
      />
    </main>
  );
}
