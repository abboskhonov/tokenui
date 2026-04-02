"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Link } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CommandLineIcon,
  Copy01Icon,
  Tick02Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import { usePublicDesigns } from "@/lib/queries/designs"
import { DesignDetailDialog } from "@/components/marketing/design-detail-dialog"

function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
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
  )
}

function CLIButton() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("npx tokenui add login-form")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="group flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-2.5 font-mono text-sm text-foreground ring-1 ring-border transition-all hover:bg-muted hover:ring-foreground/20"
    >
      <span className="text-muted-foreground">$</span>
      <span>npx tokenui add login-form</span>
      <span className="ml-2 flex items-center gap-1.5 text-xs text-muted-foreground transition-colors group-hover:text-foreground">
        <HugeiconsIcon
          icon={copied ? Tick02Icon : Copy01Icon}
          className={cn("size-3.5", copied && "text-green-500")}
        />
      </span>
    </button>
  )
}

export function Hero() {
  const { data: designs } = usePublicDesigns()
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const featuredDesigns = designs?.slice(0, 3) || []

  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[800px] w-[1000px] -translate-x-1/2 bg-[radial-gradient(circle_at_center,var(--brand)/8%,transparent_70%)] blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Navigation */}
      <FadeIn className="relative z-10">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background">
              <HugeiconsIcon icon={CommandLineIcon} className="size-4" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              tokenui
            </span>
          </Link>
          <div className="flex items-center gap-6">
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
            <Link
              to="/login"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Log in
            </Link>
            <Link to="/login">
              <button className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90">
                Get started
              </button>
            </Link>
          </div>
        </nav>
      </FadeIn>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-16 md:pt-24">
        {/* Headline */}
        <FadeIn delay={0.1}>
          <h1 className="max-w-3xl text-5xl font-medium leading-[1.1] tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Design components for AI agents
          </h1>
        </FadeIn>

        {/* Subtitle */}
        <FadeIn delay={0.2}>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Beautiful, production-ready UI components. Install with one command.
            Built for developers who ship fast.
          </p>
        </FadeIn>

        {/* CTA Row */}
        <FadeIn delay={0.3}>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <CLIButton />
            <Link
              to="/docs"
              className="group flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Read documentation
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="size-4 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </FadeIn>

        {/* Product Preview */}
        <FadeIn delay={0.4}>
          <div className="mt-16 md:mt-20">
            <div className="relative rounded-xl bg-card/50 p-1 ring-1 ring-border">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-foreground/20" />
                  <div className="h-3 w-3 rounded-full bg-foreground/20" />
                  <div className="h-3 w-3 rounded-full bg-foreground/20" />
                </div>
              </div>

              {/* Content grid */}
              <div className="grid gap-4 p-4 md:grid-cols-3">
                {featuredDesigns.length > 0 ? (
                  featuredDesigns.map((design) => (
                    <div
                      key={design.id}
                      onClick={() => {
                        setSelectedDesignId(design.id)
                        setDialogOpen(true)
                      }}
                      className="group cursor-pointer"
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-video overflow-hidden rounded-xl bg-muted/50 ring-1 ring-border transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-foreground/10">
                        {design.thumbnailUrl ? (
                          <img
                            src={design.thumbnailUrl}
                            alt={design.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <span className="text-sm text-muted-foreground">
                              {design.name}
                            </span>
                          </div>
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
                        <span className="text-sm font-medium text-foreground">
                          {design.name}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  // Placeholder cards when no designs
                  <>
                    <div className="aspect-video rounded-lg bg-muted/50 ring-1 ring-border" />
                    <div className="aspect-video rounded-lg bg-muted/50 ring-1 ring-border" />
                    <div className="aspect-video rounded-lg bg-muted/50 ring-1 ring-border" />
                  </>
                )}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Design Detail Dialog */}
      <DesignDetailDialog
        designId={selectedDesignId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </section>
  )
}
