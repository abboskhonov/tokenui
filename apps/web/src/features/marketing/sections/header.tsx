"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser } from "@/lib/user-context"
import { signOut } from "@/lib/auth-client"
import { SettingsDialog } from "@/components/settings/settings-dialog"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CommandLineIcon,
  Logout01Icon,
  Settings01Icon,
  UserIcon,
  Sun01Icon,
  Moon01Icon,
} from "@hugeicons/core-free-icons"

// Theme Toggle Component
function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark")

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
  }, [theme])

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <HugeiconsIcon
        icon={theme === "dark" ? Sun01Icon : Moon01Icon}
        className="size-4"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

function UserMenu() {
  // Use SSR user data from context instead of client-side hook
  const { user } = useUser()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const navigate = useNavigate()

  if (!user) {
    return (
      <Link to="/login">
        <Button
          variant="ghost"
          className="h-8 px-3 gap-2 text-xs font-medium hover:bg-muted/20"
        >
          <HugeiconsIcon icon={UserIcon} className="size-4" />
          <span className="hidden sm:inline">Login</span>
        </Button>
      </Link>
    )
  }

  const handleProfileClick = () => {
    const username = user.username || user.email?.split("@")[0] || "user"
    navigate({ to: "/u/$username", params: { username } })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className="h-8 px-2 gap-2 justify-start hover:bg-muted/20"
            >
              <Avatar className="h-7 w-7 rounded-full">
                <AvatarImage
                  src={user.image || ""}
                  alt={user.name || "User"}
                />
                <AvatarFallback className="bg-primary/20 text-primary text-xs rounded-full">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-52">
          {/* User Info */}
          <div className="px-3 py-2.5 border-b">
            <p className="text-sm font-medium">{user.name || "User"}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          
          <DropdownMenuItem 
            className="gap-2 px-3 py-1.5 text-sm cursor-pointer"
            onClick={handleProfileClick}
          >
            <HugeiconsIcon icon={UserIcon} className="size-4" />
            Profile
          </DropdownMenuItem>
          
          <DropdownMenuItem
            className="gap-2 px-3 py-1.5 text-sm cursor-pointer"
            onClick={() => setSettingsOpen(true)}
          >
            <HugeiconsIcon icon={Settings01Icon} className="size-4" />
            Settings
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            className="gap-2 px-3 py-1.5 text-sm cursor-pointer"
            onClick={async () => {
              await signOut()
              window.location.reload()
            }}
          >
            <HugeiconsIcon icon={Logout01Icon} className="size-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border w-full">
      <div className="mx-auto w-full max-w-[1600px] flex items-center justify-between py-3 px-6 md:px-12 lg:px-16 xl:px-20">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-foreground text-background">
            <HugeiconsIcon icon={CommandLineIcon} className="size-4" />
          </div>
          <span className="text-base font-semibold text-foreground tracking-tight">
            tokenui
          </span>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          <Link 
            to="/docs" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors mr-2"
          >
            Docs
          </Link>
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
