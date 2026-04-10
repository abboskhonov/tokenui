"use client"

import { useEffect, useRef, useState } from "react"
import {
  CaretRight,
  File,
  FilePlus,
  Folder,
  FolderPlus,
  PencilSimple,
  Trash,
} from "@phosphor-icons/react"
import {
  addFileToFolder,
  addFolderToFolder,
  deleteNode,
  getAllFilePaths,
  pathExists,
  updateNode,
} from "./file-tree"
import type { FileNode } from "./file-tree"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface FileTreeProps {
  files: Array<FileNode>
  activePath: string
  onSelect: (path: string) => void
  onFilesChange: (files: Array<FileNode>) => void
}

interface FileTreeItemProps {
  node: FileNode
  depth: number
  activePath: string
  editingPath: string | null
  onSelect: (path: string) => void
  onToggle: (path: string) => void
  onDelete: (path: string) => void
  onRename: (path: string, newName: string) => void
  onStartRename: (path: string) => void
  onCancelEdit: () => void
}

function FileTreeItem({
  node,
  depth,
  activePath,
  editingPath,
  onSelect,
  onToggle,
  onDelete,
  onRename,
  onStartRename,
  onCancelEdit,
}: FileTreeItemProps) {
  const isActive = node.path === activePath
  const isFolder = node.type === "folder"
  const isEditing = editingPath === node.path
  const [editValue, setEditValue] = useState(node.name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSubmit = () => {
    if (editValue.trim() && editValue !== node.name) {
      onRename(node.path, editValue.trim())
    } else {
      onCancelEdit()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit()
    } else if (e.key === "Escape") {
      onCancelEdit()
    }
  }

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 py-1.5 px-2 cursor-pointer group",
          isActive && !isEditing && "bg-accent text-accent-foreground",
          !isActive && !isEditing && "hover:bg-muted/50"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => {
          if (!isEditing) {
            isFolder ? onToggle(node.path) : onSelect(node.path)
          }
        }}
        onDoubleClick={() => {
          if (!isEditing) {
            onStartRename(node.path)
          }
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
        
        {isEditing ? (
          <Input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={handleKeyDown}
            className="h-5 py-0 px-1 text-sm flex-1"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="flex-1 text-sm truncate">{node.name}</span>
        )}

        {!isEditing && (
          <div className="flex items-center gap-0.5">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onStartRename(node.path)
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-primary/10 rounded"
              title="Rename"
            >
              <PencilSimple weight="bold" className="size-3.5 text-muted-foreground" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(node.path)
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded"
              title="Delete"
            >
              <Trash weight="bold" className="size-3.5 text-destructive" />
            </button>
          </div>
        )}
      </div>

      {isFolder && node.isOpen && node.children?.map((child) => (
        <FileTreeItem
          key={child.path}
          node={child}
          depth={depth + 1}
          activePath={activePath}
          editingPath={editingPath}
          onSelect={onSelect}
          onToggle={onToggle}
          onDelete={onDelete}
          onRename={onRename}
          onStartRename={onStartRename}
          onCancelEdit={onCancelEdit}
        />
      ))}
    </div>
  )
}

// Generate unique name
function generateUniqueName(files: Array<FileNode>, folderPath: string | null, isFolder: boolean): string {
  const baseName = isFolder ? "new-folder" : "new-file"
  let counter = 1
  let name = baseName
  
  while (pathExists(files, folderPath ? `${folderPath}/${name}` : name)) {
    name = `${baseName}-${counter}`
    counter++
  }
  
  return name
}

export function FileTree({ files, activePath, onSelect, onFilesChange }: FileTreeProps) {
  const [editingPath, setEditingPath] = useState<string | null>(null)

  const handleStartRename = (path: string) => {
    setEditingPath(path)
  }

  const handleToggle = (path: string) => {
    onFilesChange(updateNode(files, path, (n) => ({ ...n, isOpen: !n.isOpen })))
  }

  const handleDelete = (path: string) => {
    onFilesChange(deleteNode(files, path))
    if (activePath === path) {
      const firstFilePath = getAllFilePaths(files).find((p) => 
        !pathExists([{ id: "", name: "", path: p, content: "", type: "folder" }], p)
      )
      if (firstFilePath && firstFilePath !== path) {
        onSelect(firstFilePath)
      } else {
        onSelect("SKILL.md")
      }
    }
  }

  const handleRename = (oldPath: string, newName: string) => {
    // Build new path
    const parentPath = oldPath.includes("/") 
      ? oldPath.substring(0, oldPath.lastIndexOf("/")) 
      : ""
    const newPath = parentPath ? `${parentPath}/${newName}` : newName

    // Check for conflicts
    if (pathExists(files, newPath) && oldPath !== newPath) {
      setEditingPath(null)
      return
    }

    // Update the node
    const updateNodeRecursive = (nodes: Array<FileNode>): Array<FileNode> => {
      return nodes.map((node) => {
        if (node.path === oldPath) {
          // Update this node
          const updated: FileNode = {
            ...node,
            name: newName,
            path: newPath,
          }
          // Update children paths if folder
          if (node.children) {
            updated.children = node.children.map((child) => ({
              ...child,
              path: child.path.replace(oldPath, newPath),
            }))
          }
          return updated
        }
        if (node.children) {
          return { ...node, children: updateNodeRecursive(node.children) }
        }
        return node
      })
    }

    onFilesChange(updateNodeRecursive(files))
    if (activePath === oldPath) {
      onSelect(newPath)
    }
    setEditingPath(null)
  }

  const handleAdd = (isFolder: boolean) => {
    // Find which folder is currently selected or expanded, or use root
    let targetFolder: string | null = null
    
    // Check if active file's parent is a good target
    if (activePath.includes("/")) {
      targetFolder = activePath.substring(0, activePath.lastIndexOf("/"))
    }
    
    // Find first open folder as fallback
    if (!targetFolder) {
      const findOpenFolder = (nodes: Array<FileNode>): string | null => {
        for (const node of nodes) {
          if (node.type === "folder" && node.isOpen) {
            return node.path
          }
          if (node.children) {
            const found = findOpenFolder(node.children)
            if (found) return found
          }
        }
        return null
      }
      targetFolder = findOpenFolder(files)
    }

    const name = generateUniqueName(files, targetFolder, isFolder)
    const fullPath = targetFolder ? `${targetFolder}/${name}` : name

    if (isFolder) {
      const newFolder: FileNode = {
        id: crypto.randomUUID(),
        name,
        path: fullPath,
        content: "",
        type: "folder",
        isOpen: true,
        children: [],
      }
      onFilesChange(addFolderToFolder(files, targetFolder, newFolder))
    } else {
      const newFile: FileNode = {
        id: crypto.randomUUID(),
        name,
        path: fullPath,
        content: "",
        type: "file",
      }
      onFilesChange(addFileToFolder(files, targetFolder, newFile))
      onSelect(fullPath)
    }

    // Start editing the new item
    setEditingPath(fullPath)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header - matches code-view header styling */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Files</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleAdd(false)}
            className="p-1.5 hover:bg-muted rounded transition-colors"
            title="New file"
          >
            <FilePlus weight="bold" className="size-4" />
          </button>
          <button
            onClick={() => handleAdd(true)}
            className="p-1.5 hover:bg-muted rounded transition-colors"
            title="New folder"
          >
            <FolderPlus weight="bold" className="size-4" />
          </button>
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto py-2">
        {files.map((node) => (
          <FileTreeItem
            key={node.path}
            node={node}
            depth={0}
            activePath={activePath}
            editingPath={editingPath}
            onSelect={onSelect}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onRename={handleRename}
            onStartRename={handleStartRename}
            onCancelEdit={() => setEditingPath(null)}
          />
        ))}
      </div>
    </div>
  )
}
