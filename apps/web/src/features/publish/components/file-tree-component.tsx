"use client"

import { useEffect, useRef, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Folder01Icon,
  File01Icon,
  FileAddIcon,
  FolderAddIcon,
  PencilEdit01Icon,
  Delete01Icon,
  ArrowDown01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons"
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
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

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
  onAddFile: (folderPath: string | null) => void
  onAddFolder: (folderPath: string | null) => void
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
  onAddFile,
  onAddFolder,
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

  const handleContextMenuAction = (action: string) => {
    switch (action) {
      case "rename":
        onStartRename(node.path)
        break
      case "delete":
        onDelete(node.path)
        break
      case "addFile":
        onAddFile(isFolder ? node.path : null)
        break
      case "addFolder":
        onAddFolder(isFolder ? node.path : null)
        break
    }
  }

  const menuContent = (
    <>
      {isFolder && (
        <>
          <ContextMenuItem onClick={() => handleContextMenuAction("addFile")}>
            <HugeiconsIcon icon={FileAddIcon} className="size-4 mr-2" />
            New File
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handleContextMenuAction("addFolder")}>
            <HugeiconsIcon icon={FolderAddIcon} className="size-4 mr-2" />
            New Folder
          </ContextMenuItem>
          <ContextMenuSeparator />
        </>
      )}
      <ContextMenuItem onClick={() => handleContextMenuAction("rename")}>
        <HugeiconsIcon icon={PencilEdit01Icon} className="size-4 mr-2" />
        Rename
      </ContextMenuItem>
      <ContextMenuItem 
        onClick={() => handleContextMenuAction("delete")}
        className="text-destructive focus:text-destructive"
      >
        <HugeiconsIcon icon={Delete01Icon} className="size-4 mr-2" />
        Delete
      </ContextMenuItem>
    </>
  )

  const fileItem = (
    <div
      className={cn(
        "flex items-center gap-2 py-2 px-4 cursor-pointer select-none text-sm",
        isActive && !isEditing && "bg-muted font-medium text-foreground",
        !isActive && !isEditing && "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      )}
      style={{ paddingLeft: `${depth * 12 + 16}px` }}
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
        <HugeiconsIcon
          icon={node.isOpen ? ArrowDown01Icon : ArrowRight01Icon}
          className="size-3.5 text-muted-foreground shrink-0"
        />
      )}
      {isFolder ? (
        <HugeiconsIcon icon={Folder01Icon} className="size-4 text-muted-foreground shrink-0" />
      ) : (
        <HugeiconsIcon icon={File01Icon} className="size-4 text-muted-foreground shrink-0" />
      )}
      
      {isEditing ? (
        <Input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          className="h-6 py-0 px-1 text-sm flex-1 bg-background"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span className="flex-1 truncate">{node.name}</span>
      )}
    </div>
  )

  return (
    <div>
      {isEditing ? (
        fileItem
      ) : (
        <ContextMenu>
          <ContextMenuTrigger asChild>
            {fileItem}
          </ContextMenuTrigger>
          <ContextMenuContent>
            {menuContent}
          </ContextMenuContent>
        </ContextMenu>
      )}

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
          onAddFile={onAddFile}
          onAddFolder={onAddFolder}
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
    const parentPath = oldPath.includes("/") 
      ? oldPath.substring(0, oldPath.lastIndexOf("/")) 
      : ""
    const newPath = parentPath ? `${parentPath}/${newName}` : newName

    if (pathExists(files, newPath) && oldPath !== newPath) {
      setEditingPath(null)
      return
    }

    const updateNodeRecursive = (nodes: Array<FileNode>): Array<FileNode> => {
      return nodes.map((node) => {
        if (node.path === oldPath) {
          const updated: FileNode = {
            ...node,
            name: newName,
            path: newPath,
          }
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

  const handleAdd = (isFolder: boolean, targetFolder: string | null = null) => {
    let finalTargetFolder = targetFolder
    
    if (!finalTargetFolder) {
      if (activePath.includes("/")) {
        finalTargetFolder = activePath.substring(0, activePath.lastIndexOf("/"))
      }
      
      if (!finalTargetFolder) {
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
        finalTargetFolder = findOpenFolder(files)
      }
    }

    const name = generateUniqueName(files, finalTargetFolder, isFolder)
    const fullPath = finalTargetFolder ? `${finalTargetFolder}/${name}` : name

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
      onFilesChange(addFolderToFolder(files, finalTargetFolder, newFolder))
    } else {
      const newFile: FileNode = {
        id: crypto.randomUUID(),
        name,
        path: fullPath,
        content: "",
        type: "file",
      }
      onFilesChange(addFileToFolder(files, finalTargetFolder, newFile))
      onSelect(fullPath)
    }

    setEditingPath(fullPath)
  }

  const handleRootContextMenuAction = (action: string) => {
    switch (action) {
      case "addFile":
        handleAdd(false, null)
        break
      case "addFolder":
        handleAdd(true, null)
        break
    }
  }

  return (
    <div className="flex flex-col h-full bg-card/30">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border h-12">
        <span className="text-sm font-medium text-foreground">Files</span>
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <button
              className="p-1.5 hover:bg-muted rounded-md transition-colors"
              title="Add new"
            >
              <HugeiconsIcon icon={FileAddIcon} className="size-4" />
            </button>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => handleRootContextMenuAction("addFile")}>
              <HugeiconsIcon icon={FileAddIcon} className="size-4 mr-2" />
              New File
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleRootContextMenuAction("addFolder")}>
              <HugeiconsIcon icon={FolderAddIcon} className="size-4 mr-2" />
              New Folder
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto py-3">
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
            onAddFile={(folderPath) => handleAdd(false, folderPath)}
            onAddFolder={(folderPath) => handleAdd(true, folderPath)}
          />
        ))}
      </div>
    </div>
  )
}
