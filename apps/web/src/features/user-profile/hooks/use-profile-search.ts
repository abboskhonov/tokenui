import { useState, useMemo, useEffect } from "react"
import type { Design } from "@/lib/types/design"

export function useProfileSearch(designs: Design[]) {
  const [searchQuery, setSearchQuery] = useState("")

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        const target = e.target as HTMLElement
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return
        
        e.preventDefault()
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const filteredDesigns = useMemo(() => {
    if (!searchQuery.trim()) return designs
    
    const query = searchQuery.toLowerCase()
    return designs.filter(d => 
      d.name.toLowerCase().includes(query) ||
      (d.description?.toLowerCase() || "").includes(query)
    )
  }, [designs, searchQuery])

  return {
    searchQuery,
    setSearchQuery,
    filteredDesigns
  }
}
