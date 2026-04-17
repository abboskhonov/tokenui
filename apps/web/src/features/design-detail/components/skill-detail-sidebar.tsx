"use client"

import { Link } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Bookmark01Icon,
  Copy01Icon,
  Download01Icon,
  EyeIcon,
  Linkedin01Icon,
  NewTwitterIcon,
  RedditIcon,
  Share08Icon,
  StarIcon,
  TelegramIcon,
  Tick02Icon,
  Calendar03Icon,
  Clock01Icon,
  Tag01Icon,
} from "@hugeicons/core-free-icons"
import JSZip from "jszip"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import type { Design } from "@/lib/types/design"
import type { FileNode } from "@/features/publish/components/file-tree"
import type { User } from "@/lib/types/auth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useStarCount, useTrackDownload } from "@/lib/queries/designs"

interface SkillDetailSidebarProps {
  design: Design
  username: string
  user: User | null
  isCopied: string | null
  isStarredState: boolean
  isBookmarkedState: boolean
  onCopyInstall: () => void
  onStarClick: () => void
  onBookmarkClick: () => void
}

export function SkillDetailSidebar({
  design,
  username,
  user,
  isCopied,
  isStarredState,
  isBookmarkedState,
  onCopyInstall,
  onStarClick,
  onBookmarkClick,
}: SkillDetailSidebarProps) {
  const installationCommand = `tasteui.dev add ${design.author?.username || username}/${design.slug}`
  
  const { data: serverStarCount } = useStarCount(design.id, design.starCount ?? 0)
  const [optimisticAdjustment, setOptimisticAdjustment] = useState<number>(0)
  const trackDownload = useTrackDownload()
  const prevServerCountRef = useRef(serverStarCount)
  
  useEffect(() => {
    if (serverStarCount !== prevServerCountRef.current) {
      setOptimisticAdjustment(0)
      prevServerCountRef.current = serverStarCount
    }
  }, [serverStarCount])
  
  const displayStarCount = (serverStarCount ?? 0) + optimisticAdjustment

  const handleDownload = async () => {
    if (typeof window === "undefined" || !document) return
    
    trackDownload.mutate(design.id)
    
    const zip = new JSZip()
    const folderName = design.slug || design.name.replace(/\s+/g, "-").toLowerCase()
    
    if (design.files && design.files.length > 0) {
      const addFilesToZip = (nodes: Array<FileNode>, currentPath: string = "") => {
        for (const node of nodes) {
          const filePath = currentPath ? `${currentPath}/${node.name}` : node.name
          
          if (node.type === "file" && node.content) {
            zip.file(filePath, node.content)
          } else if (node.type === "folder" && node.children) {
            const folder = zip.folder(filePath)
            if (folder) {
              addFilesToZip(node.children, filePath)
            }
          }
        }
      }
      addFilesToZip(design.files)
    } else {
      zip.file("SKILL.md", design.content)
    }

    const blob = await zip.generateAsync({ type: "blob" })
    
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${folderName}.zip`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    toast.success("Downloaded skill", { duration: 2000 })
  }

  const handleStarClick = () => {
    if (!user) {
      toast.error("Please sign in to star skills")
      return
    }
    
    const adjustment = isStarredState ? -1 : +1
    setOptimisticAdjustment(prev => prev + adjustment)
    onStarClick()
    
    if (!isStarredState) {
      toast.success("Starred!", { duration: 1500 })
    } else {
      toast("Unstarred", { duration: 1500 })
    }
  }

  const handleBookmarkClick = () => {
    if (!user) {
      toast.error("Please sign in to bookmark skills")
      return
    }

    onBookmarkClick()

    if (!isBookmarkedState) {
      toast.success("Saved to bookmarks", { duration: 1500 })
    } else {
      toast("Removed from bookmarks", { duration: 1500 })
    }
  }

  const designUrl = `https://tasteui.dev/s/${username}/${design.slug}`
  const shareText = `Check out ${design.name} by ${username} on tasteui`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(designUrl)
      toast.success("Link copied to clipboard")
    } catch {
      toast.error("Failed to copy link")
    }
  }

  const handleShareX = () => {
    const text = encodeURIComponent(shareText)
    const url = encodeURIComponent(designUrl)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer')
  }

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(designUrl)
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener,noreferrer')
  }

  const handleShareTelegram = () => {
    const text = encodeURIComponent(shareText)
    const url = encodeURIComponent(designUrl)
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank', 'noopener,noreferrer')
  }

  const handleShareReddit = () => {
    const title = encodeURIComponent(shareText)
    const url = encodeURIComponent(designUrl)
    window.open(`https://www.reddit.com/submit?title=${title}&url=${url}`, '_blank', 'noopener,noreferrer')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <aside className="w-[320px] h-[calc(100vh-56px)] border-r border-border bg-background hidden lg:block overflow-y-auto shrink-0">
      <div className="p-6 space-y-6">
        {/* Title + Category */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-[10px] font-medium text-muted-foreground border border-border/50 uppercase tracking-wide">
              <HugeiconsIcon icon={Tag01Icon} className="size-3" />
              {design.category}
            </span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight">
            {design.name}
          </h1>
          {design.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {design.description}
            </p>
          )}
        </div>

        {/* Author Card */}
        <Link 
          to="/u/$username" 
          params={{ username }} 
          className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50 group cursor-pointer hover:bg-muted/70 transition-colors"
        >
          {design.author?.image ? (
            <img
              src={design.author.image}
              alt={design.author.name || "Author"}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-background"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand to-brand/70 flex items-center justify-center text-primary-foreground font-medium ring-2 ring-background">
              {(design.author?.name || design.name).charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm group-hover:text-primary transition-colors truncate">
              {design.author?.name || username}
            </p>
            <p className="text-xs text-muted-foreground truncate">@{username}</p>
          </div>
        </Link>

        {/* Stats - Minimal Inline */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <HugeiconsIcon icon={StarIcon} className="size-4" />
            <span className="tabular-nums font-medium text-foreground">{displayStarCount}</span>
            <span className="text-xs">stars</span>
          </span>
          <span className="flex items-center gap-1.5">
            <HugeiconsIcon icon={EyeIcon} className="size-4" />
            <span className="tabular-nums font-medium text-foreground">{design.viewCount.toLocaleString()}</span>
            <span className="text-xs">views</span>
          </span>
        </div>

        {/* Primary CTA - Installation */}
        <div className="space-y-3">
          <div 
            className="group relative rounded-xl bg-muted border border-border px-4 py-4 font-mono text-sm cursor-pointer hover:bg-muted/80 transition-colors"
            onClick={onCopyInstall}
          >
            <code className="flex items-center gap-2 pr-8">
              <span className="text-green-600 dark:text-green-400 font-semibold">npx</span>
              <span className="text-foreground">{installationCommand}</span>
            </code>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity bg-background rounded-md p-1.5 shadow-sm border border-border">
              <HugeiconsIcon 
                icon={isCopied === "install" ? Tick02Icon : Copy01Icon} 
                className={cn("size-4", isCopied === "install" && "text-green-500")}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Click to copy installation command
          </p>
        </div>

        {/* Minimal Actions Row */}
        <div className="flex items-center justify-between pt-2">
          {/* Left: Star & Bookmark */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleStarClick}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                "hover:bg-muted",
                isStarredState ? "text-yellow-500" : "text-muted-foreground"
              )}
            >
              <HugeiconsIcon 
                icon={StarIcon} 
                className={cn("size-4", isStarredState && "fill-current")} 
              />
              <span>Star</span>
            </button>

            <button
              onClick={handleBookmarkClick}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                "hover:bg-muted",
                isBookmarkedState ? "text-primary" : "text-muted-foreground"
              )}
            >
              <HugeiconsIcon 
                icon={Bookmark01Icon} 
                className={cn("size-4", isBookmarkedState && "fill-current")} 
              />
              <span>Save</span>
            </button>
          </div>

          {/* Right: Download & Share */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              <HugeiconsIcon icon={Download01Icon} className="size-4" />
              <span>ZIP</span>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted transition-colors">
                    <HugeiconsIcon icon={Share08Icon} className="size-4" />
                    <span>Share</span>
                  </button>
                }
              />
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleCopyLink}>
                  <HugeiconsIcon icon={Copy01Icon} className="size-4 mr-2" />
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShareX}>
                  <HugeiconsIcon icon={NewTwitterIcon} className="size-4 mr-2" />
                  Share on X
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShareLinkedIn}>
                  <HugeiconsIcon icon={Linkedin01Icon} className="size-4 mr-2" />
                  LinkedIn
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShareTelegram}>
                  <HugeiconsIcon icon={TelegramIcon} className="size-4 mr-2" />
                  Telegram
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShareReddit}>
                  <HugeiconsIcon icon={RedditIcon} className="size-4 mr-2" />
                  Reddit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-2 pt-4 border-t border-border/50">
          {design.publishedAt && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <HugeiconsIcon icon={Calendar03Icon} className="size-3.5" />
              <span>Published on {formatDate(design.publishedAt)}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <HugeiconsIcon icon={Clock01Icon} className="size-3.5" />
            <span>Updated {formatDate(design.updatedAt)}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
