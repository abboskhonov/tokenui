/**
 * Image optimization utilities for client-side compression
 * Resizes, compresses, and converts images to WebP for optimal performance
 */

export interface CompressionOptions {
  /** Max width in pixels (default: 1920) */
  maxWidth?: number
  /** Max height in pixels (default: 1080) */
  maxHeight?: number
  /** JPEG/WebP quality 0-1 (default: 0.85) */
  quality?: number
  /** Output format (default: 'webp') */
  format?: 'webp' | 'jpeg' | 'png' | 'auto'
  /** Whether to preserve the original format if conversion fails */
  preserveOriginal?: boolean
}

export interface CompressionResult {
  file: File
  originalSize: number
  compressedSize: number
  compressionRatio: number
  format: string
  width: number
  height: number
}

const DEFAULT_OPTIONS: Required<CompressionOptions> = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.85,
  format: 'webp',
  preserveOriginal: true,
}

/**
 * Check if WebP is supported by the browser
 */
export function isWebPSupported(): boolean {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
}

/**
 * Get the output format based on options and browser support
 */
function getOutputFormat(
  originalType: string,
  options: CompressionOptions
): 'image/webp' | 'image/jpeg' | 'image/png' {
  const { format } = { ...DEFAULT_OPTIONS, ...options }

  if (format === 'webp' && isWebPSupported()) {
    return 'image/webp'
  }

  if (format === 'jpeg' || format === 'auto') {
    return 'image/jpeg'
  }

  // Default to original type or PNG
  if (originalType === 'image/png' || originalType === 'image/gif') {
    return 'image/png'
  }

  return 'image/jpeg'
}

/**
 * Load an image from a File object
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Calculate new dimensions maintaining aspect ratio
 */
function calculateDimensions(
  imgWidth: number,
  imgHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  let width = imgWidth
  let height = imgHeight

  const widthRatio = maxWidth / width
  const heightRatio = maxHeight / height
  const ratio = Math.min(widthRatio, heightRatio, 1)

  if (ratio < 1) {
    width = Math.round(width * ratio)
    height = Math.round(height * ratio)
  }

  return { width, height }
}

/**
 * Compress an image file using canvas
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  // Load the image
  const img = await loadImage(file)
  URL.revokeObjectURL(img.src)

  // Calculate new dimensions
  const { width, height } = calculateDimensions(
    img.naturalWidth,
    img.naturalHeight,
    opts.maxWidth,
    opts.maxHeight
  )

  // Create canvas and draw resized image
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Failed to get canvas context')
  }

  // Use better quality scaling
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, 0, 0, width, height)

  // Determine output format
  const outputType = getOutputFormat(file.type, opts)

  // Convert to blob
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toDataURL(outputType, opts.quality)
    canvas.toBlob(
      (b) => resolve(b),
      outputType,
      opts.quality
    )
  })

  if (!blob) {
    throw new Error('Failed to compress image')
  }

  // Create new file with proper extension
  const extension = outputType === 'image/webp' ? 'webp' : 
                    outputType === 'image/png' ? 'png' : 'jpg'
  const fileName = file.name.replace(/\.[^/.]+$/, '') + `.${extension}`
  const compressedFile = new File([blob], fileName, { type: outputType })

  return {
    file: compressedFile,
    originalSize: file.size,
    compressedSize: compressedFile.size,
    compressionRatio: compressedFile.size / file.size,
    format: outputType,
    width,
    height,
  }
}

/**
 * Create a thumbnail version of an image for preview
 */
export async function createThumbnail(
  file: File,
  maxSize: number = 400
): Promise<CompressionResult> {
  return compressImage(file, {
    maxWidth: maxSize,
    maxHeight: maxSize,
    quality: 0.8,
    format: 'webp',
  })
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Compress image if needed, otherwise return original
 * Useful for quick optimization without forcing compression
 */
export async function optimizeImageIfNeeded(
  file: File,
  maxSizeKB: number = 500,
  options: CompressionOptions = {}
): Promise<File> {
  const maxSizeBytes = maxSizeKB * 1024

  // If file is already small enough and not huge dimensions, return as-is
  if (file.size <= maxSizeBytes) {
    return file
  }

  // Try compression
  try {
    const result = await compressImage(file, {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.85,
      format: 'webp',
      ...options,
    })

    // If compression didn't help much, use original
    if (result.compressionRatio > 0.9 && file.size <= maxSizeBytes * 2) {
      return file
    }

    return result.file
  } catch (error) {
    console.error('Image compression failed:', error)
    return file
  }
}
