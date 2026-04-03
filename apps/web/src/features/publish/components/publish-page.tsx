"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  ArrowLeft01Icon, 
  ImageUploadIcon, 
  Add01Icon, 
  AlertCircleIcon,
  Loading02Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { categories } from "@/features/marketing/data"
import { useCreateDesign, uploadImage, uploadHtml } from "@/lib/queries/designs"
import { useStudioDesign, useUpdateStudioDesign } from "@/features/studio"
import type { CreateDesignData } from "@/lib/types/design"
import { useMemo } from "react"

// Toggle switch component
function Toggle({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (checked: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-primary" : "bg-muted-foreground/30"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  )
}

export function PublishPage() {
  const navigate = useNavigate()
  const search = useSearch({ from: "/publish" }) as { edit?: string }
  const editId = search.edit
  
  const isEditing = !!editId
  const { data: existingDesign, isLoading: isLoadingDesign } = useStudioDesign(editId || "")
  const createDesign = useCreateDesign()
  const updateDesign = useUpdateStudioDesign()
  
  const [designName, setDesignName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [skillContent, setSkillContent] = useState("")
  const [htmlContent, setHtmlContent] = useState("")
  const [demoUrl, setDemoUrl] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [thumbnailUrl, setThumbnailUrl] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isUploadingHtml, setIsUploadingHtml] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [htmlError, setHtmlError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load existing design data when editing
  useEffect(() => {
    if (isEditing && existingDesign) {
      setDesignName(existingDesign.name)
      setDescription(existingDesign.description || "")
      setCategory(existingDesign.category)
      setSkillContent(existingDesign.content)
      setDemoUrl(existingDesign.demoUrl || "")
      setIsPublic(existingDesign.isPublic)
      setThumbnailUrl(existingDesign.thumbnailUrl || "")
      
      // If demoUrl is an HTML file hosted on R2, fetch the content
      if (existingDesign.demoUrl?.endsWith('.html')) {
        fetch(existingDesign.demoUrl)
          .then(res => res.text())
          .then(html => setHtmlContent(html))
          .catch(() => setHtmlContent(""))
      }
    }
  }, [isEditing, existingDesign])

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Invalid file type. Please upload an image (JPEG, PNG, WebP, GIF, or AVIF).")
      return
    }
    
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setUploadError("File too large. Maximum size is 5MB.")
      return
    }
    
    setIsUploading(true)
    setUploadError(null)
    
    try {
      const result = await uploadImage(file)
      setThumbnailUrl(result.url)
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Failed to upload image")
      const url = URL.createObjectURL(file)
      setThumbnailUrl(url)
    } finally {
      setIsUploading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!designName.trim()) {
      newErrors.name = "Name is required"
    }
    
    if (!category) {
      newErrors.category = "Category is required"
    }
    
    if (!skillContent.trim()) {
      newErrors.content = "Content is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    
    let finalDemoUrl = demoUrl.trim() || undefined
    
    // Upload HTML content if provided and changed
    if (htmlContent.trim()) {
      try {
        setIsUploadingHtml(true)
        setHtmlError(null)
        const result = await uploadHtml(htmlContent.trim())
        finalDemoUrl = result.url
      } catch (error) {
        setHtmlError(error instanceof Error ? error.message : "Failed to upload HTML preview")
        setIsUploadingHtml(false)
        return
      } finally {
        setIsUploadingHtml(false)
      }
    }
    
    const data: CreateDesignData = {
      name: designName.trim(),
      description: description.trim() || undefined,
      category,
      content: skillContent.trim(),
      demoUrl: finalDemoUrl,
      thumbnailUrl: thumbnailUrl || undefined,
      isPublic,
    }
    
    try {
      if (isEditing && editId) {
        await updateDesign.mutateAsync({ id: editId, data })
        navigate({ to: "/studio" })
      } else {
        await createDesign.mutateAsync(data)
        navigate({ to: "/studio" })
      }
    } catch (error) {
      console.error("Failed to save:", error)
    }
  }

  const isPending = createDesign.isPending || updateDesign.isPending || isUploading || isUploadingHtml
  const isLoading = isLoadingDesign
  const error = uploadError || htmlError || (Object.keys(errors).length > 0 ? errors : null) || createDesign.error || updateDesign.error

  // Create blob URL for HTML preview
  const htmlPreviewUrl = useMemo(() => {
    if (!htmlContent.trim()) return null
    const blob = new Blob([htmlContent], { type: "text/html" })
    return URL.createObjectURL(blob)
  }, [htmlContent])

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (htmlPreviewUrl) {
        URL.revokeObjectURL(htmlPreviewUrl)
      }
    }
  }, [htmlPreviewUrl])

  // Determine which URL to use for preview
  const previewUrl = htmlPreviewUrl || demoUrl || null

  // Show loading state when editing and data is still loading
  if (isEditing && isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
        <p className="mt-4 text-sm text-muted-foreground">Loading design...</p>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-14 border-b flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => navigate({ to: isEditing ? "/studio" : "/" })}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
          </Button>
          <span className="text-sm font-medium text-muted-foreground">
            {isEditing ? "Edit Design" : "New Design"}
          </span>
        </div>

        <Button 
          className="gap-2" 
          onClick={handleSubmit}
          disabled={isPending}
        >
          <HugeiconsIcon 
            icon={isEditing ? Tick02Icon : Add01Icon} 
            className="size-4" 
          />
          {isPending 
            ? (isEditing ? "Saving..." : "Publishing...") 
            : (isEditing ? "Save Changes" : "Publish")
          }
        </Button>
      </header>

      {/* Main Content - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Editor */}
        <div className="w-[45%] min-w-[400px] border-r overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full]">
          <div className="p-6 space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
                <HugeiconsIcon icon={AlertCircleIcon} className="size-4 text-destructive shrink-0 mt-0.5" />
                <div className="text-sm text-destructive">
                  {uploadError ? (
                    <p>{uploadError}</p>
                  ) : Object.keys(errors).length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {Object.entries(errors).map(([field, message]) => (
                        <li key={field}>{message}</li>
                      ))}
                    </ul>
                  ) : (
                    error instanceof Error ? error.message : "Failed to save design. Please try again."
                  )}
                </div>
              </div>
            )}

            {/* Design Name */}
            <div className="space-y-2">
              <input
                type="text"
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                placeholder="Untitled design"
                className={`w-full text-2xl font-semibold bg-transparent border-0 outline-none placeholder:text-muted-foreground/50 ${
                  errors.name ? "text-destructive placeholder:text-destructive/50" : ""
                }`}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
                className="w-full text-sm text-muted-foreground bg-transparent border-0 outline-none placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Skill Content Textarea */}
            <div className="space-y-2">
              <textarea
                value={skillContent}
                onChange={(e) => setSkillContent(e.target.value)}
                placeholder="Enter your skill code here..."
                className={`w-full min-h-[400px] p-4 rounded-lg bg-muted/50 border text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50 ${
                  errors.content ? "border-destructive focus:ring-destructive/20" : "border-border/50"
                }`}
              />
            </div>

            {/* HTML Preview Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">HTML Preview</label>
                <span className="text-xs text-muted-foreground">Optional</span>
              </div>
              <textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                placeholder="<!DOCTYPE html>
<html>
<head>
  <style>
    /* Your design system styles here */
  </style>
</head>
<body>
  <!-- Your component preview here -->
</body>
</html>"
                className={`w-full min-h-[200px] p-4 rounded-lg bg-muted/50 border text-xs font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50 ${
                  htmlError ? "border-destructive focus:ring-destructive/20" : "border-border/50"
                }`}
              />
              <p className="text-xs text-muted-foreground">
                Paste HTML code to generate a live preview. Will be hosted automatically. Max 1MB.
              </p>
              {isUploadingHtml && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <HugeiconsIcon icon={Loading02Icon} className="size-3 animate-spin" />
                  Uploading HTML preview...
                </div>
              )}
            </div>

            {/* Thumbnail */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Thumbnail</label>
              <div className="space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-24 border-dashed relative"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <HugeiconsIcon icon={Loading02Icon} className="size-5 text-muted-foreground animate-spin" />
                      <span className="text-sm text-muted-foreground">Uploading...</span>
                    </div>
                  ) : thumbnailUrl ? (
                    <img src={thumbnailUrl} alt="Thumbnail" className="h-full w-full object-contain" />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <HugeiconsIcon icon={ImageUploadIcon} className="size-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Upload thumbnail</span>
                    </div>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Display in grid view. Supports image formats (JPEG, PNG, WebP, GIF, AVIF). Max 5MB.
                </p>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={category} onValueChange={(value) => setCategory(value || "")}>
                <SelectTrigger className={`w-full ${errors.category ? "border-destructive" : ""}`}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map((cat) => (
                      <SelectItem key={cat.name} value={cat.name.toLowerCase()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Make Public Toggle */}
            <div className="flex items-center justify-between py-4 border-t">
              <div className="space-y-1">
                <label className="text-sm font-medium">Make public</label>
                <p className="text-xs text-muted-foreground">Visible to all users</p>
              </div>
              <Toggle checked={isPublic} onCheckedChange={setIsPublic} />
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 bg-muted/30 relative">
          {previewUrl ? (
            <iframe
              src={previewUrl}
              className="w-full h-full border-0"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Add HTML content or a demo URL to see a live preview
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
