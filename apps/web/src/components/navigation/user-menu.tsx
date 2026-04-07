"use client";

import { useState, useCallback, memo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/lib/user-context";
import { signOut } from "@/lib/auth-client";
import { SettingsDialog } from "@/components/settings/settings-dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Bookmark01Icon,
  Logout01Icon,
  Settings01Icon,
  UserIcon,
  Shield02Icon,
  File01Icon,
  Edit01Icon,
  CodeIcon,
} from "@hugeicons/core-free-icons";

interface UserMenuProps {
  stars?: number;
}

/**
 * UserMenu - Displays user avatar dropdown with profile, settings, logout
 */
export const UserMenu = memo(function UserMenu({ stars }: UserMenuProps) {
  const { user } = useUser();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = useCallback(async () => {
    await signOut();
    window.location.reload();
  }, []);

  const handleProfileClick = useCallback(() => {
    const username = user?.username || user?.email?.split("@")[0] || "user";
    navigate({ to: "/u/$username", params: { username } });
  }, [user, navigate]);

  if (!user) {
    return (
      <Link to="/login">
        <Button
          variant="ghost"
          className="h-8 px-3 gap-2 text-xs font-medium hover:bg-muted/50"
        >
          <HugeiconsIcon icon={UserIcon} className="size-4" />
          <span className="hidden sm:inline">Login</span>
        </Button>
      </Link>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className="h-8 w-8 rounded-full p-0 hover:bg-muted/50"
            >
              <Avatar className="h-7 w-7">
                <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem 
            className="gap-2 text-sm cursor-pointer"
            onClick={handleProfileClick}
          >
            <HugeiconsIcon icon={UserIcon} className="size-4" />
            Profile
          </DropdownMenuItem>
          <Link to="/bookmarks">
            <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
              <HugeiconsIcon icon={Bookmark01Icon} className="size-4" />
              Saved
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            className="gap-2 text-sm"
            onClick={() => setSettingsOpen(true)}
          >
            <HugeiconsIcon icon={Settings01Icon} className="size-4" />
            Settings
          </DropdownMenuItem>
          
          {/* Admin Link - Only visible for admins */}
          {user?.role === "admin" && (
            <Link to="/admin">
              <DropdownMenuItem className="gap-2 text-sm cursor-pointer text-primary">
                <HugeiconsIcon icon={Shield02Icon} className="size-4" />
                Admin Panel
              </DropdownMenuItem>
            </Link>
          )}
          
          <DropdownMenuSeparator />
          
          {/* Mobile Navigation Links - Only visible on small screens */}
          <div className="md:hidden">
            <Link to="/docs">
              <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
                <HugeiconsIcon icon={File01Icon} className="size-4" />
                Docs
              </DropdownMenuItem>
            </Link>
            <Link to="/studio">
              <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
                <HugeiconsIcon icon={Edit01Icon} className="size-4" />
                Studio
              </DropdownMenuItem>
            </Link>
            <Link to="/publish">
              <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
                <HugeiconsIcon icon={CodeIcon} className="size-4" />
                Publish
              </DropdownMenuItem>
            </Link>
            <a
              href="https://github.com/abboskhonov/tokenui"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-4"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub{stars !== undefined && ` ${formatStarCount(stars)}`}
              </DropdownMenuItem>
            </a>
            <DropdownMenuSeparator />
          </div>
          
          <DropdownMenuItem
            className="gap-2 text-sm text-destructive"
            onClick={handleSignOut}
          >
            <HugeiconsIcon icon={Logout01Icon} className="size-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
});

/**
 * Format star count to compact notation (e.g., 5700 -> 5.7k)
 */
function formatStarCount(count: number): string {
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return count.toString();
}
