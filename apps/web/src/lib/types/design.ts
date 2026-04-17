import type { FileNode } from "@/features/publish/components/file-tree"

// Design with full data
export interface Design {
  id: string
  userId: string
  name: string
  slug: string
  description: string | null
  category: string
  content: string // HTML content for preview (always included)
  demoUrl: string | null // Deprecated: keeping for backward compatibility
  demoHtml: string | null // NEW: Raw HTML content for preview
  thumbnailUrl: string | null
  status: "draft" | "pending" | "approved" | "rejected"
  reviewMessage: string | null
  viewCount: number
  downloadCount: number
  installCount: number
  starCount: number
  isStarred?: boolean
  isBookmarked?: boolean
  files?: FileNode[] | null // Lazy-loaded for Code tab (not in initial response)
  createdAt: string
  updatedAt: string
  publishedAt: string | null // When design was approved/published
  author?: {
    name: string | null
    username: string | null
    image: string | null
  }
}

export interface CreateDesignData {
  name: string
  slug?: string
  description?: string
  category: string
  content: string
  demoUrl?: string // Deprecated
  demoHtml?: string // NEW: Raw HTML content for preview
  thumbnailUrl?: string
  status?: "draft" | "pending" | "approved"
  files?: FileNode[] // Additional files for multi-file skills
}

export interface Bookmark {
  id: string
  createdAt: string
  designId: string
  designName: string
  designSlug: string
  designDescription: string | null
  designCategory: string
  designThumbnailUrl: string | null
  designViewCount: number
  designCreatedAt: string
  authorName: string | null
  authorUsername: string | null
  authorImage: string | null
}

export interface Star {
  id: string
  createdAt: string
  designId: string
  designName: string
  designSlug: string
  designDescription: string | null
  designCategory: string
  designThumbnailUrl: string | null
  designViewCount: number
  designCreatedAt: string
  authorName: string | null
  authorUsername: string | null
  authorImage: string | null
}
