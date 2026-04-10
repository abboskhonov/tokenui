"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { HugeiconsIcon } from "@hugeicons/react"
import { ImageUploadIcon, File01Icon } from "@hugeicons/core-free-icons"
import { categories } from "@/features/marketing/data"
import type { FileNode } from "./file-tree"
import type { CompressionResult } from "@/lib/image-compression"

interface ComponentInfoSidebarProps {
  name: string
  setName: (value: string) => void
  slug: string
  setSlug: (value: string) => void
  description: string
  setDescription: (value: string) => void
  category: string
  setCategory: (value: string) => void
  thumbnailUrl: string
  onThumbnailUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  files: FileNode[]
  isCompressing?: boolean
  compressionInfo?: CompressionResult | null
}

export function ComponentInfoSidebar({
  name,
  setName,
  slug,
  setSlug,
  description,
  setDescription,
  category,
  setCategory,
  thumbnailUrl,
  onThumbnailUpload,
  files,
  isCompressing = false,
  compressionInfo = null,
}: ComponentInfoSidebarProps) {
  return (
    <aside className="w-[300px] min-h-0 border-r bg-card/30 overflow-y-auto">
      <div className="p-5 space-y-5">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Name <span className="text-red-500">*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='e.g. "Modal Dialog"'
            className="h-9"
          />
        </div>

        {/* Slug */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Slug <span className="text-red-500">*</span>
          </label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder='e.g. "modal-dialog"'
            className="h-9"
          />
          <p className="text-xs text-muted-foreground">
            Used in URL, can&apos;t be changed later
          </p>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what this skill does and how it helps AI agents..."
            className="w-full h-20 p-2.5 rounded-md border bg-transparent text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Category <span className="text-red-500">*</span>
          </label>
          <Select value={category} onValueChange={(value) => value && setCategory(value)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.name} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Thumbnail */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Thumbnail
          </label>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={onThumbnailUpload}
              className="hidden"
              id="thumbnail"
              disabled={isCompressing}
            />
            <label 
              htmlFor="thumbnail" 
              className={`cursor-pointer flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md border hover:bg-muted transition-colors text-sm ${isCompressing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isCompressing ? (
                <>
                  <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Optimizing...
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={ImageUploadIcon} className="size-4" />
                  {thumbnailUrl ? "Change" : "Upload"}
                </>
              )}
            </label>
            {thumbnailUrl && (
              <img src={thumbnailUrl} alt="Thumbnail" className="h-10 w-10 object-cover rounded" />
            )}
          </div>
          {compressionInfo && compressionInfo.compressionRatio < 1 && (
            <p className="text-xs text-green-600">
              Optimized: {Math.round((1 - compressionInfo.compressionRatio) * 100)}% smaller
              <span className="text-muted-foreground ml-1">
                ({compressionInfo.width}x{compressionInfo.height})
              </span>
            </p>
          )}
        </div>

        {/* Files Summary */}
        <div className="pt-4 border-t space-y-2">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Files
          </h3>
          <div className="space-y-1">
            {files.map((file) => (
              <div key={file.path} className="flex items-center gap-2 text-sm text-muted-foreground">
                <HugeiconsIcon icon={File01Icon} className="size-4" />
                <span className="truncate">{file.path}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
