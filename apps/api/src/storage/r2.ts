import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

// R2 configuration
const R2_ENDPOINT = process.env.R2_ENDPOINT
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "tokenui-designs"
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL

// Initialize S3 client for R2
const s3Client = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || "",
    secretAccessKey: R2_SECRET_ACCESS_KEY || "",
  },
})

export interface UploadResult {
  url: string
  key: string
  size: number
  contentType: string
}

/**
 * Upload a file to Cloudflare R2
 * @param buffer - File buffer
 * @param key - Object key (path in bucket)
 * @param contentType - MIME type of the file
 * @returns Upload result with public URL
 */
export async function uploadFile(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<UploadResult> {
  if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    throw new Error("R2 credentials not configured")
  }

  // Upload to R2
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    // Make it publicly readable
    ACL: "public-read",
  })

  await s3Client.send(command)

  // Generate public URL
  const url = R2_PUBLIC_URL
    ? `${R2_PUBLIC_URL}/${key}`
    : `${R2_ENDPOINT}/${R2_BUCKET_NAME}/${key}`

  return {
    url,
    key,
    size: buffer.length,
    contentType,
  }
}

/**
 * Generate a unique key for design thumbnails
 * @param designId - Design ID
 * @param fileExtension - File extension (e.g., 'jpg', 'png')
 * @returns Unique key string
 */
export function generateThumbnailKey(
  designId: string,
  fileExtension: string
): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 10)
  return `thumbnails/${designId}/${timestamp}-${random}.${fileExtension}`
}

/**
 * Validate file type and size for thumbnails
 * @param contentType - MIME type
 * @param size - File size in bytes
 * @returns Validation result
 */
export function validateThumbnail(
  contentType: string,
  size: number
): { valid: boolean; error?: string } {
  // Allowed image types
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

  // Max 5MB
  const maxSize = 5 * 1024 * 1024
  if (size > maxSize) {
    return {
      valid: false,
      error: "File too large. Maximum size is 5MB.",
    }
  }

  return { valid: true }
}
