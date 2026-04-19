import { Link } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  ArrowLeft01Icon,
  Folder01Icon,
  FolderOpenIcon,
  Menu01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"

interface SkillDetailHeaderProps {
  username: string
  designSlug: string
  isShowingFiles: boolean
  onToggleFiles: () => void
  onOpenMobileSidebar?: () => void
}

export function SkillDetailHeader({
  username,
  designSlug,
  isShowingFiles,
  onToggleFiles,
  onOpenMobileSidebar,
}: SkillDetailHeaderProps) {
  return (
    <header className="sticky top-0 z-50 h-12 border-b border-border bg-background/95 backdrop-blur-xl">
      <div className="mx-auto h-full max-w-full px-3 sm:px-4 flex items-center justify-between">
        {/* Left: Back button + Mobile menu */}
        <div className="flex items-center gap-1">
          <Link to="/" preload="intent">
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2 -ml-1">
              <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
              <span className="text-sm hidden sm:inline">Back</span>
            </Button>
          </Link>
          {/* Mobile menu button - only visible on small screens */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 lg:hidden"
            onClick={onOpenMobileSidebar}
          >
            <HugeiconsIcon icon={Menu01Icon} className="size-4" />
          </Button>
        </div>

        {/* Center: Breadcrumb */}
        <div className="flex items-center gap-1 sm:gap-2 text-sm absolute left-1/2 -translate-x-1/2 max-w-[50%] sm:max-w-none">
          <Link 
            to="/u/$username"
            params={{ username }}
            className="text-muted-foreground hover:text-foreground transition-colors truncate max-w-[80px] sm:max-w-[120px]"
          >
            {username}
          </Link>
          <span className="text-muted-foreground/50 shrink-0">/</span>
          <span className="font-medium truncate max-w-[100px] sm:max-w-[150px] md:max-w-[200px]">{designSlug}</span>
        </div>

        {/* Right: Minimalist actions */}
        <div className="flex items-center gap-1">
          {/* Toggle files - text hidden on smallest screens */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs gap-1.5 px-2"
            onClick={onToggleFiles}
          >
            <HugeiconsIcon 
              icon={isShowingFiles ? FolderOpenIcon : Folder01Icon} 
              className="size-3.5" 
            />
            <span className="hidden sm:inline">{isShowingFiles ? "Hide files" : "Show files"}</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
