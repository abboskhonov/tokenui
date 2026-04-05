import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  Menu01Icon, 
  Copy01Icon, 
  File01Icon,
  Tick02Icon,
  CodeIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

interface SkillDetailHeaderProps {
  username: string
  designSlug: string
  isCopied: string | null
  onCopyPrompt: () => void
  onCopyCode: () => void
  onToggleCodeView: () => void
}

export function SkillDetailHeader({
  username,
  designSlug,
  isCopied,
  onCopyPrompt,
  onCopyCode,
  onToggleCodeView,
}: SkillDetailHeaderProps) {
  return (
    <header className="sticky top-0 z-50 h-14 border-b border-border bg-background/95 backdrop-blur-xl">
      <div className="mx-auto h-full max-w-[1800px] px-4 flex items-center justify-between">
        {/* Left: Menu + Breadcrumb */}
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon-sm" className="h-8 w-8 -ml-2">
              <HugeiconsIcon icon={Menu01Icon} className="size-4" />
            </Button>
          </Link>
          
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Skills
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">{username}</span>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">{designSlug}</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 h-8 text-xs"
            onClick={onCopyPrompt}
          >
            <HugeiconsIcon 
              icon={isCopied === "prompt" ? Tick02Icon : Copy01Icon} 
              className={cn("size-4", isCopied === "prompt" && "text-green-500")} 
            />
            <span className="hidden sm:inline">
              {isCopied === "prompt" ? "Copied!" : "Copy prompt"}
            </span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 h-8 text-xs"
            onClick={onCopyCode}
          >
            <HugeiconsIcon 
              icon={isCopied === "code" ? Tick02Icon : File01Icon} 
              className={cn("size-4", isCopied === "code" && "text-green-500")} 
            />
            <span className="hidden sm:inline">
              {isCopied === "code" ? "Copied!" : "Copy code"}
            </span>
          </Button>

          <div className="h-4 w-px bg-border mx-1 hidden sm:block" />
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 h-8 text-xs hidden sm:inline-flex"
            onClick={onToggleCodeView}
          >
            <HugeiconsIcon icon={CodeIcon} className="size-4" />
            View code
          </Button>
        </div>
      </div>
    </header>
  )
}
