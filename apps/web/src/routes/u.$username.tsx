import { createFileRoute, Link } from "@tanstack/react-router"
import { useUserProfile } from "@/lib/queries/users"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  Cancel01Icon,
  ArrowLeftIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import * as React from "react"
import { cn } from "@/lib/utils"
import type { Design } from "@/lib/types/design"

// ViewTransition is available in React canary
const ViewTransition = (React as { ViewTransition?: React.ComponentType<{ children?: React.ReactNode; name?: string; share?: string; default?: string }> }).ViewTransition ?? (({ children }: { children?: React.ReactNode }) => children)

// Route parameter validation
export const Route = createFileRoute("/u/$username")({
  component: UserProfilePage,
  head: ({ params }) => ({
    meta: [
      {
        title: `${params.username} - tokenui`,
      },
    ],
  }),
  errorComponent: () => <ProfileError />,
  notFoundComponent: () => <ProfileNotFound />,
})

type TabType = "components" | "bookmarks"

function UserProfilePage() {
  const { username } = Route.useParams()
  const { data: profileData, isLoading, error } = useUserProfile(username)
  const [activeTab, setActiveTab] = React.useState<TabType>("components")
  const [searchQuery, setSearchQuery] = React.useState("")

  if (isLoading) {
    return <ProfileLoading />
  }

  if (error || !profileData) {
    return <ProfileError />
  }

  const { user, designs, stats } = profileData

  // Filter designs based on search query
  const filteredDesigns = searchQuery
    ? designs.filter(d => 
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())
      )
    : designs

  return (
    <ViewTransition default="none">
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="sticky top-0 z-50 h-14 border-b border-border bg-background/95 backdrop-blur-xl">
          <div className="mx-auto h-full max-w-[1800px] px-4 flex items-center justify-between">
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

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8">
                Follow
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-[1800px] px-4 py-8">
          {/* Profile Header */}
          <div className="flex items-start gap-6 mb-8">
            {/* Avatar */}
            <div className="shrink-0">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || username}
                  className="h-20 w-20 rounded-2xl object-cover ring-2 ring-border"
                />
              ) : (
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-brand to-brand/70 flex items-center justify-center text-primary-foreground text-2xl font-semibold">
                  {(user.name || username).charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-4 mb-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {user.name || username}
                </h1>
                <Button size="sm" className="h-8 px-6 bg-primary text-primary-foreground hover:bg-primary/90">
                  Follow
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">
                @{username}
              </p>
              
              {user.bio && (
                <p className="text-sm text-foreground mb-4">
                  {user.bio}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold">{stats.components}</span>
                  <span className="text-muted-foreground">components</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold">{stats.followers}</span>
                  <span className="text-muted-foreground">followers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold">{stats.following}</span>
                  <span className="text-muted-foreground">following</span>
                </div>
                
                {/* Social Links */}
                <div className="flex items-center gap-2 ml-4">
                  {user.x && (
                    <a 
                      href={`https://x.com/${user.x}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                  )}
                  {user.github && (
                    <a 
                      href={`https://github.com/${user.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  )}
                  {user.website && (
                    <a 
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="2" y1="12" x2="22" y2="12"/>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs & Search */}
          <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab("components")}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  activeTab === "components"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Components
                <span className="ml-1.5 text-muted-foreground">{stats.components}</span>
              </button>
              <button
                onClick={() => setActiveTab("bookmarks")}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  activeTab === "bookmarks"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Bookmarks
                <span className="ml-1.5 text-muted-foreground">0</span>
              </button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                <HugeiconsIcon icon={Search01Icon} className="size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground w-48"
                />
              </div>
              <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
                /
              </div>
            </div>
          </div>

          {/* Content */}
          {activeTab === "components" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDesigns.map((design) => (
                <DesignCard key={design.id} design={design} username={username} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">No bookmarks yet</p>
            </div>
          )}
        </main>
      </div>
    </ViewTransition>
  )
}

// Design Card Component
interface DesignCardProps {
  design: Design
  username: string
}

function DesignCard({ design, username }: DesignCardProps) {
  return (
    <Link to="/s/$username/$designSlug" params={{ username, designSlug: design.slug }}>
      <ViewTransition name={`design-thumbnail-${design.id}`} share="morph-forward" default="none">
        <article className="group relative cursor-pointer">
          {/* Thumbnail */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted ring-1 ring-border/50 transition-all duration-300 ease-out group-hover:-translate-y-3 group-hover:shadow-lg group-hover:shadow-foreground/5 group-hover:ring-border">
            {design.thumbnailUrl ? (
              <img
                src={design.thumbnailUrl}
                alt={design.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                <span className="text-4xl font-bold text-muted-foreground">
                  {design.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Metadata - appears below on hover */}
          <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-between px-1 pt-2 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100">
            <h3 className="text-sm font-medium text-foreground truncate">
              {design.name}
            </h3>
            <span className="text-xs font-medium text-muted-foreground/70 tabular-nums shrink-0">
              {design.viewCount.toLocaleString()}
            </span>
          </div>
        </article>
      </ViewTransition>
    </Link>
  )
}

function ProfileLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )
}

function ProfileError() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
          <HugeiconsIcon icon={Cancel01Icon} className="size-8 text-destructive" />
        </div>
        <div>
          <p className="text-lg font-medium">Failed to load profile</p>
          <p className="text-sm text-muted-foreground">Please try again later</p>
        </div>
        <Link to="/">
          <Button variant="outline" className="mt-4">
            <HugeiconsIcon icon={ArrowLeftIcon} className="size-4 mr-2" />
            Back to home
          </Button>
        </Link>
      </div>
    </div>
  )
}

function ProfileNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
          <span className="text-2xl text-muted-foreground">?</span>
        </div>
        <div>
          <p className="text-lg font-medium">Profile not found</p>
          <p className="text-sm text-muted-foreground">The user you're looking for doesn't exist</p>
        </div>
        <Link to="/">
          <Button variant="outline" className="mt-4">
            <HugeiconsIcon icon={ArrowLeftIcon} className="size-4 mr-2" />
            Back to home
          </Button>
        </Link>
      </div>
    </div>
  )
}
