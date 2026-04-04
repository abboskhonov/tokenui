"use client"

import { useState, useMemo, useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  ArrowLeft01Icon, 
  ArrowRight01Icon,
  ImageUploadIcon,
  Add01Icon,
  Folder01Icon,
  File01Icon,
  Delete01Icon,
  ComputerIcon,
  Sun01Icon,
  Moon01Icon,
  CodeIcon,
  Copy01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { categories } from "@/features/marketing/data"
import { useCreateDesign, uploadImage, uploadHtml } from "@/lib/queries/designs"
import { cn } from "@/lib/utils"
import type { CreateDesignData } from "@/lib/types/design"

// File node type
interface FileNode {
  id: string
  name: string
  path: string
  content: string
  type: "file" | "folder"
  isOpen?: boolean
  children?: FileNode[]
}

// Simple file tree item
function FileTreeItem({
  node,
  depth,
  activePath,
  onSelect,
  onToggle,
  onDelete,
}: {
  node: FileNode
  depth: number
  activePath: string
  onSelect: (path: string) => void
  onToggle: (path: string) => void
  onDelete: (path: string) => void
}) {
  const isActive = node.path === activePath

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 py-1.5 px-2 cursor-pointer group",
          isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted/50"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => node.type === "file" ? onSelect(node.path) : onToggle(node.path)}
      >
        {node.type === "folder" && (
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className={cn("size-3.5 transition-transform", node.isOpen && "rotate-90")}
          />
        )}
        <HugeiconsIcon
          icon={node.type === "folder" ? Folder01Icon : File01Icon}
          className={cn("size-4", node.type === "folder" && "text-blue-500")}
        />
        <span className="flex-1 text-sm truncate">{node.name}</span>
        {node.type === "file" && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(node.path)
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded"
          >
            <HugeiconsIcon icon={Delete01Icon} className="size-3.5 text-destructive" />
          </button>
        )}
      </div>
      {node.type === "folder" && node.isOpen && node.children?.map((child) => (
        <FileTreeItem
          key={child.path}
          node={child}
          depth={depth + 1}
          activePath={activePath}
          onSelect={onSelect}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

// Simple file tree
function FileTree({
  files,
  activePath,
  onSelect,
  onFilesChange,
}: {
  files: FileNode[]
  activePath: string
  onSelect: (path: string) => void
  onFilesChange: (files: FileNode[]) => void
}) {
  const [newFileName, setNewFileName] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const updateNode = (nodes: FileNode[], path: string, updater: (n: FileNode) => FileNode): FileNode[] => {
    return nodes.map((n) => {
      if (n.path === path) return updater(n)
      if (n.children) return { ...n, children: updateNode(n.children, path, updater) }
      return n
    })
  }

  const deleteNode = (nodes: FileNode[], path: string): FileNode[] => {
    return nodes
      .filter((n) => n.path !== path)
      .map((n) => (n.children ? { ...n, children: deleteNode(n.children, path) } : n))
  }

  const handleToggle = (path: string) => {
    onFilesChange(updateNode(files, path, (n) => ({ ...n, isOpen: !n.isOpen })))
  }

  const handleDelete = (path: string) => {
    onFilesChange(deleteNode(files, path))
    if (activePath === path && files.length > 0) {
      const firstFile = files.find(f => f.type === "file")
      if (firstFile) onSelect(firstFile.path)
    }
  }

  const handleCreateFile = () => {
    if (!newFileName) return
    const newFile: FileNode = {
      id: crypto.randomUUID(),
      name: newFileName,
      path: newFileName,
      content: "",
      type: "file",
    }
    onFilesChange([...files, newFile])
    onSelect(newFileName)
    setNewFileName("")
    setIsCreating(false)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Files</span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsCreating(true)}>
          <HugeiconsIcon icon={Add01Icon} className="size-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {files.map((node) => (
          <FileTreeItem
            key={node.path}
            node={node}
            depth={0}
            activePath={activePath}
            onSelect={onSelect}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
        {isCreating && (
          <div className="px-2 py-1">
            <Input
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onBlur={handleCreateFile}
              onKeyDown={(e) => e.key === "Enter" && handleCreateFile()}
              placeholder="filename.tsx"
              className="h-7 text-sm"
              autoFocus
            />
          </div>
        )}
      </div>
    </div>
  )
}

// Get file content by path
function getFileContent(files: FileNode[], path: string): string {
  for (const file of files) {
    if (file.path === path && file.type === "file") return file.content
    if (file.children) {
      const found = getFileContent(file.children, path)
      if (found !== "") return found
    }
  }
  return ""
}

// Update file content
function updateFileContent(files: FileNode[], path: string, content: string): FileNode[] {
  return files.map((file) => {
    if (file.path === path && file.type === "file") {
      return { ...file, content }
    }
    if (file.children) {
      return { ...file, children: updateFileContent(file.children, path, content) }
    }
    return file
  })
}

export function PublishPage() {
  const navigate = useNavigate()
  const createDesign = useCreateDesign()
  
  // Step state
  const [step, setStep] = useState<1 | 2>(1)
  
  // Step 1: Files (only SKILL.md by default)
  const [files, setFiles] = useState<FileNode[]>([
    { 
      id: "1", 
      name: "SKILL.md", 
      path: "SKILL.md", 
      content: `---
name: 
description: 
---

# Component Name

Describe your component here...

## Usage

\`\`\`tsx
import { Component } from "./component"

export default function App() {
  return <Component />
}
\`\`\`

## API Reference

| Prop | Type | Description |
|------|------|-------------|
| | | |
`, 
      type: "file" 
    },
  ])
  const [activeFile, setActiveFile] = useState("SKILL.md")
  
  // Step 2: Component info
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [thumbnailUrl, setThumbnailUrl] = useState("")
  const [demoCode, setDemoCode] = useState(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Component Demo</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="p-8">
  <!-- Add your component demo here -->
  <div class="text-center">
    <h1 class="text-2xl font-bold">Component Demo</h1>
    <p class="text-gray-600 mt-2">Your preview will appear here</p>
  </div>
</body>
</html>`)
  
  // Preview state
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light")
  const [isCopied, setIsCopied] = useState(false)
  
  // Get active file content
  const activeContent = useMemo(() => {
    return getFileContent(files, activeFile)
  }, [files, activeFile])
  
  // Preview URL
  const previewUrl = useMemo(() => {
    if (!demoCode.trim()) return null
    const blob = new Blob([demoCode], { type: "text/html" })
    return URL.createObjectURL(blob)
  }, [demoCode])
  
  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  // Auto-generate slug from name
  useEffect(() => {
    if (name && !slug) {
      setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))
    }
  }, [name, slug])

  const handleFileChange = (content: string) => {
    setFiles((prev) => updateFileContent(prev, activeFile, content))
  }

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      alert("File too large. Max 5MB.")
      return
    }
    
    try {
      const result = await uploadImage(file)
      setThumbnailUrl(result.url)
    } catch {
      const url = URL.createObjectURL(file)
      setThumbnailUrl(url)
    }
  }

  const handleCopyDemo = async () => {
    try {
      await navigator.clipboard.writeText(demoCode)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleSubmit = async () => {
    const skillContent = getFileContent(files, "SKILL.md")
    
    if (!skillContent.trim()) {
      alert("SKILL.md content is required")
      return
    }
    
    if (!name.trim() || !slug.trim() || !category) {
      alert("Please fill in all required fields")
      return
    }

    // Upload demo HTML
    let demoUrl: string | undefined
    if (demoCode.trim()) {
      try {
        const result = await uploadHtml(demoCode)
        demoUrl = result.url
      } catch {
        console.log("Failed to upload demo HTML, continuing without demo URL")
      }
    }

    const data: CreateDesignData = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() || undefined,
      category,
      content: skillContent,
      demoUrl,
      thumbnailUrl: thumbnailUrl || undefined,
      status: "pending",
      files,
    }

    try {
      await createDesign.mutateAsync(data)
      navigate({ to: "/studio" })
    } catch (error) {
      console.error("Failed to create:", error)
      alert("Failed to publish. Please try again.")
    }
  }

  const isPending = createDesign.isPending

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-14 border-b flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => step === 1 ? navigate({ to: "/studio" }) : setStep(1)}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
          </Button>
          <span className="text-sm font-medium text-muted-foreground">
            {step === 1 ? "New Component" : "Component Info"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {step === 1 ? (
            <Button 
              className="gap-2" 
              onClick={() => setStep(2)}
            >
              Continue
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button 
                className="gap-2" 
                onClick={handleSubmit}
                disabled={isPending}
              >
                <HugeiconsIcon icon={Add01Icon} className="size-4" />
                {isPending ? "Publishing..." : "Publish"}
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Step 1: Code Editor (File Tree + Editor only) */}
      {step === 1 && (
        <div className="flex-1 flex overflow-hidden">
          {/* File Tree - Left */}
          <div className="w-56 border-r bg-muted/30">
            <FileTree
              files={files}
              activePath={activeFile}
              onSelect={setActiveFile}
              onFilesChange={setFiles}
            />
          </div>

          {/* Editor - Right (fills remaining space) */}
          <div className="flex-1 flex flex-col">
            <div className="px-3 py-2 border-b bg-muted/50 text-xs font-medium flex items-center gap-2">
              <HugeiconsIcon icon={File01Icon} className="size-3.5" />
              {activeFile}
            </div>
            <textarea
              value={activeContent}
              onChange={(e) => handleFileChange(e.target.value)}
              className="flex-1 w-full p-4 text-sm font-mono resize-none focus:outline-none bg-transparent"
              placeholder={activeFile === "SKILL.md" 
                ? "---\nname: my-skill\ndescription: Describe your skill here...\n---" 
                : "Enter file content..."
              }
              spellCheck={false}
            />
          </div>
        </div>
      )}

      {/* Step 2: Component Info (like skill detail page) */}
      {step === 2 && (
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Component Info */}
          <aside className="w-[320px] min-h-0 border-r bg-card/30 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Title Section */}
              <div>
                <h1 className="text-lg font-semibold tracking-tight mb-4">Component Info</h1>
                
                {/* Name */}
                <div className="space-y-2 mb-4">
                  <label className="text-sm font-medium">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='e.g. "Button"'
                  />
                  <p className="text-xs text-muted-foreground">
                    The display name of your component
                  </p>
                </div>

                {/* Slug */}
                <div className="space-y-2 mb-4">
                  <label className="text-sm font-medium">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder='e.g. "button"'
                  />
                  <p className="text-xs text-muted-foreground">
                    Used in the URL, can&apos;t be changed later
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add some description to help others discover your component"
                  className="w-full min-h-[80px] p-3 rounded-md border bg-transparent text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <p className="text-xs text-muted-foreground">
                  A brief description of what your component does
                </p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Component type <span className="text-red-500">*</span>
                </label>
                <Select value={category} onValueChange={(value) => value && setCategory(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.name} value={cat.name.toLowerCase()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  The category your component belongs to
                </p>
              </div>

              {/* Thumbnail */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Thumbnail</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                    id="thumbnail"
                  />
                  <label htmlFor="thumbnail" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-md border hover:bg-muted transition-colors text-sm">
                    <HugeiconsIcon icon={ImageUploadIcon} className="size-4" />
                    {thumbnailUrl ? "Change image" : "Upload image"}
                  </label>
                  {thumbnailUrl && (
                    <img src={thumbnailUrl} alt="Thumbnail" className="h-12 w-12 object-cover rounded" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Displayed in grid view. Max 5MB.
                </p>
              </div>

              {/* Files Summary */}
              <div className="space-y-2 pt-4 border-t">
                <h3 className="text-sm font-medium">Files ({files.length})</h3>
                <div className="space-y-1">
                  {files.map((file) => (
                    <div key={file.path} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <HugeiconsIcon icon={file.type === "folder" ? Folder01Icon : File01Icon} className="size-4" />
                      {file.path}
                      {file.path === "SKILL.md" && (
                        <span className="px-1.5 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded">
                          Required
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Area - Demo Code + Preview */}
          <main className="flex-1 flex flex-col min-h-0">
            {/* Toolbar */}
            <div className="h-12 border-b flex items-center justify-between px-4 bg-background/50">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={CodeIcon} className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">Demo Code</span>
              </div>
              <div className="flex items-center gap-1">
                {/* Device Toggle */}
                <div className="flex items-center bg-muted rounded-lg p-0.5 mr-2">
                  <button
                    onClick={() => setPreviewMode("desktop")}
                    className={cn(
                      "px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1.5",
                      previewMode === "desktop" 
                        ? "bg-background text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <HugeiconsIcon icon={ComputerIcon} className="size-3.5" />
                    <span className="hidden sm:inline">Desktop</span>
                  </button>
                  <button
                    onClick={() => setPreviewMode("mobile")}
                    className={cn(
                      "px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1.5",
                      previewMode === "mobile" 
                        ? "bg-background text-foreground shadow-sm" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <HugeiconsIcon icon={ComputerIcon} className="size-3.5 rotate-90" />
                    <span className="hidden sm:inline">Mobile</span>
                  </button>
                </div>

                {/* Theme Toggle */}
                <Button 
                  variant="ghost" 
                  size="icon-sm" 
                  className="h-7 w-7"
                  onClick={() => setPreviewTheme(prev => prev === "light" ? "dark" : "light")}
                >
                  <HugeiconsIcon 
                    icon={previewTheme === "dark" ? Sun01Icon : Moon01Icon} 
                    className="size-3.5" 
                  />
                </Button>

                {/* Copy */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 gap-1.5 text-xs"
                  onClick={handleCopyDemo}
                >
                  <HugeiconsIcon 
                    icon={isCopied ? Tick02Icon : Copy01Icon} 
                    className={cn("size-3.5", isCopied && "text-green-500")} 
                  />
                  {isCopied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>

            {/* Content: Code Editor + Preview side by side */}
            <div className="flex-1 flex overflow-hidden">
              {/* Demo Code Editor */}
              <div className="flex-1 flex flex-col border-r">
                <textarea
                  value={demoCode}
                  onChange={(e) => setDemoCode(e.target.value)}
                  className="flex-1 w-full p-4 text-xs font-mono resize-none focus:outline-none bg-transparent"
                  placeholder="<!DOCTYPE html>
<html>
<body>
  <!-- Your demo here -->
</body>
</html>"
                  spellCheck={false}
                />
              </div>

              {/* Preview */}
              <div className={cn(
                "w-1/2 transition-all duration-300",
                previewMode === "mobile" ? "max-w-[375px]" : "w-1/2"
              )}>
                <div className={cn(
                  "h-full overflow-hidden",
                  previewTheme === "dark" ? "bg-[#0d1117]" : "bg-background"
                )}>
                  {previewUrl ? (
                    <iframe
                      src={previewUrl}
                      className="w-full h-full border-0"
                      sandbox="allow-same-origin allow-scripts"
                      title="Component preview"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center space-y-2 text-muted-foreground text-sm">
                        <p>No preview available</p>
                        <p className="text-xs">Add HTML content to see preview</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  )
}
