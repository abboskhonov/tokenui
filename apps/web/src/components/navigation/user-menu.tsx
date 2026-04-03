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
  Layers01Icon,
  Logout01Icon,
  Settings01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";

/**
 * UserMenu - Displays user avatar dropdown with profile, studio, settings, logout
 */
export const UserMenu = memo(function UserMenu() {
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
          <Link to="/studio">
            <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
              <HugeiconsIcon icon={Layers01Icon} className="size-4" />
              Studio
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            className="gap-2 text-sm"
            onClick={() => setSettingsOpen(true)}
          >
            <HugeiconsIcon icon={Settings01Icon} className="size-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
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
