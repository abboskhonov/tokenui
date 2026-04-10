"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  ArrowLeft01Icon, 
  ArrowRight01Icon,
  Add01Icon,
  File01Icon,
  Tick02Icon,
  SaveIcon,
} from "@hugeicons/core-free-icons"
import { useCreateDesign, uploadImage, uploadHtml } from "@/lib/queries/designs"
import { compressImage, formatFileSize, type CompressionResult } from "@/lib/image-compression"
import { useStudioDesign, useUpdateStudioDesign } from "@/features/studio"
import type { CreateDesignData } from "@/lib/types/design"
import { FileTree } from "./file-tree-component"
import { CodeEditor, getLanguageFromFilename } from "./code-editor"
import { ComponentInfoSidebar } from "./component-info-sidebar"
import { PreviewArea } from "./preview-area"
import { DemoCodeEditor } from "./demo-code-editor"
import { SyntaxHighlightStyles } from "./syntax-highlight-styles"
import { getFileContent, updateFileContent, type FileNode } from "./file-tree"

// Default SKILL.md content
const DEFAULT_SKILL_MD = `---
name: 
description: 
---

# Skill Name

Describe what this skill does and how it helps AI agents...

## Usage

	tell ai agent to use it like this: "use the <skill-name> skill to..."

## API Reference

| Option | Type | Description |
|--------|------|-------------|
| | | |
`

// Default demo HTML
const DEFAULT_DEMO_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Skill Demo</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="p-8">
  <!-- Add your skill demo here -->
  <div class="text-center">
    <h1 class="text-2xl font-bold">Skill Demo</h1>
    <p class="text-gray-600 mt-2">Your preview will appear here</p>
  </div>
</body>
</html>`

export function PublishPage() {
  const navigate = useNavigate()
  const search = useSearch({ from: "/publish" }) as { edit?: string }
  const editId = search.edit
  
  const isEditing = !!editId
  const { data: existingDesign, isLoading } = useStudioDesign(editId || "")
  const createDesign = useCreateDesign()
  const updateDesign = useUpdateStudioDesign()
  
  // Step state
  const [step, setStep] = useState<1 | 2>(1)
  const [isDraftSaving, setIsDraftSaving] = useState(false)
  
  // Step 1: Files
  const [files, setFiles] = useState<FileNode[]>([
    { id: "1", name: "SKILL.md", path: "SKILL.md", content: DEFAULT_SKILL_MD, type: "file" },
  ])
  const [activeFile, setActiveFile] = useState("SKILL.md")
  
  // Step 2: Component info
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [thumbnailUrl, setThumbnailUrl] = useState("")
  const [demoCode, setDemoCode] = useState(DEFAULT_DEMO_HTML)
  const [showDemoEditor, setShowDemoEditor] = useState(false)
  
  // Preview state
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light")
  const [isCopied, setIsCopied] = useState(false)
  const [compressionInfo, setCompressionInfo] = useState<CompressionResult | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)
  
  // Derived values
  const activeContent = useMemo(() => getFileContent(files, activeFile), [files, activeFile])
  
  const previewUrl = useMemo(() => {
    if (!demoCode.trim()) return null
    const blob = new Blob([demoCode], { type: "text/html" })
    return URL.createObjectURL(blob)
  }, [demoCode])
  
  // Track previous URL for cleanup
  const prevUrlRef = useRef<string | null>(null)
  
  useEffect(() => {
    return () => {
      if (prevUrlRef.current) {
        URL.revokeObjectURL(prevUrlRef.current)
      }
      prevUrlRef.current = previewUrl
    }
  }, [previewUrl])

  // Load existing draft data
  useEffect(() => {
    if (isEditing && existingDesign) {
      setName(existingDesign.name)
      setSlug(existingDesign.slug)
      setDescription(existingDesign.description || "")
      setCategory(existingDesign.category)
      setThumbnailUrl(existingDesign.thumbnailUrl || "")
      setDemoCode(existingDesign.demoUrl ? "" : DEFAULT_DEMO_HTML)
      
      // Load files
      if (existingDesign.files && existingDesign.files.length > 0) {
        setFiles(existingDesign.files)
      } else {
        setFiles([
          { 
            id: "1", 
            name: "SKILL.md", 
            path: "SKILL.md", 
            content: existingDesign.content || DEFAULT_SKILL_MD, 
            type: "file" 
          },
        ])
      }
    }
  }, [isEditing, existingDesign])

  // Handlers
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
    
    setIsCompressing(true)
    setCompressionInfo(null)
    
    try {
      // Compress image before upload for optimal performance
      const compressed = await compressImage(file, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.85,
        format: 'webp',
      })
      
      setCompressionInfo(compressed)
      
      // Upload the compressed image
      const result = await uploadImage(compressed.file)
      setThumbnailUrl(result.url)
      
      // Log compression stats for debugging
      console.log('Image compressed:', {
        original: formatFileSize(compressed.originalSize),
        compressed: formatFileSize(compressed.compressedSize),
        ratio: `${Math.round((1 - compressed.compressionRatio) * 100)}%`,
        dimensions: `${compressed.width}x${compressed.height}`,
      })
    } catch (error) {
      console.error('Compression/upload failed:', error)
      // Fallback to uploading original file if compression fails
      try {
        const result = await uploadImage(file)
        setThumbnailUrl(result.url)
      } catch {
        const url = URL.createObjectURL(file)
        setThumbnailUrl(url)
      }
    } finally {
      setIsCompressing(false)
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

  const saveDraft = async () => {
    const skillContent = getFileContent(files, "SKILL.md")
    
    setIsDraftSaving(true)
    
    const data: CreateDesignData = {
      name: name || "Untitled",
      slug: slug || "untitled",
      description: description || undefined,
      category: category || "uncategorized",
      content: skillContent || DEFAULT_SKILL_MD,
      demoUrl: undefined,
      thumbnailUrl: thumbnailUrl || undefined,
      status: "draft",
      files,
    }

    try {
      const newDesign = await createDesign.mutateAsync(data)
      // Redirect to edit mode with the new draft ID
      navigate({ 
        to: "/publish", 
        search: { edit: newDesign.id } 
      })
    } catch {
      alert("Failed to save draft. Please try again.")
    } finally {
      setIsDraftSaving(false)
    }
  }

  const updateDraft = async () => {
    if (!editId) return
    
    const skillContent = getFileContent(files, "SKILL.md")
    
    const data: Partial<CreateDesignData> = {
      name: name || "Untitled",
      slug: slug || "untitled",
      description: description || undefined,
      category: category || "uncategorized",
      content: skillContent || DEFAULT_SKILL_MD,
      thumbnailUrl: thumbnailUrl || undefined,
      status: "draft",
      files,
    }

    try {
      await updateDesign.mutateAsync({ id: editId, data })
    } catch {
      alert("Failed to update draft. Please try again.")
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

    let demoUrl: string | undefined
    if (demoCode.trim()) {
      try {
        const result = await uploadHtml(demoCode)
        demoUrl = result.url
      } catch {
        console.log("Failed to upload demo HTML")
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
      if (isEditing && editId) {
        await updateDesign.mutateAsync({ id: editId, data })
      } else {
        await createDesign.mutateAsync(data)
      }
      navigate({ to: "/studio" })
    } catch {
      alert("Failed to publish. Please try again.")
    }
  }

  if (isLoading && isEditing) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 h-12 border-b border-border bg-background/95 backdrop-blur-xl">
        <div className="mx-auto h-full max-w-full px-4 flex items-center justify-between">
          {/* Left: Back button and title */}
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 gap-1.5 px-2 -ml-1"
              onClick={() => step === 1 ? navigate({ to: "/studio" }) : setStep(1)}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
              <span className="text-sm">Back</span>
            </Button>
            <span className="text-sm font-medium">
              {isEditing ? "Edit Draft" : "New Skill"}
              {step === 2 && " - Info"}
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {step === 1 ? (
              <>
                {!isEditing && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 gap-1.5 text-xs"
                    onClick={saveDraft}
                    disabled={isDraftSaving || createDesign.isPending}
                  >
                    <HugeiconsIcon icon={SaveIcon} className="size-3.5" />
                    {isDraftSaving ? "Saving..." : "Save Draft"}
                  </Button>
                )}
                {isEditing && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 gap-1.5 text-xs"
                    onClick={updateDraft}
                    disabled={updateDesign.isPending}
                  >
                    <HugeiconsIcon icon={SaveIcon} className="size-3.5" />
                    {updateDesign.isPending ? "Saving..." : "Update Draft"}
                  </Button>
                )}
                <Button 
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                  onClick={() => setStep(2)}
                >
                  Continue
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button 
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                  onClick={handleSubmit}
                  disabled={createDesign.isPending || updateDesign.isPending}
                >
                  <HugeiconsIcon icon={isEditing ? Tick02Icon : Add01Icon} className="size-3.5" />
                  {createDesign.isPending || updateDesign.isPending 
                    ? "Publishing..." 
                    : "Publish"
                  }
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Step 1: Code Editor */}
      {step === 1 && (
        <div className="flex-1 flex overflow-hidden bg-background">
          {/* File Tree Sidebar */}
          <div className="w-60 border-r border-border bg-muted/30 flex flex-col overflow-hidden">
            <FileTree
              files={files}
              activePath={activeFile}
              onSelect={setActiveFile}
              onFilesChange={setFiles}
            />
          </div>

          {/* Code Editor */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* File path header - matches FileTree header height */}
            <div className="p-3 border-b border-border bg-muted/50 flex items-center shrink-0">
              <HugeiconsIcon icon={File01Icon} className="size-3.5 text-muted-foreground mr-2" />
              <span className="text-xs font-medium text-muted-foreground font-mono">{activeFile}</span>
            </div>
            
            {/* Editor content */}
            <div className="flex-1 overflow-auto bg-background">
              <CodeEditor
                value={activeContent}
                onChange={handleFileChange}
                language={getLanguageFromFilename(activeFile)}
                placeholder={activeFile === "SKILL.md" 
                  ? "---\nname: my-skill\ndescription: Describe your skill here...\n---" 
                  : "Enter file content..."
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Component Info + Preview */}
      {step === 2 && (
        <div className="flex-1 flex overflow-hidden">
          <ComponentInfoSidebar
            name={name}
            setName={setName}
            slug={slug}
            setSlug={setSlug}
            description={description}
            setDescription={setDescription}
            category={category}
            setCategory={setCategory}
            thumbnailUrl={thumbnailUrl}
            onThumbnailUpload={handleThumbnailUpload}
            files={files}
            isCompressing={isCompressing}
            compressionInfo={compressionInfo}
          />

          <div className="flex-1 flex flex-col min-h-0 relative">
            <PreviewArea
              previewUrl={previewUrl}
              previewMode={previewMode}
              setPreviewMode={setPreviewMode}
              previewTheme={previewTheme}
              setPreviewTheme={setPreviewTheme}
              onToggleEditor={() => setShowDemoEditor(!showDemoEditor)}
              isEditorOpen={showDemoEditor}
            />

            {showDemoEditor && (
              <DemoCodeEditor
                demoCode={demoCode}
                setDemoCode={setDemoCode}
                isCopied={isCopied}
                onCopy={handleCopyDemo}
                onClose={() => setShowDemoEditor(false)}
              />
            )}
          </div>
        </div>
      )}

      <SyntaxHighlightStyles />
    </div>
  )
}
