"use client";

import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
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
import {
  CommandLineIcon,
  Logout01Icon,
  Settings01Icon,
  UserIcon,
  Sun01Icon,
  Moon01Icon,
  Copy01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";

type PackageManager = "npx" | "yarn" | "pnpm" | "bun";

const commands: Record<PackageManager, string> = {
  npx: "npx tokenui add <design>",
  yarn: "yarn tokenui add <design>",
  pnpm: "pnpm tokenui add <design>",
  bun: "bun tokenui add <design>",
};

function TimelineContent({
  children,
  animationNum = 0,
  className,
}: {
  children: React.ReactNode;
  animationNum?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        delay: animationNum * 0.08,
        duration: 0.35,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

// Theme Toggle Component
function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark")

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
  }, [theme])

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <HugeiconsIcon
        icon={theme === "dark" ? Sun01Icon : Moon01Icon}
        className="size-4"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

// Install Command Component
function InstallCommand() {
  const [activeTab, setActiveTab] = useState<PackageManager>("npx")
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(commands[activeTab])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="space-y-2">
      {/* Tabs */}
      <div className="flex items-center gap-1">
        {(Object.keys(commands) as PackageManager[]).map((pm) => (
          <button
            key={pm}
            onClick={() => setActiveTab(pm)}
            className={`px-3 py-1.5 font-mono text-xs rounded transition-colors ${
              activeTab === pm
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {pm}
          </button>
        ))}
      </div>

      {/* Terminal Block */}
      <div className="relative bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 font-mono text-sm">
          <span className="text-muted-foreground">&gt;</span>
          <span className="text-foreground">{commands[activeTab]}</span>
        </div>
        <button
          onClick={handleCopy}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <HugeiconsIcon
            icon={copied ? Tick02Icon : Copy01Icon}
            className={`size-4 ${copied ? "text-green-500" : ""}`}
          />
        </button>
      </div>
    </div>
  )
}

function UserMenu() {
  const { data: session, isPending } = useSession()
  const [settingsOpen, setSettingsOpen] = useState(false)

  if (isPending) {
    return (
      <Button variant="ghost" className="h-8 px-2" disabled>
        <span className="text-xs text-muted-foreground">Loading...</span>
      </Button>
    )
  }

  if (!session?.user) {
    return (
      <Link to="/login">
        <Button
          variant="ghost"
          className="h-8 px-3 gap-2 text-xs font-medium hover:bg-muted/20"
        >
          <HugeiconsIcon icon={UserIcon} className="size-4" />
          <span className="hidden sm:inline">Login</span>
        </Button>
      </Link>
    )
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className="h-8 px-2 gap-2 justify-start hover:bg-muted/20"
            >
              <Avatar className="h-7 w-7 rounded-full">
                <AvatarImage
                  src={session.user.image || ""}
                  alt={session.user.name || "User"}
                />
                <AvatarFallback className="bg-primary/20 text-primary text-xs rounded-full">
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
              await signOut()
              window.location.reload()
            }}
          >
            <HugeiconsIcon icon={Logout01Icon} className="size-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  )
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
    <main ref={containerRef} className="relative">
      {/* Content with bordered container */}
      <div className="relative mx-auto max-w-7xl min-h-screen">
        {/* Main bordered wrapper */}
        <div className="relative border-x border-border min-h-screen">
          {/* Vertical dashed center line */}
          <div className="absolute top-0 bottom-0 left-1/2 border-l border-dashed border-border/50 -translate-x-1/2" />
          
          {/* Header - Bordered style matching hero */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8 border-b border-border"
          >
            {/* Left: Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-foreground text-background">
                <HugeiconsIcon icon={CommandLineIcon} className="size-4" />
              </div>
              <span className="text-base font-semibold text-foreground tracking-tight">
                tasteui
              </span>
            </Link>

            {/* Right: Actions */}
            <div className="flex items-center gap-1">
              <Link 
                to="/docs" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors mr-2"
              >
                Docs
              </Link>
              <ThemeToggle />
              <UserMenu />
            </div>
          </motion.header>

           {/* Hero Content - Nozomio Style */}
          <div className="px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-3xl mx-auto">
              {/* Headline */}
              <TimelineContent animationNum={1}>
                <h1 className="font-mono text-4xl sm:text-5xl md:text-6xl font-normal text-center mb-6 leading-tight">
                  design components.
                  <br />
                  <span className="text-muted-foreground">install instantly.</span>
                </h1>
              </TimelineContent>

              {/* Description */}
              <TimelineContent animationNum={2}>
                <p className="font-mono text-sm sm:text-base text-muted-foreground text-center mb-12 leading-relaxed max-w-2xl mx-auto">
                  Point your AI agent at any design. We package it and give your agent
                  access to beautiful UI components. Type-safe, customizable, and production-ready.
                </p>
              </TimelineContent>

              {/* Install Section */}
              <TimelineContent animationNum={3}>
                <div className="space-y-4">
                  {/* Label */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                      Install TasteUI
                    </span>
                    <div className="flex items-center gap-4 text-xs font-mono">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <HugeiconsIcon icon={CommandLineIcon} className="size-3.5" />
                        CLI
                      </span>
                    </div>
                  </div>

                  {/* Package Manager Tabs */}
                  <InstallCommand />

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                    <a
                      href="/docs"
                      className="inline-flex items-center px-6 py-3 bg-foreground text-background font-mono text-sm rounded hover:bg-foreground/90 transition-colors"
                    >
                      get started free
                    </a>
                    <a
                      href="/docs"
                      className="inline-flex items-center px-6 py-3 border border-border font-mono text-sm rounded text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-colors"
                    >
                      read the docs
                    </a>
                  </div>
                </div>
              </TimelineContent>
            </div>

            {/* Design Grid */}
            <div className="mt-20">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : error ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-destructive">Failed to load designs</p>
                </div>
              ) : designs && designs.length > 0 ? (
                <div className="grid md:grid-cols-3 grid-cols-2 gap-4">
                  {designs.slice(0, 6).map((design, index) => (
                    <TimelineContent key={design.id} animationNum={index + 4}>
                      <div
                        onClick={() => handleDesignClick(design.id)}
                        className="transition-all aspect-video rounded-lg overflow-hidden relative block group cursor-pointer"
                      >
                        <figure className="relative h-full w-full">
                          {design.thumbnailUrl ? (
                            <img
                              src={design.thumbnailUrl}
                              alt={design.name}
                              className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <SkillCard variant="pattern" />
                          )}
                        </figure>
                        <ProgressiveBlur
                          className="pointer-events-none absolute bottom-0 left-0 h-[40%] w-full"
                          blurIntensity={0.5}
                        />
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="text-lg font-medium text-white truncate">
                            {design.name}
                          </h3>
                          <p className="text-xs text-white/70 truncate">
                            {design.description || design.category}
                          </p>
                        </div>
                      </div>
                    </TimelineContent>
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
        </div>
      </div>
    </main>
  );
}
