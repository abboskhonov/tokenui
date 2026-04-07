"use client"

import { useState, useMemo } from "react"
import type { Design } from "@/lib/types/design"
import type { FileNode } from "@/features/publish/components/file-tree"
import { FileTree } from "./file-tree-readonly"

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

  // Get content of active file
  const activeContent = useMemo(() => {
    return findFileContent(files, activePath) || ""
  }, [files, activePath])

  return (
    <div className="h-full flex bg-background">
      {/* File Tree Sidebar - FileTree component has its own header */}
      <div className="w-64 border-r border-border bg-muted/30 flex flex-col overflow-hidden">
        <FileTree 
          files={files} 
          activePath={activePath} 
          onSelect={setActivePath}
        />
      </div>

      {/* Code Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* File path header - match exactly with FileTree header (p-3 border-b) */}
        <div className="p-3 border-b border-border bg-muted/50 flex items-center shrink-0">
          <span className="text-xs font-medium text-muted-foreground font-mono">{activePath}</span>
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