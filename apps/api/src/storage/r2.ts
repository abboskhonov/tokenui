import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

// R2 configuration from env
const getConfig = () => ({
  endpoint: process.env.R2_ENDPOINT,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  bucketName: process.env.R2_BUCKET_NAME || "tokenui",
  publicUrl: process.env.R2_PUBLIC_URL,
})

// Lazy initialization - S3 client created when first used
let s3Client: S3Client | null = null
const getS3Client = (): S3Client => {
  if (!s3Client) {
    const config = getConfig()
    console.log("🔧 Creating S3 client with:")
    console.log("  Endpoint:", config.endpoint)
    console.log("  Access Key ID:", config.accessKeyId?.substring(0, 8) + "...")
    console.log("  Secret Key length:", config.secretAccessKey?.length)
    console.log("  Bucket:", config.bucketName)
    
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

/**
 * Upload a file to Cloudflare R2
 */
export async function uploadFile(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<UploadResult> {
  const config = getConfig()
  
  if (!config.endpoint || !config.accessKeyId || !config.secretAccessKey) {
    throw new Error("R2 credentials not configured")
  }
  
  // Upload to R2
  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  })

  await getS3Client().send(command)

  // Generate public URL
  const url = config.publicUrl 
    ? `${config.publicUrl}/${key}`
    : `${config.endpoint}/${config.bucketName}/${key}`
  
  console.log("✅ Upload successful:", url)

  return {
    url,
    key,
    size: buffer.length,
    contentType,
  }
}

/**
 * Generate a unique key for design thumbnails
 */
export function generateThumbnailKey(
  designId: string,
  fileExtension: string
): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 10)
  return `design-previews/${designId}/${timestamp}-${random}.${fileExtension}`
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

/**
 * Validate file type and size for thumbnails
 */
export function validateThumbnail(
  contentType: string,
  size: number
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

  return { valid: true }
}