"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  ArrowLeft01Icon, 
  ArrowRight01Icon,
  Cancel01Icon,
  SaveIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { useCreateDesign, uploadImage, designKeys, useCheckDesignName } from "@/lib/queries/designs"
import { compressImage, type CompressionResult } from "@/lib/image-compression"
import { useStudioDesign, useUpdateStudioDesign } from "@/features/studio"
import type { CreateDesignData } from "@/lib/types/design"
import { FileTree } from "./file-tree-component"
import { CodeEditor, getLanguageFromFilename } from "./code-editor"
import { ComponentInfoSidebar } from "./component-info-sidebar"
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
  const queryClient = useQueryClient()
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
  
  // Step 2: Skill info
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [thumbnailUrl, setThumbnailUrl] = useState("")
  const [demoCode, setDemoCode] = useState(DEFAULT_DEMO_HTML)
  const [showDemoEditor, setShowDemoEditor] = useState(false)
  const [compressionInfo, setCompressionInfo] = useState<CompressionResult | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [errorDialog, setErrorDialog] = useState<{ open: boolean; title: string; message: string }>({
    open: false,
    title: "",
    message: "",
  })
  
  // Helper to show error dialog
  const showError = (title: string, message: string) => {
    setErrorDialog({ open: true, title, message })
  }

  // Check if skill name already exists
  const { data: nameCheck } = useCheckDesignName(name, isEditing ? editId : undefined)
  const nameExists = nameCheck?.exists ?? false
  
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
      setDescription(existingDesign.description || "")
      setCategory(existingDesign.category)
      setThumbnailUrl(existingDesign.thumbnailUrl || "")
      
      // Load existing demo HTML if available (NEW: use demoHtml field directly)
      if (existingDesign.demoHtml) {
        setDemoCode(existingDesign.demoHtml)
      } else if (existingDesign.demoUrl) {
        // Fallback: fetch from old demoUrl for backward compatibility
        fetch(existingDesign.demoUrl)
          .then(res => res.text())
          .then(html => setDemoCode(html))
          .catch(() => setDemoCode(DEFAULT_DEMO_HTML))
      } else {
        setDemoCode(DEFAULT_DEMO_HTML)
      }
      
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
      showError("File Too Large", "Maximum file size is 5MB. Please choose a smaller image.")
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
      
      // Image compression successful
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

  const saveDraft = async () => {
    const skillContent = getFileContent(files, "SKILL.md")
    
    setIsDraftSaving(true)
    
    // Include demo HTML if provided and not default
    const demoHtml = demoCode.trim() && demoCode !== DEFAULT_DEMO_HTML 
      ? demoCode.trim() 
      : undefined
    
    const data: CreateDesignData = {
      name: name || "Untitled",
      slug: slug || "untitled",
      description: description || undefined,
      category: category || "uncategorized",
      content: skillContent || DEFAULT_SKILL_MD,
      demoHtml,
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
      showError("Save Failed", "Failed to save draft. Please try again.")
    } finally {
      setIsDraftSaving(false)
    }
  }

  const updateDraft = async () => {
    if (!editId || !existingDesign) return
    
    const skillContent = getFileContent(files, "SKILL.md")
    
    // Include demo HTML if provided and not default
    const demoHtml = demoCode.trim() && demoCode !== DEFAULT_DEMO_HTML 
      ? demoCode.trim() 
      : undefined
    
    const data: Partial<CreateDesignData> = {
      name: name || "Untitled",
      description: description || undefined,
      category: category || "uncategorized",
      content: skillContent || DEFAULT_SKILL_MD,
      demoHtml,
      thumbnailUrl: thumbnailUrl || undefined,
      status: "draft",
      files,
    }

    try {
      await updateDesign.mutateAsync({ id: editId, data })
    } catch {
      showError("Update Failed", "Failed to update draft. Please try again.")
    }
  }

  const handleSubmit = async () => {
    const skillContent = getFileContent(files, "SKILL.md")

    if (!skillContent.trim()) {
      showError("Missing Content", "SKILL.md content is required.")
      return
    }

    if (!name.trim() || !category) {
      showError("Missing Fields", "Please fill in all required fields (Name and Category).")
      return
    }

    if (nameExists && !isEditing) {
      showError("Name Already Exists", `You already have a skill named "${name}". Please choose a different name.`)
      return
    }

    // Include demo HTML if provided and not default
    const demoHtml = demoCode.trim() && demoCode !== DEFAULT_DEMO_HTML
      ? demoCode.trim()
      : undefined

    // When editing an already-approved design, preserve the approved status
    // so it doesn't require re-review by admins
    const isAlreadyApproved = isEditing && existingDesign?.status === "approved"

    const data: CreateDesignData = {
      name: name.trim(),
      description: description.trim() || undefined,
      category,
      content: skillContent,
      demoHtml,
      thumbnailUrl: thumbnailUrl || undefined,
      status: isAlreadyApproved ? "approved" : "pending",
      files,
    }

    try {
      if (isEditing && editId) {
        await updateDesign.mutateAsync({ id: editId, data })
      } else {
        await createDesign.mutateAsync(data)
      }
      
      // Invalidate and refetch designs query to ensure studio shows fresh data
      await queryClient.invalidateQueries({ queryKey: designKeys.my() })
      await queryClient.refetchQueries({ queryKey: designKeys.my() })
      
      setShowSuccessDialog(true)
    } catch {
      showError("Publish Failed", "Failed to publish. Please try again.")
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
          {/* Left: Back button only */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 gap-1.5 px-2 -ml-1"
            onClick={() => step === 1 ? navigate({ to: "/studio" }) : setStep(1)}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
            <span className="text-sm">Back</span>
          </Button>

          {/* Center: Title */}
          <span className="text-sm font-medium absolute left-1/2 -translate-x-1/2">
            {isEditing ? "Edit Skill" : "New Skill"}
          </span>

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
              <Button 
                size="sm"
                className="h-8 text-xs px-6"
                onClick={handleSubmit}
                disabled={createDesign.isPending || updateDesign.isPending || (!isEditing && nameExists)}
              >
                {createDesign.isPending || updateDesign.isPending 
                  ? "Publishing..." 
                  : "Publish"
                }
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Step 1: Code Editor */}
      {step === 1 && (
        <div className="flex-1 flex overflow-hidden bg-background">
          {/* File Tree Sidebar - matches component-info-sidebar width and style */}
          <div className="w-[260px] min-h-0 border-r border-border bg-card/30 flex flex-col overflow-hidden">
            <FileTree
              files={files}
              activePath={activeFile}
              onSelect={setActiveFile}
              onFilesChange={setFiles}
            />
          </div>

          {/* Code Editor */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* File path header - matches Files header style */}
            <div className="h-12 border-b border-border bg-background flex items-center px-4 shrink-0">
              <span className="text-sm font-medium text-foreground">{activeFile}</span>
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

      {/* Step 2: Skill Info + Preview */}
      {step === 2 && (
        <div className="flex-1 flex overflow-hidden">
          <ComponentInfoSidebar
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            category={category}
            setCategory={setCategory}
            thumbnailUrl={thumbnailUrl}
            onThumbnailUpload={handleThumbnailUpload}
            files={files}
            isCompressing={isCompressing}
            compressionInfo={compressionInfo}
            nameExists={nameExists}
            isEditing={isEditing}
          />

          <div className="flex-1 flex flex-col min-h-0">
            {/* Tabs header */}
            <div className="h-12 border-b flex items-center px-4 bg-background/50">
              <div className="flex items-center bg-muted rounded-lg p-0.5">
                <button
                  onClick={() => setShowDemoEditor(false)}
                  className={`px-4 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
                    !showDemoEditor
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Preview
                </button>
                <button
                  onClick={() => setShowDemoEditor(true)}
                  className={`px-4 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
                    showDemoEditor
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Code
                </button>
              </div>
            </div>

            {/* Content area - both mounted, visibility toggled for instant switch */}
            <div className={`flex-1 overflow-hidden bg-background ${showDemoEditor ? 'hidden' : 'block'}`}>
              {previewUrl ? (
                <iframe
                  key={previewUrl}
                  src={previewUrl}
                  className="w-full h-full border-0"
                  sandbox="allow-same-origin allow-scripts"
                  title="Skill preview"
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center space-y-2 text-muted-foreground">
                    <p>No preview available</p>
                    <p className="text-sm">Edit the demo code to create a preview</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className={`flex-1 overflow-hidden ${showDemoEditor ? 'block' : 'hidden'}`}>
              <DemoCodeEditor
                demoCode={demoCode}
                setDemoCode={setDemoCode}
              />
            </div>
          </div>
        </div>
      )}

      <SyntaxHighlightStyles />

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={Tick02Icon} className="size-5 text-green-500" />
              Skill Submitted for Review
            </DialogTitle>
            <DialogDescription className="pt-2 space-y-3">
              <p>
                Your skill has been submitted and will be reviewed very soon.
              </p>
              <p className="text-sm text-muted-foreground">
                We have a review system in place to prevent abuse and ensure quality. 
                Once approved, your skill will be publicly available for the community to use.
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end pt-4">
            <Button 
              onClick={() => navigate({ to: "/studio" })}
              className="px-6"
            >
              Go to Studio
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={errorDialog.open} onOpenChange={(open) => setErrorDialog({ ...errorDialog, open })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={Cancel01Icon} className="size-5 text-red-500" />
              {errorDialog.title}
            </DialogTitle>
            <DialogDescription className="pt-2">
              {errorDialog.message}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end pt-4">
            <Button 
              variant="outline"
              onClick={() => setErrorDialog({ ...errorDialog, open: false })}
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
