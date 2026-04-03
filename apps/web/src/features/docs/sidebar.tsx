"use client"

import { Link, useLocation } from "@tanstack/react-router"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Overview", to: "/docs" },
  { label: "CLI", to: "/docs/cli" },
  { label: "FAQ", to: "/docs/faq" },
]

export function DocsSidebar() {
  const { pathname } = useLocation()

  return (
    <aside className="w-[200px] shrink-0 hidden md:block">
      <nav className="sticky top-20 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.to || (item.to !== "/docs" && pathname.startsWith(item.to))
          return (
            <Link
              key={item.label}
              to={item.to}
              className={cn(
                "block px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
