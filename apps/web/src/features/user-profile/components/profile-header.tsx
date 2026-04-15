import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"

interface ProfileHeaderProps {
  username: string
}

export function ProfileHeader({ username }: ProfileHeaderProps) {
  return (
    <header className="sticky top-0 z-50 h-14 border-b border-border bg-background/95 backdrop-blur-xl">
      <div className="mx-auto h-full max-w-7xl px-6 flex items-center">
        {/* Left: Back to Home */}
        <div className="flex items-center flex-1">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 -ml-2 px-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
              Home
            </Button>
          </Link>
        </div>

        {/* Center: Username */}
        <div className="text-sm font-medium">@{username}</div>

        {/* Right: Empty for balance */}
        <div className="flex-1" />
      </div>
    </header>
  )
}
