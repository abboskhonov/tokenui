"use client"

import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="flex items-center justify-between border-t border-border/50 py-8">
      <p className="text-xs text-muted-foreground">
        Built for the open agent ecosystem
      </p>
      <Button variant="outline" size="sm" className="border-border/50">
        Open docs
      </Button>
    </footer>
  )
}
