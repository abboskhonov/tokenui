import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeftIcon } from "@hugeicons/core-free-icons"

interface ProfileHeaderProps {
  username: string
}

export function ProfileHeader({ username }: ProfileHeaderProps) {
  return (
    <header className="sticky top-0 z-50 h-14 border-b border-border bg-background/95 backdrop-blur-xl">
      <div className="mx-auto h-full max-w-6xl px-6 flex items-center justify-between">
        {/* Left: Back + Breadcrumb */}
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon-sm" className="h-8 w-8 -ml-2">
              <HugeiconsIcon icon={ArrowLeftIcon} className="size-4" />
            </Button>
          </Link>
          
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">@{username}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
