import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  ComputerIcon,
  Sun01Icon,
  Moon01Icon,
  CodeIcon,
  Bookmark01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

import type { SessionUser } from "@/lib/api/auth-server"

interface PreviewToolbarProps {
  previewMode: "desktop" | "mobile"
  previewTheme: "light" | "dark"
  isStarredState: boolean
  isStarPending: boolean
  isBookmarkedState: boolean
  isBookmarkPending: boolean
  user: SessionUser | null
  onSetPreviewMode: (mode: "desktop" | "mobile") => void
  onToggleTheme: () => void
  onViewCode: () => void
  onStarClick: () => void
  onBookmarkClick: () => void
}

export function PreviewToolbar({
  previewMode,
  previewTheme,
  isStarredState,
  isStarPending,
  isBookmarkedState,
  isBookmarkPending,
  user,
  onSetPreviewMode,
  onToggleTheme,
  onViewCode,
  onStarClick,
  onBookmarkClick,
}: PreviewToolbarProps) {
  return (
    <div className="h-10 border-b border-border flex items-center justify-between px-3 bg-background/50">
      <div className="flex items-center gap-1">
        {/* Device Toggle - minimal */}
        <div className="flex items-center bg-muted rounded-md p-0.5">
          <button
            onClick={() => onSetPreviewMode("desktop")}
            className={cn(
              "px-2 py-1 rounded text-xs font-medium transition-all",
              previewMode === "desktop" 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <HugeiconsIcon icon={ComputerIcon} className="size-3.5" />
          </button>
          <button
            onClick={() => onSetPreviewMode("mobile")}
            className={cn(
              "px-2 py-1 rounded text-xs font-medium transition-all",
              previewMode === "mobile" 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <HugeiconsIcon icon={ComputerIcon} className="size-3.5 rotate-90" />
          </button>
        </div>

        {/* Theme Toggle */}
        <Button 
          variant="ghost" 
          size="icon-sm" 
          className="h-7 w-7 ml-1"
          onClick={onToggleTheme}
        >
          <HugeiconsIcon 
            icon={previewTheme === "dark" ? Sun01Icon : Moon01Icon} 
            className="size-3.5" 
          />
        </Button>
      </div>

      {/* Right Toolbar - minimal */}
      <div className="flex items-center gap-0.5">
        <Button 
          variant="ghost" 
          size="icon-sm" 
          className="h-7 w-7"
          onClick={onViewCode}
        >
          <HugeiconsIcon icon={CodeIcon} className="size-3.5" />
        </Button>
        {user && (
          <Button 
            variant="ghost" 
            size="icon-sm" 
            className={cn(
              "h-7 w-7 transition-all duration-200",
              isStarredState && "text-yellow-500",
              isStarPending && "opacity-50"
            )}
            onClick={onStarClick}
            disabled={isStarPending}
            aria-label={isStarredState ? "Unstar design" : "Star design"}
          >
            <HugeiconsIcon 
              icon={StarIcon} 
              className={cn(
                "size-3.5 transition-all duration-200",
                isStarredState && "fill-current"
              )} 
            />
          </Button>
        )}
        {user && (
          <Button 
            variant="ghost" 
            size="icon-sm" 
            className={cn(
              "h-7 w-7 transition-all duration-200",
              isBookmarkedState && "text-primary",
              isBookmarkPending && "opacity-50"
            )}
            onClick={onBookmarkClick}
            disabled={isBookmarkPending}
            aria-label={isBookmarkedState ? "Remove bookmark" : "Add bookmark"}
          >
            <HugeiconsIcon 
              icon={Bookmark01Icon} 
              className={cn(
                "size-3.5 transition-all duration-200",
                isBookmarkedState && "fill-current"
              )} 
            />
          </Button>
        )}
      </div>
    </div>
  )
}
