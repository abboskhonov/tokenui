"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Folder01Icon,
  File01Icon,
  MoreVerticalIcon,
  Delete01Icon,
  Add01Icon,
  Edit01Icon,
  ArrowDown01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

export interface FileNode {
  id: string
  name: string
  path: string
  content: string
  type: "file" | "folder"
  isOpen?: boolean
  children?: FileNode[]
}

interface FileTreeProps {
  files: FileNode[]
  activeFile: string
  onFileSelect: (path: string) => void
  onFilesChange: (files: FileNode[]) => void
}

function getFileIcon(type: "file" | "folder") {
  if (type === "folder") return Folder01Icon
  return File01Icon
}

function FileTreeItem({
  node,
  depth,
  activeFile,
  onSelect,
  onToggle,
  onAddFile,
  onAddFolder,
  onRename,
  onDelete,
}: {
  node: FileNode
  depth: number
  activeFile: string
  onSelect: (path: string) => void
  onToggle: (path: string) => void
  onAddFile: (parentPath: string) => void
  onAddFolder: (parentPath: string) => void
  onRename: (path: string, newName: string) => void
  onDelete: (path: string) => void
}) {
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState(node.name)
  const Icon = getFileIcon(node.type)
  const isActive = node.path === activeFile
  const hasChildren = node.children && node.children.length > 0

  const handleRenameSubmit = () => {
    if (newName && newName !== node.name) {
      onRename(node.path, newName)
    }
    setIsRenaming(false)
  }

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1.5 py-1.5 px-2 rounded-md cursor-pointer group transition-colors",
          isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {/* Expand/Collapse for folders */}
        {node.type === "folder" && hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggle(node.path)
            }}
            className="p-0.5 hover:bg-muted-foreground/20 rounded"
          >
            <HugeiconsIcon
              icon={node.isOpen ? ArrowDown01Icon : ArrowRight01Icon}
              className="size-3.5"
            />
          </button>
        )}
        {node.type === "folder" && !hasChildren && (
          <span className="w-5" />
        )}

        {/* Icon */}
        <HugeiconsIcon
          icon={Icon}
          className={cn(
            "size-4",
            node.type === "folder" && "text-blue-500"
          )}
        />

        {/* Name or Rename Input */}
        {isRenaming ? (
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRenameSubmit()
              if (e.key === "Escape") setIsRenaming(false)
            }}
            className="h-6 py-0 px-1 text-sm"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span
            className="flex-1 text-sm truncate"
            onClick={() => node.type === "file" && onSelect(node.path)}
          >
            {node.name}
          </span>
        )}

        {/* Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <HugeiconsIcon icon={MoreVerticalIcon} className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {node.type === "folder" && (
              <>
                <DropdownMenuItem onClick={() => onAddFile(node.path)}>
                  <HugeiconsIcon icon={Add01Icon} className="mr-2 size-4" />
                  New File
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddFolder(node.path)}>
                  <HugeiconsIcon icon={Folder01Icon} className="mr-2 size-4" />
                  New Folder
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem onClick={() => setIsRenaming(true)}>
              <HugeiconsIcon icon={Edit01Icon} className="mr-2 size-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(node.path)}
              className="text-destructive focus:text-destructive"
            >
              <HugeiconsIcon icon={Delete01Icon} className="mr-2 size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Children */}
      {node.type === "folder" && node.isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem
              key={child.path}
              node={child}
              depth={depth + 1}
              activeFile={activeFile}
              onSelect={onSelect}
              onToggle={onToggle}
              onAddFile={onAddFile}
              onAddFolder={onAddFolder}
              onRename={onRename}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function FileTree({
  files,
  activeFile,
  onFileSelect,
  onFilesChange,
}: FileTreeProps) {
  const [isCreatingFile, setIsCreatingFile] = useState(false)
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [newItemName, setNewItemName] = useState("")

  const updateNode = useCallback(
    (nodes: FileNode[], path: string, updater: (node: FileNode) => FileNode): FileNode[] => {
      return nodes.map((node) => {
        if (node.path === path) {
          return updater(node)
        }
        if (node.children) {
          return {
            ...node,
            children: updateNode(node.children, path, updater),
          }
        }
        return node
      })
    },
    []
  )

  const deleteNode = useCallback(
    (nodes: FileNode[], path: string): FileNode[] => {
      return nodes
        .filter((node) => node.path !== path)
        .map((node) => {
          if (node.children) {
            return {
              ...node,
              children: deleteNode(node.children, path),
            }
          }
          return node
        })
    },
    []
  )

  const addNode = useCallback(
    (nodes: FileNode[], parentPath: string | null, newNode: FileNode): FileNode[] => {
      if (!parentPath) {
        return [...nodes, newNode]
      }

      return nodes.map((node) => {
        if (node.path === parentPath && node.type === "folder") {
          return {
            ...node,
            isOpen: true,
            children: [...(node.children || []), newNode],
          }
        }
        if (node.children) {
          return {
            ...node,
            children: addNode(node.children, parentPath, newNode),
          }
        }
        return node
      })
    },
    []
  )

  const renameNode = useCallback(
    (nodes: FileNode[], path: string, newName: string): FileNode[] => {
      return nodes.map((node) => {
        if (node.path === path) {
          const parentPath = node.path.split("/").slice(0, -1).join("/")
          const newPath = parentPath ? `${parentPath}/${newName}` : newName
          return {
            ...node,
            name: newName,
            path: newPath,
          }
        }
        if (node.children) {
          return {
            ...node,
            children: renameNode(node.children, path, newName),
          }
        }
        return node
      })
    },
    []
  )

  const handleToggle = (path: string) => {
    onFilesChange(
      updateNode(files, path, (node) => ({
        ...node,
        isOpen: !node.isOpen,
      }))
    )
  }

  const handleAddFile = (_parentPath: string | null = null) => {
    setIsCreatingFile(true)
    setIsCreatingFolder(false)
    setNewItemName("")
  }

  const handleAddFolder = (_parentPath: string | null = null) => {
    setIsCreatingFolder(true)
    setIsCreatingFile(false)
    setNewItemName("")
  }

  const handleCreateSubmit = () => {
    if (!newItemName) return

    const newNode: FileNode = {
      id: crypto.randomUUID(),
      name: newItemName,
      path: newItemName,
      content: "",
      type: isCreatingFolder ? "folder" : "file",
      isOpen: isCreatingFolder ? true : undefined,
      children: isCreatingFolder ? [] : undefined,
    }

    onFilesChange(addNode(files, null, newNode))
    setIsCreatingFile(false)
    setIsCreatingFolder(false)
    setNewItemName("")
  }

  const handleRename = (path: string, newName: string) => {
    onFilesChange(renameNode(files, path, newName))
  }

  const handleDelete = (path: string) => {
    onFilesChange(deleteNode(files, path))
    if (activeFile === path && files.length > 0) {
      // Select another file if the active one was deleted
      const findFirstFile = (nodes: FileNode[]): string | null => {
        for (const node of nodes) {
          if (node.type === "file") return node.path
          if (node.children) {
            const found = findFirstFile(node.children)
            if (found) return found
          }
        }
        return null
      }
      const firstFile = findFirstFile(files)
      if (firstFile) onFileSelect(firstFile)
    }
  }

  return (
    <div className="flex flex-col h-full border-r bg-muted/30">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Files
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => handleAddFile()}
            title="New File"
          >
            <HugeiconsIcon icon={Add01Icon} className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => handleAddFolder()}
            title="New Folder"
          >
            <HugeiconsIcon icon={Folder01Icon} className="size-4" />
          </Button>
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto py-2">
        {files.map((node) => (
          <FileTreeItem
            key={node.path}
            node={node}
            depth={0}
            activeFile={activeFile}
            onSelect={onFileSelect}
            onToggle={handleToggle}
            onAddFile={handleAddFile}
            onAddFolder={handleAddFolder}
            onRename={handleRename}
            onDelete={handleDelete}
          />
        ))}

        {/* New File/Folder Input */}
        {(isCreatingFile || isCreatingFolder) && (
          <div
            className="flex items-center gap-1.5 py-1.5 px-2 mx-2 rounded-md bg-accent/50"
            style={{ paddingLeft: "8px" }}
          >
            <HugeiconsIcon
              icon={isCreatingFolder ? Folder01Icon : File01Icon}
              className="size-4"
            />
            <Input
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onBlur={handleCreateSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateSubmit()
                if (e.key === "Escape") {
                  setIsCreatingFile(false)
                  setIsCreatingFolder(false)
                }
              }}
              placeholder={isCreatingFolder ? "folder-name" : "file.md"}
              className="h-6 py-0 px-1 text-sm flex-1"
              autoFocus
            />
          </div>
        )}
      </div>
    </div>
  )
}
