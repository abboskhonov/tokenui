"use client";

import { useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
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
import {
  CommandLineIcon,
  Copy01Icon,
  Logout01Icon,
  Moon01Icon,
  Search01Icon,
  Settings01Icon,
  Sun01Icon,
  Tick02Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";

function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

// Theme Toggle Component
function ThemeToggle() {
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
}

function UserMenu() {
  const { data: session, isPending } = useSession();
  const [settingsOpen, setSettingsOpen] = useState(false);

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
            onClick={async () => {
              await signOut();
              window.location.reload();
            }}
          >
            <HugeiconsIcon icon={Logout01Icon} className="size-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}

// CLI Copy Component
function CLICopy() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("npx tokenui add <design>");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="group flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-2.5 font-mono text-sm text-foreground ring-1 ring-border transition-all hover:bg-muted hover:ring-foreground/20"
    >
      <span className="text-muted-foreground">$</span>
      <span>npx tokenui </span>
      <span className="ml-2 flex items-center gap-1.5 text-xs text-muted-foreground transition-colors group-hover:text-foreground">
        <HugeiconsIcon
          icon={copied ? Tick02Icon : Copy01Icon}
          className={cn("size-3.5", copied && "text-green-500")}
        />
      </span>
    </button>
  );
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: designs, isLoading, error } = usePublicDesigns();
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDesignClick = (designId: string) => {
    setSelectedDesignId(designId);
    setDialogOpen(true);
  };

  return (
    <main ref={containerRef} className="relative min-h-screen bg-background">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[800px] w-[1000px] -translate-x-1/2 bg-[radial-gradient(circle_at_center,var(--brand)/8%,transparent_70%)] blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Navigation */}
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

      {/* Hero Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-12 md:pt-16">
        {/* Header */}
        <div className="max-w-2xl">
          <FadeIn delay={0.1}>
            <h1 className="text-4xl font-medium leading-tight tracking-tight text-foreground md:text-5xl">
              Browse & install components
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-4 text-lg text-muted-foreground">
              Discover beautiful, production-ready designs for your next project.
            </p>
          </FadeIn>
        </div>

        {/* Search + CLI */}
        <FadeIn delay={0.3}>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="relative w-full max-w-md">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <HugeiconsIcon icon={Search01Icon} className="size-4" />
              </div>
              <input
                type="text"
                placeholder="Search designs..."
                className="w-full rounded-lg bg-muted/50 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground ring-1 ring-border outline-none transition-all focus:bg-muted focus:ring-foreground/20"
              />
            </div>
            <CLICopy />
          </div>
        </FadeIn>

        {/* Design Grid */}
        <div className="mt-12 md:mt-16">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <p className="text-sm text-destructive">Failed to load designs</p>
            </div>
          ) : designs && designs.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {designs.map((design, index) => (
                <FadeIn key={design.id} delay={0.1 + index * 0.05}>
                  <div
                    onClick={() => handleDesignClick(design.id)}
                    className="group cursor-pointer"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden rounded-xl bg-card/50 ring-1 ring-border transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-foreground/10">
                      {design.thumbnailUrl ? (
                        <img
                          src={design.thumbnailUrl}
                          alt={design.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <SkillCard variant="pattern" />
                      )}
                    </div>
                    
                    {/* Info below image - hidden by default, shows on hover */}
                    <div className="mt-3 flex items-center gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
                      {design.author?.image ? (
                        <img
                          src={design.author.image}
                          alt={design.author.name || "Author"}
                          className="h-5 w-5 rounded-full object-cover"
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
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">No designs published yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Design Detail Dialog */}
      <DesignDetailDialog
        designId={selectedDesignId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </main>
  );
}
