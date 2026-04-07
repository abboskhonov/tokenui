import { Link } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  ArrowLeft01Icon,
  Folder01Icon,
  FolderOpenIcon,
  Sun01Icon,
  Moon02Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"

interface SkillDetailHeaderProps {
  username: string
  designSlug: string
  previewTheme: "light" | "dark"
  isShowingFiles: boolean
  onToggleFiles: () => void
  onToggleTheme: () => void
}

export function SkillDetailHeader({
  username,
  designSlug,
  previewTheme,
  isShowingFiles,
  onToggleFiles,
  onToggleTheme,
}: SkillDetailHeaderProps) {
  return (
    <header className="sticky top-0 z-50 h-12 border-b border-border bg-background/95 backdrop-blur-xl">
      <div className="mx-auto h-full max-w-full px-4 flex items-center justify-between">
        {/* Left: Back button */}
        <div className="flex items-center">
          <Link to="/" preload="intent">
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2 -ml-1">
              <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
              <span className="text-sm">Back</span>
            </Button>
          </Link>
        </div>

        {/* Center: Breadcrumb */}
        <div className="flex items-center gap-2 text-sm absolute left-1/2 -translate-x-1/2">
          <Link 
            to="/u/$username"
            params={{ username }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {username}
          </Link>
          <span className="text-muted-foreground/50">/</span>
          <span className="font-medium truncate max-w-[200px]">{designSlug}</span>
        </div>

        {/* Right: Minimalist actions */}
        <div className="flex items-center gap-1">
          {/* Toggle files */}
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
            {isShowingFiles ? "Hide files" : "Show files"}
          </Button>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-8 w-8"
            onClick={onToggleTheme}
          >
            <HugeiconsIcon 
              icon={previewTheme === "dark" ? Sun01Icon : Moon02Icon} 
              className="size-4" 
            />
          </Button>
        </div>
      </div>
    </header>
  )
}
