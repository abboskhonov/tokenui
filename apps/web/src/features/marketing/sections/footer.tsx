
import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { NewTwitterIcon, DiscordIcon } from "@hugeicons/core-free-icons"

export function Footer() {
  return (
    <footer className="relative w-screen left-1/2 -translate-x-1/2 border-t border-border bg-background z-10">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 py-8 flex items-center justify-between">
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
          <a 
            href="https://discord.gg/bQ4ChzVW" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Join on Discord"
          >
            <Button variant="ghost" size="icon-sm" className="h-8 w-8">
              <HugeiconsIcon icon={DiscordIcon} className="size-4" />
            </Button>
          </a>
        </div>
      </div>
    </footer>
  )
}
