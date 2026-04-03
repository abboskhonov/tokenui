import { Link } from "@tanstack/react-router"
import { useUser } from "@/lib/user-context"
import { HugeiconsIcon } from "@hugeicons/react"
import { CommandLineIcon } from "@hugeicons/core-free-icons"

export function StudioHeader() {
  // Use SSR user data from context
  const { user } = useUser()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background">
              <HugeiconsIcon icon={CommandLineIcon} className="size-4" />
            </div>
            <span className="text-lg font-semibold tracking-tight">tokenui</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/studio" className="text-sm font-medium text-foreground">
              Studio
            </Link>
            <Link
              to="/"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Components
            </Link>
            <Link
              to="/"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Explore
            </Link>
            <Link
              to="/"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Public Profile
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user?.image ? (
            <img
              src={user.image}
              alt={user.name || "User"}
              className="h-8 w-8 rounded-full"
            />
          ) : null}
        </div>
      </div>
    </header>
  )
}
