import { z } from "zod"

// Design validation schemas
export const createDesignSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long (max 100 characters)"),
  slug: z.string().optional(),
  description: z.string().max(2000, "Description too long (max 2000 characters)").optional(),
  category: z.string().min(1, "Category is required").max(50, "Category too long"),
  content: z.string().min(1, "Content is required").max(100000, "Content too large (max 100KB)"),
  demoUrl: z.string().url("Invalid demo URL").max(500, "Demo URL too long").optional().nullable(),
  demoHtml: z.string().max(1000000, "HTML content too large (max 1MB)").optional().nullable(), // NEW: Raw HTML content
  thumbnailUrl: z.string().url("Invalid thumbnail URL").max(500, "Thumbnail URL too long").optional().nullable(),
  status: z.enum(["draft", "pending", "approved", "rejected"]).default("draft"),
  files: z.array(z.object({
    id: z.string(),
    name: z.string(),
    path: z.string(),
    content: z.string().max(50000, "File content too large (max 50KB per file)"),
    type: z.enum(["file", "folder"]),
    isOpen: z.boolean().optional(),
    children: z.array(z.any()).optional(),
  })).max(20, "Too many files (max 20)").optional().nullable(),
})

export const updateDesignSchema = createDesignSchema.partial()

export const designIdSchema = z.object({
  id: z.string().uuid("Invalid design ID format"),
})

export const designSlugSchema = z.object({
  username: z.string().min(1).max(50).regex(/^[a-zA-Z0-9_-]+$/, "Invalid username format"),
  slug: z.string().min(1).max(100).regex(/^[a-zA-Z0-9_-]+$/, "Invalid slug format"),
})

// Pagination and query schemas
export const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
})

export const designQuerySchema = z.object({
  category: z.string().max(50).optional(),
  search: z.string().max(100).optional(),
  sort: z.enum(["newest", "trending", "mostViewed", "mostStarred"]).default("newest"),
}).merge(paginationSchema)

// Search sanitization - remove dangerous characters
export function sanitizeSearchQuery(query: string): string {
  // Remove SQL special characters and normalize
  return query
    .replace(/[%_\\]/g, "") // Remove SQL LIKE wildcards
    .replace(/[<>\"']/g, "") // Remove HTML/script chars
    .trim()
    .slice(0, 100) // Limit length
}

// User input sanitization for display
export function sanitizeDisplayText(text: string): string {
  return text
    .replace(/[<>]/g, "") // Basic XSS prevention
    .trim()
    .slice(0, 1000)
}

// File path sanitization
export function sanitizeFilePath(path: string): string {
  // Prevent directory traversal
  return path
    .replace(/\.\./g, "") // Remove parent directory references
    .replace(/^\/+/, "") // Remove leading slashes
    .replace(/[<>\"|?*]/g, "") // Remove dangerous chars
    .trim()
}
