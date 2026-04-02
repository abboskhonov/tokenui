"use client"

import { useState } from "react"
import { useDesign } from "@/lib/queries/designs"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  ArrowLeft01Icon, 
  Share01Icon, 
  Copy01Icon, 
  Download01Icon,
  ComputerIcon,
  Cancel01Icon,
  ArrowUpRightIcon,
  File01Icon,
} from "@hugeicons/core-free-icons"
import { useSession } from "@/lib/auth-client"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"

interface DesignDetailDialogProps {
  designId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DesignDetailDialog({ designId, open, onOpenChange }: DesignDetailDialogProps) {
  const { data: design, isLoading } = useDesign(designId || "")
  const { data: session } = useSession()
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")
  const [isCopied, setIsCopied] = useState(false)

  const handleCopyPrompt = async () => {
    if (!design?.content) return
    
    try {
      await navigator.clipboard.writeText(design.content)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleShare = async () => {
    if (!design) return
    
    try {
      await navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    } catch (err) {
      console.error("Failed to share:", err)
    }
  }

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[1200px] w-[95vw] h-[85vh] p-0 overflow-hidden bg-background border-none rounded-xl shadow-2xl">
          <div className="flex items-center justify-center h-full">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!design) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[1200px] w-[95vw] h-[85vh] p-0 overflow-hidden bg-background border-none rounded-xl shadow-2xl">
        <DialogTitle className="sr-only">{design.name}</DialogTitle>
        
        <div className="flex flex-col h-full">
          {/* Top Toolbar */}
          <div className="h-14 flex items-center justify-between px-4 border-b border-border/50 bg-background shrink-0">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
              </Button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">AI</span>
                <span className="text-sm font-semibold">{design.name}</span>
                {design.category && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                    {design.category}
                  </span>
                )}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Device Toggle */}
              <div className="flex items-center bg-muted rounded-lg p-1 mr-2">
                <button
                  onClick={() => setPreviewMode("desktop")}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    previewMode === "desktop" 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <HugeiconsIcon icon={ComputerIcon} className="size-3.5" />
                  Desktop
                </button>
                <button
                  onClick={() => setPreviewMode("mobile")}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    previewMode === "mobile" 
                      ? "bg-background text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <HugeiconsIcon icon={ComputerIcon} className="size-3.5 rotate-90" />
                  Mobile
                </button>
              </div>

              {/* Action Icons */}
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShare}>
                <HugeiconsIcon icon={Share01Icon} className="size-4" />
              </Button>
              
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <HugeiconsIcon icon={ArrowUpRightIcon} className="size-4" />
              </Button>

              {design.demoUrl && (
                <a 
                  href={design.demoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Open
                </a>
              )}

              {/* Copy Prompt Button */}
              <Button 
                variant="default" 
                size="sm" 
                className="gap-2 h-8 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleCopyPrompt}
              >
                <HugeiconsIcon icon={isCopied ? File01Icon : Copy01Icon} className="size-4" />
                {isCopied ? "Copied!" : "Copy prompt"}
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => onOpenChange(false)}
              >
                <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
              </Button>
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex-1 overflow-hidden bg-muted/30 flex items-center justify-center p-8">
            {design.demoUrl ? (
              <div 
                className={`bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 h-full ${
                  previewMode === "mobile" ? "w-[375px] max-h-[812px]" : "w-full max-w-[1200px]"
                }`}
              >
                <iframe
                  src={design.demoUrl}
                  className="w-full h-full border-0"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <HugeiconsIcon icon={File01Icon} className="size-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  No preview available for this design
                </p>
                <Button variant="outline" className="gap-2">
                  <HugeiconsIcon icon={Download01Icon} className="size-4" />
                  Download Files
                </Button>
              </div>
            )}
          </div>

          {/* Bottom Info Bar */}
          <div className="h-12 border-t border-border/50 bg-background px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{design.viewCount.toLocaleString()} views</span>
              <span>•</span>
              <span>{new Date(design.createdAt).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                by {session?.user?.name || "Unknown"}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
