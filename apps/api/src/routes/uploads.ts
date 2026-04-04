import { Hono } from "hono"
import { extname } from "path"
import { auth } from "../auth"
import { uploadFile, generateThumbnailKey, validateThumbnail, generateHtmlKey } from "../storage/r2"
import type { AuthContext } from "../types"
import { success, created, unauthorized, badRequest, internalError, logError } from "../utils/errors"

const app = new Hono<AuthContext>()

// Upload image to R2
app.post("/image", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session) {
    return unauthorized(c)
  }

  try {
    const body = await c.req.parseBody()
    const file = body.file

    if (!file || !(file instanceof File)) {
      return badRequest(c, "No file provided")
    }

    const contentType = file.type || "application/octet-stream"
    const fileExtension = extname(file.name).toLowerCase().replace(".", "") || "jpg"

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const validation = validateThumbnail(contentType, buffer.length)
    if (!validation.valid) {
      return badRequest(c, validation.error || "Invalid file")
    }

    const key = generateThumbnailKey(session.user.id, fileExtension)
    const result = await uploadFile(buffer, key, contentType)

    return created(c, {
      url: result.url,
      key: result.key,
      size: result.size,
      contentType: result.contentType,
    })
  } catch (error) {
    logError("UploadImage", error)
    return internalError(c, error instanceof Error ? error.message : "Failed to upload image")
  }
})

// Upload HTML content to R2
app.post("/html", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session) {
    return unauthorized(c)
  }

  try {
    const body = await c.req.json()
    const { html } = body

    if (!html || typeof html !== "string") {
      return badRequest(c, "No HTML content provided")
    }

    // Validate HTML size (max 1MB)
    const htmlBuffer = Buffer.from(html, "utf-8")
    const maxSize = 1 * 1024 * 1024
    if (htmlBuffer.length > maxSize) {
      return badRequest(c, "HTML content too large. Maximum size is 1MB.")
    }

    const key = generateHtmlKey(session.user.id)
    const result = await uploadFile(htmlBuffer, key, "text/html")

    return created(c, {
      url: result.url,
      key: result.key,
      size: result.size,
      contentType: result.contentType,
    })
  } catch (error) {
    logError("UploadHTML", error)
    return internalError(c, error instanceof Error ? error.message : "Failed to upload HTML")
  }
})

export default app
