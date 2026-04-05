import { Link } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { ViewTransition } from "./view-transition"
import type { Design } from "@/lib/types/design"

interface SkillDetailSidebarProps {
  design: Design
  username: string
  starCount: number
  isCopied: string | null
  onCopyInstall: () => void
}

export function SkillDetailSidebar({
  design,
  username,
  starCount,
  isCopied,
  onCopyInstall,
}: SkillDetailSidebarProps) {
  const installationCommand = `npx tokenui add ${design.author?.username || username}/${design.slug}`
  
  return (
    <aside className="w-[320px] min-h-[calc(100vh-56px)] border-r border-border bg-card/30 hidden lg:block">
      <div className="p-6 space-y-6">
        {/* Title Section */}
        <div>
          <ViewTransition name={`design-name-${design.id}`} share="morph">
            <h1 className="text-2xl font-semibold tracking-tight">
              {design.name.toLowerCase()}
            </h1>
          </ViewTransition>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {design.description || "A reusable UI component for modern applications."}
          </p>
        </div>

        {/* Created by */}
        <Link 
          to="/u/$username" 
          params={{ username }} 
          className="flex items-center gap-3 group cursor-pointer"
        >
          {design.author?.image ? (
            <img
              src={design.author.image}
              alt={design.author.name || "Author"}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-border group-hover:ring-primary/50 transition-all"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand to-brand/70 flex items-center justify-center text-primary-foreground font-medium">
              {(design.author?.name || design.name).charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-medium group-hover:text-primary transition-colors">
              {design.author?.name || username}
            </p>
            <p className="text-xs text-muted-foreground">@{username}</p>
          </div>
        </Link>

        {/* Installation */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Install
          </p>
          <div 
            className="group relative rounded-lg bg-muted/50 px-3 py-2.5 font-mono text-xs cursor-pointer hover:bg-muted transition-colors border border-border/50"
            onClick={onCopyInstall}
          >
            <span className="text-muted-foreground">$</span>{" "}
            <span className="text-foreground">{installationCommand}</span>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <HugeiconsIcon 
                icon={isCopied === "install" ? Tick02Icon : Copy01Icon} 
                className={cn("size-3.5", isCopied === "install" && "text-green-500")}
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <p className="text-lg font-semibold">{design.viewCount.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Views</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="text-lg font-semibold">
              {Math.max(1, Math.floor(design.viewCount * 0.1)).toLocaleString()}
            </p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Copies</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="text-lg font-semibold">{starCount.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Stars</p>
          </div>
        </div>

        {/* Created date */}
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Created on {new Date(design.createdAt).toLocaleDateString("en-US", { 
              month: "long", 
              day: "numeric", 
              year: "numeric" 
            })}
          </p>
        </div>
      </div>
    </aside>
  )
}
