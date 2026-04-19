import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

// R2 configuration from env
export const getConfig = () => ({
  endpoint: process.env.R2_ENDPOINT,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  bucketName: process.env.R2_BUCKET_NAME || "tokenui",
  publicUrl: process.env.R2_PUBLIC_URL,
})

// Lazy initialization - S3 client created when first used
let s3Client: S3Client | null = null
export const getS3Client = (): S3Client => {
  if (!s3Client) {
    const config = getConfig()

    if (!config.endpoint || !config.accessKeyId || !config.secretAccessKey) {
      throw new Error("R2 credentials not configured in environment")
    }

    s3Client = new S3Client({
      region: "auto",
      endpoint: config.endpoint,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      forcePathStyle: true, // Required for R2
    })
  }
  return s3Client
}

export interface UploadResult {
  url: string
  key: string
  size: number
  contentType: string
}

// Magic numbers for file type validation
const FILE_SIGNATURES: Record<string, number[]> = {
  "image/jpeg": [0xff, 0xd8, 0xff],
  "image/png": [0x89, 0x50, 0x4e, 0x47],
  "image/webp": [0x52, 0x49, 0x46, 0x46], // RIFF header, need to check further
  "image/gif": [0x47, 0x49, 0x46, 0x38], // GIF87a or GIF89a
  "image/avif": [0x00, 0x00, 0x00, 0x1c], // AVIF box header (simplified)
}

/**
 * Validate file content using magic numbers
 */
function validateFileContent(buffer: Buffer, expectedType: string): boolean {
  const signature = FILE_SIGNATURES[expectedType]
  if (!signature) return true // Unknown type, skip content validation

  // Check if buffer starts with expected signature
  for (let i = 0; i < signature.length; i++) {
    if (buffer[i] !== signature[i]) {
      return false
    }
  }

  // Special check for WebP (RIFF....WEBP)
  if (expectedType === "image/webp" && buffer.length >= 12) {
    const webpSignature = buffer.slice(8, 12).toString("ascii")
    return webpSignature === "WEBP"
  }

  // Special check for AVIF (ftyp box with avif brand)
  if (expectedType === "image/avif" && buffer.length >= 12) {
    const brand = buffer.slice(8, 12).toString("ascii")
    return brand === "avif" || brand === "avis"
  }

  return true
}

/**
 * Check if HTML content contains dangerous scripts
 */
export function validateHtmlContent(html: string): { valid: boolean; error?: string } {
  // Check for script tags
  const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
  if (scriptRegex.test(html)) {
    return {
      valid: false,
      error: "HTML content cannot contain <script> tags for security reasons",
    }
  }

  // Check for event handlers (onclick, onload, etc.)
  const eventHandlerRegex = /on\w+\s*=\s*["'][^"']*["']/gi
  if (eventHandlerRegex.test(html)) {
    return {
      valid: false,
      error: "HTML content cannot contain event handlers (onclick, onload, etc.) for security reasons",
    }
  }

  // Check for javascript: URLs
  const jsUrlRegex = /javascript:/gi
  if (jsUrlRegex.test(html)) {
    return {
      valid: false,
      error: "HTML content cannot contain javascript: URLs for security reasons",
    }
  }

  // Check for iframe tags
  const iframeRegex = /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi
  if (iframeRegex.test(html)) {
    return {
      valid: false,
      error: "HTML content cannot contain <iframe> tags for security reasons",
    }
  }

  // Check for object/embed tags
  const objectEmbedRegex = /<(object|embed)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi
  if (objectEmbedRegex.test(html)) {
    return {
      valid: false,
      error: "HTML content cannot contain <object> or <embed> tags for security reasons",
    }
  }

  // Check for meta refresh
  const metaRefreshRegex = /<meta[^>]*http-equiv\s*=\s*["']refresh["'][^>]*>/gi
  if (metaRefreshRegex.test(html)) {
    return {
      valid: false,
      error: "HTML content cannot contain meta refresh redirects for security reasons",
    }
  }

  return { valid: true }
}

/**
 * Sanitize HTML content for safe display
 */
export function sanitizeHtmlForDisplay(html: string): string {
  // Add sandbox attributes to iframes (if they exist from older uploads)
  // Note: This won't help for already-uploaded content, but it's good for new content

  // Remove any potentially dangerous tags and attributes
  let sanitized = html

  // Remove script tags and their content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")

  // Remove event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")

  // Remove javascript: URLs
  sanitized = sanitized.replace(/javascript:/gi, "")

  return sanitized
}

/**
 * Upload a file to R2 (S3-compatible object storage)
 */
export async function uploadFile(
  buffer: Buffer,
  key: string,
  contentType: string,
  options?: {
    addSecurityHeaders?: boolean
  }
): Promise<UploadResult> {
  const config = getConfig()

  if (!config.endpoint || !config.accessKeyId || !config.secretAccessKey) {
    throw new Error("R2 credentials not configured")
  }

  // Build metadata with security headers for HTML content
  const metadata: Record<string, string> = {}

  if (options?.addSecurityHeaders && contentType === "text/html") {
    // Security headers for HTML previews
    // Allow iframe embedding for previews - scripts are already stripped during upload
    metadata["Content-Security-Policy"] = "default-src 'none'; style-src 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
    metadata["X-Content-Type-Options"] = "nosniff"
    metadata["Referrer-Policy"] = "strict-origin-when-cross-origin"
    // Note: X-Frame-Options is intentionally NOT set to allow iframe embedding for previews
  }

  // Upload to R2 with cache headers
  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: contentType === "text/html"
      ? "public, max-age=300" // Cache HTML for 5 minutes (shorter for safety)
      : "public, max-age=31536000, immutable", // Cache images for 1 year
    Metadata: metadata,
  })

  await getS3Client().send(command)

  // Generate public URL
  const url = config.publicUrl
    ? `${config.publicUrl}/${key}`
    : `${config.endpoint}/${config.bucketName}/${key}`

  return {
    url,
    key,
    size: buffer.length,
    contentType,
  }
}

/**
 * Validate file type and size for thumbnails
 */
export function validateThumbnail(
  contentType: string,
  size: number,
  buffer?: Buffer
): { valid: boolean; error?: string } {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
  ]

  if (!allowedTypes.includes(contentType)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`,
    }
  }

  const maxSize = 5 * 1024 * 1024
  if (size > maxSize) {
    return {
      valid: false,
      error: "File too large. Maximum size is 5MB.",
    }
  }

  // Validate actual file content if buffer provided
  if (buffer && !validateFileContent(buffer, contentType)) {
    return {
      valid: false,
      error: "File content does not match the claimed file type",
    }
  }

  return { valid: true }
}

/**
 * Generate a unique key for design thumbnails
 */
export function generateThumbnailKey(
  designId: string,
  fileExtension: string
): string {
  // Sanitize extension to prevent path traversal
  const sanitizedExt = fileExtension.replace(/[^a-z0-9]/gi, "").toLowerCase()
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 10)
  return `design-previews/${designId}/${timestamp}-${random}.${sanitizedExt}`
}

/**
 * Generate a unique key for design HTML previews
 */
export function generateHtmlKey(
  designId: string
): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 10)
  return `design-previews/${designId}/${timestamp}-${random}.html`
}
