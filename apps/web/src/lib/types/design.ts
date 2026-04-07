import type { FileNode } from "@/features/publish/components/file-tree"

export interface Design {
  id: string
  userId: string
  name: string
  slug: string
  description: string | null
  category: string
  content: string
  demoUrl: string | null
  thumbnailUrl: string | null
  status: "draft" | "pending" | "approved" | "rejected"
  reviewMessage: string | null
  viewCount: number
  downloadCount: number
  starCount: number
  isStarred?: boolean
  isBookmarked?: boolean
  files: FileNode[] | null // Additional files for multi-file skills
  createdAt: string
  updatedAt: string
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
  demoUrl?: string
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
