import { Hono } from "hono"
import { eq, and, desc } from "drizzle-orm"
import { randomUUID } from "crypto"
import { auth } from "../auth"
import { db } from "../db"
import { bookmark, design, user } from "../db/schema"
import type { AuthContext } from "../types"
import { success, created, unauthorized, badRequest, notFound, internalError, logError } from "../utils/errors"

const app = new Hono<AuthContext>()

// Get user's bookmarks
app.get("/", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session) {
    return unauthorized(c)
  }

  try {
    const bookmarks = await db
      .select({
        id: bookmark.id,
        createdAt: bookmark.createdAt,
        designId: design.id,
        designName: design.name,
        designSlug: design.slug,
        designDescription: design.description,
        designCategory: design.category,
        designThumbnailUrl: design.thumbnailUrl,
        designViewCount: design.viewCount,
        designCreatedAt: design.createdAt,
        authorName: user.name,
        authorUsername: user.username,
        authorImage: user.image,
      })
      .from(bookmark)
      .innerJoin(design, eq(bookmark.designId, design.id))
      .innerJoin(user, eq(design.userId, user.id))
      .where(eq(bookmark.userId, session.user.id))
      .orderBy(desc(bookmark.createdAt))

    return success(c, { bookmarks })
  } catch (error) {
    logError("FetchBookmarks", error)
    return internalError(c, "Failed to fetch bookmarks")
  }
})

// Check if a design is bookmarked
app.get("/check/:designId", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session) {
    return unauthorized(c)
  }

  const designId = c.req.param("designId")

  try {
    const [existingBookmark] = await db
      .select()
      .from(bookmark)
      .where(and(
        eq(bookmark.userId, session.user.id),
        eq(bookmark.designId, designId)
      ))
      .limit(1)

    return success(c, { isBookmarked: !!existingBookmark })
  } catch (error) {
    logError("CheckBookmark", error)
    return internalError(c, "Failed to check bookmark")
  }
})

// Create a bookmark
app.post("/", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session) {
    return unauthorized(c)
  }

  const body = await c.req.json()
  const { designId } = body

  if (!designId) {
    return badRequest(c, "Design ID is required")
  }

  try {
    const [designRecord] = await db
      .select()
      .from(design)
      .where(eq(design.id, designId))
      .limit(1)

    if (!designRecord) {
      return notFound(c, "Design")
    }

    const [existingBookmark] = await db
      .select()
      .from(bookmark)
      .where(and(
        eq(bookmark.userId, session.user.id),
        eq(bookmark.designId, designId)
      ))
      .limit(1)

    if (existingBookmark) {
      return success(c, { bookmark: existingBookmark })
    }

    const [newBookmark] = await db
      .insert(bookmark)
      .values({
        id: randomUUID(),
        userId: session.user.id,
        designId: designId,
        createdAt: new Date(),
      })
      .returning()

    return created(c, { bookmark: newBookmark })
  } catch (error) {
    logError("CreateBookmark", error)
    return internalError(c, "Failed to create bookmark")
  }
})

// Delete a bookmark
app.delete("/:designId", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session) {
    return unauthorized(c)
  }

  const designId = c.req.param("designId")

  try {
    await db
      .delete(bookmark)
      .where(and(
        eq(bookmark.userId, session.user.id),
        eq(bookmark.designId, designId)
      ))

    return success(c, { success: true })
  } catch (error) {
    logError("DeleteBookmark", error)
    return internalError(c, "Failed to delete bookmark")
  }
})

export default app
