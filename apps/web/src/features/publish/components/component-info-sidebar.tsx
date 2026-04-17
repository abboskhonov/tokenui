"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { HugeiconsIcon } from "@hugeicons/react"
import { ImageUploadIcon, File01Icon, Tick02Icon, Cancel01Icon } from "@hugeicons/core-free-icons"
import { categories } from "@/features/marketing/data"
import type { FileNode } from "./file-tree"
import type { CompressionResult } from "@/lib/image-compression"

interface ComponentInfoSidebarProps {
  name: string
  setName: (value: string) => void
  description: string
  setDescription: (value: string) => void
  category: string
  setCategory: (value: string) => void
  thumbnailUrl: string
  onThumbnailUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  files: FileNode[]
  isCompressing?: boolean
  compressionInfo?: CompressionResult | null
  nameExists?: boolean
  isEditing?: boolean
}

export function ComponentInfoSidebar({
  name,
  setName,
  description,
  setDescription,
  category,
  setCategory,
  thumbnailUrl,
  onThumbnailUpload,
  files,
  isCompressing = false,
  compressionInfo = null,
  nameExists = false,
  isEditing = false,
}: ComponentInfoSidebarProps) {
  const [thumbnailOpen, setThumbnailOpen] = useState(false)

  return (
    <aside className="w-[300px] min-h-0 border-r bg-card/30 overflow-y-auto">
      <div className="p-4 space-y-3">
        {/* Name */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Name
          </label>
          <div className="relative">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='e.g. "Glassmorphism"'
              className={`h-8 text-sm pr-8 ${
                !isEditing && name.trim() 
                  ? nameExists 
                    ? "border-red-500 focus-visible:ring-1 focus-visible:ring-red-500" 
                    : "border-green-500 focus-visible:ring-1 focus-visible:ring-green-500"
                  : ""
              }`}
            />
            {!isEditing && name.trim() && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                {nameExists ? (
                  <HugeiconsIcon icon={Cancel01Icon} className="size-4 text-red-500" />
                ) : (
                  <HugeiconsIcon icon={Tick02Icon} className="size-4 text-green-500" />
                )}
              </div>
            )}
          </div>
          {!isEditing && name.trim() && (
            <p className={`text-[10px] ${nameExists ? "text-red-500" : "text-green-600"}`}>
              {nameExists 
                ? "Name already taken" 
                : "Name is available"
              }
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this skill do..."
            className="w-full h-28 p-2 rounded-md border bg-transparent text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary/20"
          />
        </div>

        {/* Category */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Category
          </label>
          <Select value={category} onValueChange={(value) => value && setCategory(value)}>
            <SelectTrigger className="h-8 w-full text-sm">
              <SelectValue placeholder="Select" />
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
          <label className="text-xs font-medium text-muted-foreground">
            Thumbnail
          </label>
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
            className={`cursor-pointer inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded border hover:bg-muted transition-colors text-xs w-full ${isCompressing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isCompressing ? (
              <>
                <div className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Optimizing...
              </>
            ) : (
              <>
                <HugeiconsIcon icon={ImageUploadIcon} className="size-3.5" />
                {thumbnailUrl ? "Change" : "Upload"}
              </>
            )}
          </label>
          {thumbnailUrl && (
            <button
              onClick={() => setThumbnailOpen(true)}
              className="w-full p-0 border-0 bg-transparent cursor-pointer block"
            >
              <img 
                src={thumbnailUrl} 
                alt="Thumbnail" 
                className="w-full aspect-video object-cover rounded border hover:opacity-90 transition-opacity" 
              />
            </button>
          )}
        </div>

        {/* Files */}
        <div className="pt-3 border-t space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">
            Files
          </span>
          <div className="space-y-0.5">
            {files.map((file) => (
              <div key={file.path} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <HugeiconsIcon icon={File01Icon} className="size-3.5" />
                <span className="truncate">{file.path}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Thumbnail Full Screen Overlay */}
      {thumbnailOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setThumbnailOpen(false)}
        >
          <img 
            src={thumbnailUrl} 
            alt="Full thumbnail preview" 
            className="max-w-[95vw] max-h-[95vh] w-auto h-auto object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </aside>
  )
}
