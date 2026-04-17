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
    <aside className="w-[340px] h-[calc(100vh-56px)] border-r border-border bg-background hidden lg:block overflow-y-auto shrink-0">
      <div className="p-6 space-y-8">
        {/* Title + Description */}
        <div className="space-y-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {design.category}
          </span>
          <h1 className="text-xl font-semibold tracking-tight">
            {design.name}
          </h1>
          {design.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {design.description}
            </p>
          )}
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <HugeiconsIcon icon={StarIcon} className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium tabular-nums">{displayStarCount}</span>
            <span className="text-xs text-muted-foreground">stars</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HugeiconsIcon icon={EyeIcon} className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium tabular-nums">{design.viewCount.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">views</span>
          </div>
        </div>

        {/* Created by */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Created by</h3>
          <Link 
            to="/u/$username" 
            params={{ username }} 
            className="flex items-center gap-3 group cursor-pointer"
          >
            {design.author?.image ? (
              <img
                src={design.author.image}
                alt={design.author.name || "Author"}
                className="h-9 w-9 rounded-lg object-cover"
              />
            ) : (
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-sm font-medium">
                {(design.author?.name || design.name).charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm font-medium group-hover:text-primary transition-colors">
                {design.author?.name || username}
              </p>
              <p className="text-xs text-muted-foreground">@{username}</p>
            </div>
          </Link>
        </div>

        {/* Installation */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Installation</h3>
          <div 
            className="group relative rounded-lg bg-muted px-4 py-3 font-mono text-xs cursor-pointer hover:bg-muted/80 transition-colors overflow-hidden"
            onClick={onCopyInstall}
          >
            <code className="flex items-center gap-1.5 whitespace-nowrap overflow-x-auto scrollbar-hide pr-10">
              <span className="text-green-600 dark:text-green-400 shrink-0">npx</span>
              <span className="text-foreground">tasteui.dev</span>
              <span className="text-orange-500 dark:text-orange-400 shrink-0">@latest</span>
              <span className="text-foreground">add {design.author?.username || username}/{design.slug}</span>
            </code>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-muted">
              <HugeiconsIcon 
                icon={isCopied === "install" ? Tick02Icon : Copy01Icon} 
                className={cn("size-3.5", isCopied === "install" && "text-green-500")}
              />
            </div>
          </div>
        </div>

        {/* Actions Row - Like the screenshot */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className={cn(
              "flex-1 h-9 text-xs gap-1.5",
              isStarredState && "text-yellow-500"
            )}
            onClick={handleStarClick}
          >
            <HugeiconsIcon 
              icon={StarIcon} 
              className={cn("size-3.5", isStarredState && "fill-current")} 
            />
            {isStarredState ? "Starred" : "Star"}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            className={cn(
              "flex-1 h-9 text-xs gap-1.5",
              isBookmarkedState && "text-primary"
            )}
            onClick={handleBookmarkClick}
          >
            <HugeiconsIcon 
              icon={Bookmark01Icon} 
              className={cn("size-3.5", isBookmarkedState && "fill-current")} 
            />
            {isBookmarkedState ? "Saved" : "Save"}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="secondary" size="sm" className="flex-1 h-9 text-xs gap-1.5">
                  <HugeiconsIcon icon={Share08Icon} className="size-3.5" />
                  Share
                </Button>
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

        {/* Download as text link */}
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <HugeiconsIcon icon={Download01Icon} className="size-3.5" />
          <span>Download as ZIP</span>
        </button>

        {/* Dates */}
        <div className="pt-4 border-t border-border/50 space-y-2">
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
