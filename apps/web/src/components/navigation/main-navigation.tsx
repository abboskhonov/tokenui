"use client";

import { memo } from "react";
import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import { cn } from "@/lib/utils";

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
                src="/logo.webp"
                alt="TokenUI"
                className="h-7 w-7 rounded-lg object-cover"
              />
              <span className="text-lg font-semibold tracking-tight text-foreground">
                tokenui
              </span>
            </Link>

            {/* Navigation Links - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-1">
              <NavLink to="/docs">Docs</NavLink>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
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
