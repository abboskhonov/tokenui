"use client";

import { memo } from "react";
import { Link } from "@tanstack/react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import { CommandLineIcon } from "@hugeicons/core-free-icons";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

/**
 * Navigation - Main site navigation bar
 * Includes logo, nav links, theme toggle, and user menu
 */
export const Navigation = memo(function Navigation() {
  return (
    <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
      <Link to="/" className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background">
          <HugeiconsIcon icon={CommandLineIcon} className="size-4" />
        </div>
        <span className="text-lg font-semibold tracking-tight text-foreground">
          tokenui
        </span>
      </Link>
      
      <div className="flex items-center gap-4">
        <NavLink to="/docs">Docs</NavLink>
        <NavLink to="/publish">Publish</NavLink>
        <ThemeToggle />
        <UserMenu />
      </div>
    </nav>
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
      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
    </Link>
  );
});
