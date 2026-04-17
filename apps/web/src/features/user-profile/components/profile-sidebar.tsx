"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Copy01Icon,
  Linkedin01Icon,
  NewTwitterIcon,
  RedditIcon,
  Share08Icon,
  TelegramIcon,
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"
import type { UserProfile, UserStats } from "@/lib/queries/users"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ProfileSidebarProps {
  user: UserProfile
  username: string
  stats: UserStats
}

export function ProfileSidebar({ user, username, stats }: ProfileSidebarProps) {
  const [showAvatarOverlay, setShowAvatarOverlay] = useState(false)
  const displayName = user.name || username

  return (
    <>
      <aside className="w-full lg:w-[296px] shrink-0">
        {/* Avatar - Large like GitHub */}
        <div className="mb-4">
          <button
            onClick={() => user.image && setShowAvatarOverlay(true)}
            className="relative group cursor-pointer"
            aria-label={`View ${displayName}'s profile picture`}
          >
            {user.image ? (
              <img
                src={user.image}
                alt={displayName}
                className="h-[296px] w-[296px] rounded-full object-cover ring-1 ring-border shadow-sm"
              />
            ) : (
              <div className="h-[296px] w-[296px] rounded-full bg-gradient-to-br from-brand to-brand/70 flex items-center justify-center text-primary-foreground text-8xl font-semibold shadow-sm">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            {/* Hover overlay */}
            {user.image && (
              <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-colors" />
            )}
          </button>
        </div>

        {/* Name & Username */}
        <div className="mb-4">
          <h1 className="text-[26px] font-bold leading-tight">
            {displayName}
          </h1>
          <p className="text-xl text-muted-foreground font-light">
            {username}
          </p>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-base text-foreground mb-4 leading-relaxed">
            {user.bio}
          </p>
        )}

        {/* Share Button */}
        <div className="mb-6">
          <ShareButton username={username} user={user} />
        </div>

        {/* Social Links */}
        <div className="flex flex-col gap-2 mb-6">
          {user.x && <XLink handle={user.x} />}
          {user.github && <GitHubLink handle={user.github} />}
          {user.website && <WebsiteLink url={user.website} />}
        </div>

        {/* Stats - Like GitHub */}
        <div className="flex items-center gap-4 text-sm">
          <a 
            href="#" 
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <UsersIcon className="size-4" />
            <span className="font-semibold text-foreground">{stats.followers}</span>
            <span>followers</span>
          </a>
          <span className="text-muted-foreground">·</span>
          <a 
            href="#" 
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="font-semibold text-foreground">{stats.components}</span>
            <span>skills</span>
          </a>
        </div>
      </aside>

      {/* Avatar Overlay Dialog */}
      <Dialog open={showAvatarOverlay} onOpenChange={setShowAvatarOverlay}>
        <DialogContent className="max-w-lg p-0 bg-background/95 backdrop-blur-xl border-0 overflow-hidden">
          <DialogTitle className="sr-only">
            {displayName}&apos;s Profile Picture
          </DialogTitle>
          {user.image && (
            <img
              src={user.image}
              alt={displayName}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
}

function XLink({ handle }: { handle: string }) {
  return (
    <a 
      href={`https://x.com/${handle}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-brand transition-colors"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
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
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
      <span>@{handle}</span>
    </a>
  )
}

function WebsiteLink({ url }: { url: string }) {
  const display = url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-brand transition-colors"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
      <span>{display}</span>
    </a>
  )
}

function ShareButton({ username, user }: { username: string; user: UserProfile }) {
  const profileUrl = `https://tasteui.dev/u/${username}`
  const displayName = user.name || username
  const shareText = `Check out ${displayName}'s profile on tasteui`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
      toast.success("Link copied to clipboard")
    } catch {
      toast.error("Failed to copy link")
    }
  }

  const handleShareX = () => {
    const text = encodeURIComponent(shareText)
    const url = encodeURIComponent(profileUrl)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer')
  }

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(profileUrl)
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener,noreferrer')
  }

  const handleShareTelegram = () => {
    const text = encodeURIComponent(shareText)
    const url = encodeURIComponent(profileUrl)
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank', 'noopener,noreferrer')
  }

  const handleShareReddit = () => {
    const title = encodeURIComponent(shareText)
    const url = encodeURIComponent(profileUrl)
    window.open(`https://www.reddit.com/submit?title=${title}&url=${url}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" className="w-full gap-2">
            <HugeiconsIcon icon={Share08Icon} strokeWidth={2} className="size-4" />
            <span>Share</span>
          </Button>
        }
      />
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem onClick={handleCopyLink}>
          <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} className="size-4 mr-2" />
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShareX}>
          <HugeiconsIcon icon={NewTwitterIcon} strokeWidth={2} className="size-4 mr-2" />
          Share on X
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShareLinkedIn}>
          <HugeiconsIcon icon={Linkedin01Icon} strokeWidth={2} className="size-4 mr-2" />
          LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShareTelegram}>
          <HugeiconsIcon icon={TelegramIcon} strokeWidth={2} className="size-4 mr-2" />
          Telegram
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShareReddit}>
          <HugeiconsIcon icon={RedditIcon} strokeWidth={2} className="size-4 mr-2" />
          Reddit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
