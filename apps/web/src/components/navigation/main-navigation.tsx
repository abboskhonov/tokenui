"use client";

import { memo } from "react";
import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import { useGitHubStars } from "@/lib/queries/github";

/**
 * Navigation - Main site navigation bar
 * Includes logo, nav links, theme toggle, and user menu
 */
export const Navigation = memo(function Navigation() {
  const { data: stars } = useGitHubStars("abboskhonov/tokenui");

  return (
    <div className="sticky top-0 z-50 bg-background border-b border-border">
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo.webp"
            alt="TokenUI"
            className="h-7 w-7 rounded-lg object-cover"
          />
          <span className="text-lg font-semibold tracking-tight text-foreground">
            tokenui
          </span>
        </Link>
        
        <div className="flex items-center gap-1">
          {/* Desktop Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/docs">Docs</NavLink>
            <NavLink to="/studio">Studio</NavLink>
            <NavLink to="/publish">Publish</NavLink>
            
            <div className="mx-2 h-4 w-px bg-border" />
            
            {/* GitHub Repo Link with Stars */}
            <a
              href="https://github.com/abboskhonov/tokenui"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground rounded-md hover:bg-muted/50"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4"
                aria-label="GitHub"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              {stars !== undefined && (
                <span>{formatStarCount(stars)}</span>
              )}
            </a>
            
            <div className="mx-1" />
          </div>
          
          <ThemeToggle />
          <UserMenu stars={stars} />
        </div>
      </nav>
    </div>
  );
});

/**
 * NavLink - Individual navigation link component
 */
interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

const NavLink = memo(function NavLink({ to, children }: NavLinkProps) {
  return (
    <Link
      to={to}
      className="px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground rounded-md hover:bg-muted/50"
    >
      {children}
    </Link>
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
