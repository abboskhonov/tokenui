"use client"

import { useState } from "react"
import {
  CaretRight,
  File,
  Folder,
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import type { FileNode } from "@/features/publish/components/file-tree"

interface FileTreeProps {
  files: Array<FileNode>
  activePath: string
  onSelect: (path: string) => void
}

interface FileTreeItemProps {
  node: FileNode
  depth: number
  activePath: string
  onSelect: (path: string) => void
  onToggle: (path: string) => void
}

function FileTreeItem({
  node,
  depth,
  activePath,
  onSelect,
  onToggle,
}: FileTreeItemProps) {
  const isActive = node.path === activePath
  const isFolder = node.type === "folder"

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 py-1.5 px-2 cursor-pointer",
          isActive && "bg-accent text-accent-foreground",
          !isActive && "hover:bg-muted/50"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => {
          isFolder ? onToggle(node.path) : onSelect(node.path)
        }}
      >
        {isFolder && (
          <CaretRight
            weight="bold"
            className={cn(
              "size-3.5 text-muted-foreground transition-transform",
              node.isOpen && "rotate-90"
            )}
          />
        )}
        {isFolder ? (
          <Folder weight="fill" className="size-4 text-blue-500" />
        ) : (
          <File weight="fill" className="size-4 text-slate-400" />
        )}
        
        <span className="flex-1 text-sm truncate">{node.name}</span>
      </div>

      {isFolder && node.isOpen && node.children?.map((child) => (
        <FileTreeItem
          key={child.path}
          node={child}
          depth={depth + 1}
          activePath={activePath}
          onSelect={onSelect}
          onToggle={onToggle}
        />
      ))}
    </div>
  )
}

export function FileTree({ files, activePath, onSelect }: FileTreeProps) {
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set())

  const handleToggle = (path: string) => {
    setOpenFolders((prev) => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }

  // Merge open state with file tree data
  const filesWithOpenState = (nodes: FileNode[]): FileNode[] => {
    return nodes.map((node) => ({
      ...node,
      isOpen: node.type === "folder" ? openFolders.has(node.path) : undefined,
      children: node.children ? filesWithOpenState(node.children) : undefined,
    }))
  }

  const displayFiles = filesWithOpenState(files)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Files</span>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto py-2">
        {displayFiles.map((node) => (
          <FileTreeItem
            key={node.path}
            node={node}
            depth={0}
            activePath={activePath}
            onSelect={onSelect}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  )
}