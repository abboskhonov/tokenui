"use client";

import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import { cn } from "@/lib/utils";
import { GithubIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

// Query keys for GitHub stars
const githubKeys = {
  all: ["github"] as const,
  stars: () => [...githubKeys.all, "stars"] as const,
};

interface GitHubRepoResponse {
  stargazers_count: number;
}

// Fetch GitHub stars
async function fetchGitHubStars(): Promise<number> {
  const response = await fetch("https://api.github.com/repos/abboskhonov/tasteui");
  if (!response.ok) {
    throw new Error("Failed to fetch GitHub stars");
  }
  const data: GitHubRepoResponse = await response.json();
  return data.stargazers_count;
}

// Hook to get GitHub stars using TanStack Query
function useGitHubStars() {
  return useQuery({
    queryKey: githubKeys.stars(),
    queryFn: fetchGitHubStars,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
  });
}

/**
 * Navigation - Main site navigation bar
 * Fixed positioning to stay at top of viewport
 */
export const Navigation = memo(function Navigation() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 supports-backdrop-filter:backdrop-blur-xl">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-16 xl:px-20">
        <nav className="relative z-10 flex items-center justify-between py-3">
          {/* Left Side - Logo + Navigation */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <img
                key="logo-static"
                src="/logo.webp"
                alt="TasteUI"
                className="h-7 w-7 rounded-lg object-cover"
                loading="eager"
                decoding="async"
              />
              <span className="text-lg font-semibold tracking-tight text-foreground">
                tasteui
              </span>
            </Link>

            {/* Navigation Links - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink to="/docs">Docs</NavLink>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            <GitHubStars />
            <ThemeToggle />
            <UserMenu />
          </div>
        </nav>
      </div>
    </header>
  );
});

/**
 * NavLink - Individual navigation link component
 */
interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  isActive?: boolean;
}

const NavLink = memo(function NavLink({ to, children }: NavLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        "px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground rounded-md hover:bg-muted/50"
      )}
    >
      {children}
    </Link>
  );
});

/**
 * GitHubStars - Displays GitHub star count
 * Uses TanStack Query for caching across route changes
 */
const GitHubStars = memo(function GitHubStars() {
  const { data: stars, isLoading } = useGitHubStars();

  return (
    <a
      href="https://github.com/abboskhonov/tasteui"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-1.5 px-2 py-1.5 text-sm text-muted-foreground",
        "transition-colors hover:text-foreground rounded-md hover:bg-muted/50"
      )}
    >
      <HugeiconsIcon icon={GithubIcon} className="size-4" />
      {stars !== undefined && !isLoading && (
        <span className="font-medium tabular-nums">{stars}</span>
      )}
    </a>
  );
});
