import { Link } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  Copy01Icon, 
  Tick02Icon,
  Download01Icon,
  StarIcon,
  Bookmark01Icon,
  EyeIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { Design } from "@/lib/types/design"
import type { FileNode } from "@/features/publish/components/file-tree"
import type { SessionUser } from "@/lib/api/auth-server"
import { useStarCount, useTrackDownload } from "@/lib/queries/designs"
import JSZip from "jszip"
import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"

interface SkillDetailSidebarProps {
  design: Design
  username: string
  user: SessionUser | null
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
  const installationCommand = `npx tokenui.sh add ${design.author?.username || username}/${design.slug}`
  
  // Use prefetched starCount from design object as initial data
  // This allows instant display while still being able to refetch after mutations
  const { data: serverStarCount } = useStarCount(design.id, design.starCount ?? 0)
  
  // Local optimistic state for star count (relative adjustment)
  const [optimisticAdjustment, setOptimisticAdjustment] = useState<number>(0)
  
  // Download tracking
  const trackDownload = useTrackDownload()
  
  // Track previous server count to detect when it actually changes
  const prevServerCountRef = useRef(serverStarCount)
  
  // Reset optimistic adjustment when server data updates (mutation completed)
  useEffect(() => {
    if (serverStarCount !== prevServerCountRef.current) {
      // Server count changed, reset our optimistic adjustment
      setOptimisticAdjustment(0)
      prevServerCountRef.current = serverStarCount
    }
  }, [serverStarCount])
  
  // Display count: server count + optimistic adjustment
  const displayStarCount = (serverStarCount ?? 0) + optimisticAdjustment

  const handleDownload = async () => {
    // Guard for SSR
    if (typeof window === "undefined" || !document) return
    
    // Track the download
    trackDownload.mutate(design.id)
    
    const zip = new JSZip()
    const folderName = design.slug || design.name.replace(/\s+/g, "-").toLowerCase()
    
    if (design.files && design.files.length > 0) {
      const addFilesToZip = (nodes: FileNode[], currentPath: string = "") => {
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
    
    // Optimistic update: adjust the count locally based on current state
    const adjustment = isStarredState ? -1 : +1
    setOptimisticAdjustment(prev => prev + adjustment)
    
    // Call the actual mutation
    onStarClick()
    
    // Show feedback
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
  
  return (
    <aside className="w-[340px] h-[calc(100vh-56px)] border-r border-border bg-background hidden lg:block overflow-y-auto">
      <div className="p-6 space-y-8">
        {/* Title Section */}
        <div className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight">
            {design.name}
          </h1>
          {design.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {design.description}
            </p>
          )}
        </div>

        {/* Action buttons row */}
        <div className="flex items-center gap-2">
          {/* Download */}
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-9 text-xs gap-1.5"
            onClick={handleDownload}
          >
            <HugeiconsIcon icon={Download01Icon} className="size-3.5" />
            Download
          </Button>

          {/* Star with optimistic count */}
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-9 px-2.5 text-xs gap-1.5",
              isStarredState && "text-yellow-500 border-yellow-500/50"
            )}
            onClick={handleStarClick}
          >
            <HugeiconsIcon 
              icon={StarIcon} 
              className={cn("size-3.5", isStarredState && "fill-current")} 
            />
            <span>{displayStarCount}</span>
          </Button>

          {/* Bookmark */}
          <Button
            variant="outline"
            size="icon-sm"
            className={cn(
              "h-9 w-9",
              isBookmarkedState && "text-primary border-primary/50"
            )}
            onClick={handleBookmarkClick}
          >
            <HugeiconsIcon 
              icon={Bookmark01Icon} 
              className={cn("size-3.5", isBookmarkedState && "fill-current")} 
            />
          </Button>

          {/* Views */}
          <div className="flex items-center gap-1 px-2 h-9 rounded-md border border-border bg-muted/30 text-xs text-muted-foreground">
            <HugeiconsIcon icon={EyeIcon} className="size-3.5" />
            <span>{design.viewCount.toLocaleString()}</span>
          </div>
        </div>

        {/* Created by */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Created by</h3>
          <Link 
            to="/u/$username" 
            params={{ username }} 
            className="flex items-center gap-3 group cursor-pointer"
          >
            {design.author?.image ? (
              <img
                src={design.author.image}
                alt={design.author.name || "Author"}
                className="h-10 w-10 rounded-xl object-cover ring-1 ring-border group-hover:ring-primary/50 transition-all"
              />
            ) : (
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand to-brand/70 flex items-center justify-center text-primary-foreground font-medium">
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
        </div>

        {/* Installation */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Installation</h3>
          <div 
            className="group relative rounded-lg bg-muted/50 px-3 py-2.5 font-mono text-xs cursor-pointer hover:bg-muted transition-colors border border-border/50"
            onClick={onCopyInstall}
          >
            <span className="text-green-600 dark:text-green-400">npx</span>{" "}
            <span className="text-foreground">{installationCommand}</span>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background rounded p-1 shadow-sm">
              <HugeiconsIcon 
                icon={isCopied === "install" ? Tick02Icon : Copy01Icon} 
                className={cn("size-3.5", isCopied === "install" && "text-green-500")}
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
