"use client"

import { useState, useMemo } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Folder01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"
import type { Design } from "@/lib/types/design"
import type { FileNode } from "@/features/publish/components/file-tree"
import { FileTree } from "./file-tree-readonly"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CodeViewProps {
  design: Design
}

export function CodeView({
  design,
}: CodeViewProps) {
  // Build file tree from design
  const files = useMemo(() => {
    if (design.files && design.files.length > 0) {
      return design.files
    }
    // Single file fallback - create a simple tree with just SKILL.md
    return [
      {
        id: "skill-md",
        name: "SKILL.md",
        path: "SKILL.md",
        content: design.content,
        type: "file" as const,
      },
    ]
  }, [design.files, design.content])

  // Set default active file to SKILL.md or first file
  const [activePath, setActivePath] = useState(() => {
    const allPaths = getAllFilePaths(files)
    const skillMdPath = allPaths.find((p) => p.endsWith("SKILL.md"))
    return skillMdPath || allPaths[0] || "SKILL.md"
  })

  // Mobile file tree visibility
  const [isMobileFileTreeOpen, setIsMobileFileTreeOpen] = useState(false)

  // Get content of active file
  const activeContent = useMemo(() => {
    return findFileContent(files, activePath) || ""
  }, [files, activePath])

  // Handle file selection on mobile - close the drawer after selection
  const handleFileSelect = (path: string) => {
    setActivePath(path)
    setIsMobileFileTreeOpen(false)
  }

  return (
    <div className="h-full flex flex-col md:flex-row bg-background">
      {/* Mobile File Tree Drawer Overlay */}
      {isMobileFileTreeOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileFileTreeOpen(false)}
        />
      )}

      {/* File Tree Sidebar */}
      <div 
        className={cn(
          "border-r border-border bg-muted/30 flex flex-col overflow-hidden transition-transform duration-200 ease-in-out",
          // Desktop: always visible, fixed width
          "hidden md:flex md:w-64",
          // Mobile: slide in from left when open
          "fixed md:static left-0 top-[48px] bottom-0 z-50 w-[280px]",
          isMobileFileTreeOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between p-3 border-b border-border md:hidden">
          <span className="text-xs font-medium text-muted-foreground">Files</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setIsMobileFileTreeOpen(false)}
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
          </Button>
        </div>
        <FileTree 
          files={files} 
          activePath={activePath} 
          onSelect={handleFileSelect}
        />
      </div>

      {/* Code Editor */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* File path header */}
        <div className="p-3 border-b border-border bg-muted/50 flex items-center gap-2 shrink-0">
          {/* Mobile file tree toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 px-2 md:hidden"
            onClick={() => setIsMobileFileTreeOpen(true)}
          >
            <HugeiconsIcon icon={Folder01Icon} className="size-3.5" />
            <span className="text-xs">Files</span>
          </Button>
          <span className="text-xs font-medium text-muted-foreground font-mono truncate">{activePath}</span>
        </div>
        
        {/* Code content */}
        <div className="flex-1 overflow-auto bg-background">
          <pre className="p-4 text-sm font-mono text-foreground/90 whitespace-pre-wrap leading-relaxed">
            {activeContent || "// No code available"}
          </pre>
        </div>
      </div>
    </div>
  )
}

// Helper to get all file paths
function getAllFilePaths(files: FileNode[]): string[] {
  const paths: string[] = []
  
  function traverse(nodes: FileNode[]) {
    for (const node of nodes) {
      if (node.type === "file") {
        paths.push(node.path)
      }
      if (node.children) {
        traverse(node.children)
      }
    }
  }
  
  traverse(files)
  return paths
}

// Helper to find file content by path
function findFileContent(files: FileNode[], path: string): string | null {
  for (const node of files) {
    if (node.path === path && node.type === "file") {
      return node.content
    }
    if (node.children) {
      const found = findFileContent(node.children, path)
      if (found) return found
    }
  }
  return null
}