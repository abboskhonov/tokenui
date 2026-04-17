
import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { NewTwitterIcon } from "@hugeicons/core-free-icons"

export function Footer() {
  return (
    <footer className="w-full border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>© 2026</span>
        <span className="text-border">·</span>
        <span>tasteui.dev</span>
      </div>
      
      <div className="flex items-center gap-1">
        <Link to="/docs">
          <Button variant="ghost" size="sm">
            Docs
          </Button>
        </Link>
        <a 
          href="https://x.com/abboskhonovv" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Follow on X"
        >
          <Button variant="ghost" size="icon-sm" className="h-8 w-8">
            <HugeiconsIcon icon={NewTwitterIcon} className="size-4" />
          </Button>
        </a>
      </div>
    </div>
  </footer>
  )
}
