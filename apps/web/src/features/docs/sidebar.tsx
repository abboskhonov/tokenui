"use client"

import { Link, useLocation } from "@tanstack/react-router"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Introduction", to: "/docs" },
  { label: "Installing Skills", to: "/docs/installing" },
  { label: "Publishing Skills", to: "/docs/publishing" },
]

export function DocsSidebar() {
  const { pathname } = useLocation()

  return (
    <nav className="space-y-1">
      <div className="mb-6 px-3">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
          Documentation
        </p>
      </div>
      
      <div className="space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.to || (item.to !== "/docs" && pathname.startsWith(item.to))
          return (
            <Link
              key={item.label}
              to={item.to}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm transition-all",
                isActive
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
