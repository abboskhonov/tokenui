"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Moon02Icon, Sun01Icon } from "@hugeicons/core-free-icons"

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark")

  useEffect(() => {
    const root = window.document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [theme])

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-muted-foreground hover:text-foreground"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      <HugeiconsIcon 
        icon={theme === "dark" ? Sun01Icon : Moon02Icon} 
        className="size-4" 
      />
    </Button>
  )
}
