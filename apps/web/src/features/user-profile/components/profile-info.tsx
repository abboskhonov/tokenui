import type { UserProfile, UserStats } from "@/lib/queries/users"

interface ProfileInfoProps {
  user: UserProfile
  username: string
  stats: UserStats
}

export function ProfileInfo({ user, username, stats }: ProfileInfoProps) {
  return (
    <div className="flex items-start gap-5 mb-8 pb-6 border-b border-border">
      {/* Avatar */}
      <div className="shrink-0">
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || username}
            className="h-16 w-16 rounded-2xl object-cover ring-1 ring-border"
          />
        ) : (
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-brand to-brand/70 flex items-center justify-center text-primary-foreground text-2xl font-semibold">
            {(user.name || username).charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h1 className="text-xl font-semibold tracking-tight">
          {user.name || username}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">@{username}</p>
        
        {user.bio && (
          <p className="text-sm text-foreground mt-2 max-w-md">{user.bio}</p>
        )}

        {/* Social Links */}
        <div className="flex items-center gap-3 mt-3">
          {user.x && <XLink handle={user.x} />}
          {user.github && <GitHubLink handle={user.github} />}
          {user.website && <WebsiteLink url={user.website} />}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 text-sm shrink-0">
        <div className="text-center">
          <span className="block text-xl font-semibold">{stats.components}</span>
          <span className="text-xs text-muted-foreground">components</span>
        </div>
        <div className="text-center">
          <span className="block text-xl font-semibold">{stats.followers}</span>
          <span className="text-xs text-muted-foreground">followers</span>
        </div>
      </div>
    </div>
  )
}

function XLink({ handle }: { handle: string }) {
  return (
    <a 
      href={`https://x.com/${handle}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted"
    >
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
      <span>@{handle}</span>
    </a>
  )
}

function GitHubLink({ handle }: { handle: string }) {
  return (
    <a 
      href={`https://github.com/${handle}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted"
    >
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
      <span>@{handle}</span>
    </a>
  )
}

function WebsiteLink({ url }: { url: string }) {
  const display = url.replace(/^https?:\/\//, '').replace(/^www\./, '')
  
  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted"
    >
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
      <span>{display}</span>
    </a>
  )
}
