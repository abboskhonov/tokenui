"use client";

import { useState, useCallback, memo, useRef, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  PenTool01Icon,
  Upload04Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

// Module-level cache for avatar images to persist across route changes
const imageCache = new Map<string, string>();

/**
 * CachedAvatar - Avatar component that prevents image refetching on navigation
 * Uses a cached image element that persists across React re-mounts
 */
const CachedAvatar = memo(function CachedAvatar({
  src,
  alt,
  fallback,
}: {
  src: string | null | undefined;
  alt: string;
  fallback: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(() => !!src && imageCache.has(src));
  const currentSrc = src || "";

  useEffect(() => {
    if (!containerRef.current || !currentSrc) return;
    
    // Check if we already have a cached image for this URL
    const cachedImage = imageCache.get(currentSrc);
    
    if (cachedImage) {
      // If cached, set it immediately
      containerRef.current.innerHTML = cachedImage;
      setIsLoaded(true);
    } else {
      // Create new image element
      const img = document.createElement("img");
      img.src = currentSrc;
      img.alt = alt;
      img.className = "aspect-square size-full rounded-full object-cover";
      img.loading = "eager";
      img.decoding = "async";
      
      img.onload = () => {
        if (containerRef.current) {
          // Store the image HTML in cache
          const wrapper = document.createElement("div");
          wrapper.appendChild(img.cloneNode(true));
          imageCache.set(currentSrc, wrapper.innerHTML);
          setIsLoaded(true);
        }
      };
      
      img.onerror = () => {
        setIsLoaded(false);
      };
      
      // Clear and append
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(img);
      }
    }
  }, [currentSrc, alt]);

  if (!currentSrc) {
    return <>{fallback}</>;
  }

  return (
    <>
      <div 
        ref={containerRef}
        className={cn(
          "aspect-square size-full rounded-full object-cover transition-opacity duration-150",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        aria-label={alt}
      />
      {!isLoaded && fallback}
    </>
  );
});

/**
 * UserMenu - Displays user avatar dropdown with profile, settings, logout
 */
export const UserMenu = memo(function UserMenu() {
  const { user, isLoading } = useUser();
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

  // Show skeleton while loading to prevent flash of "Sign in" button
  if (isLoading) {
    return (
      <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
    );
  }

  if (!user) {
    return (
      <Link to="/login">
        <Button
          variant="default"
          size="sm"
          className="h-8 px-4 text-sm font-medium bg-foreground text-background hover:bg-foreground/90"
        >
          Sign in
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
                <CachedAvatar 
                  src={user.image} 
                  alt={user.name || "User"}
                  fallback={
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  }
                />
              </Avatar>
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-52">
          {/* User Info */}
          <div className="px-3 py-2.5 border-b">
            <p className="text-sm font-medium">{user.name || "User"}</p>
            <p className="text-xs text-muted-foreground font-medium">
              @{user.username || "user"}
            </p>
          </div>
          
          {/* Menu Items */}
          <DropdownMenuItem 
            className="gap-2 px-3 py-1.5 text-sm cursor-pointer mt-1"
            onClick={handleProfileClick}
          >
            <HugeiconsIcon icon={UserIcon} className="size-4" />
            Profile
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="gap-2 px-3 py-1.5 text-sm cursor-pointer"
            onClick={() => navigate({ to: "/bookmarks" })}
          >
            <HugeiconsIcon icon={Bookmark01Icon} className="size-4" />
            Saved
          </DropdownMenuItem>
          
          <DropdownMenuItem
            className="gap-2 px-3 py-1.5 text-sm cursor-pointer"
            onClick={() => setSettingsOpen(true)}
          >
            <HugeiconsIcon icon={Settings01Icon} className="size-4" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuItem 
            className="gap-2 px-3 py-1.5 text-sm cursor-pointer"
            onClick={() => navigate({ to: "/studio" })}
          >
            <HugeiconsIcon icon={PenTool01Icon} className="size-4" />
            Studio
          </DropdownMenuItem>

          <DropdownMenuItem 
            className="gap-2 px-3 py-1.5 text-sm cursor-pointer"
            onClick={() => navigate({ to: "/publish" })}
          >
            <HugeiconsIcon icon={Upload04Icon} className="size-4" />
            Publish
          </DropdownMenuItem>
          
          {user?.role === "admin" && (
            <DropdownMenuItem 
              className="gap-2 px-3 py-1.5 text-sm cursor-pointer text-primary"
              onClick={() => navigate({ to: "/admin" })}
            >
              <HugeiconsIcon icon={Shield02Icon} className="size-4" />
              Admin
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            className="gap-2 px-3 py-1.5 text-sm cursor-pointer"
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
