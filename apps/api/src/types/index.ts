import type { Context, Next } from "hono"
import { auth } from "../auth"
import type { user } from "../db/schema"
import type { InferSelectModel } from "drizzle-orm"

// Infer user type from schema
export type User = InferSelectModel<typeof user>

// Auth session type
export interface AuthSession {
  user: {
    id: string
    email: string
    name?: string | null
    image?: string | null
    emailVerified?: boolean
  }
  session: {
    id: string
    token: string
    expiresAt: Date
  }
}

// Extended Hono context with auth
export interface AuthContext {
  Variables: {
    session: AuthSession | null
    user: User | null
  }
}

// Design response type
export interface DesignWithAuthor {
  id: string
  name: string
  slug: string | null
  description: string | null
  category: string
  content?: string
  demoUrl: string | null
  thumbnailUrl: string | null
  isPublic: boolean
  viewCount: number
  createdAt: Date
  updatedAt?: Date
  userId: string
  author?: {
    name: string | null
    username: string | null
    image: string | null
  }
}

// Bookmark with design info
export interface BookmarkWithDesign {
  id: string
  createdAt: Date
  designId: string
  designName: string
  designSlug: string | null
  designDescription: string | null
  designCategory: string
  designThumbnailUrl: string | null
  designViewCount: number
  designCreatedAt: Date
  authorName: string | null
  authorUsername: string | null
  authorImage: string | null
}

// API Error response
export interface ApiError {
  error: string
  details?: string
}

// Pagination params
export interface PaginationParams {
  limit: number
  offset: number
}

// Design query filters
export interface DesignFilters {
  category?: string
  search?: string
}
