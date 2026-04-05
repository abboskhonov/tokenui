import { Hono } from "hono"
import { eq, and, desc, count } from "drizzle-orm"
import { randomUUID } from "crypto"
import { auth } from "../auth"
import { db } from "../db"
import { star, design, user } from "../db/schema"
import type { AuthContext } from "../types"
import { success, created, unauthorized, badRequest, notFound, internalError, logError } from "../utils/errors"

const app = new Hono<AuthContext>()

// Get user's stars
app.get("/", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session) {
    return unauthorized(c)
  }

  try {
    const stars = await db
      .select({
        id: star.id,
        createdAt: star.createdAt,
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
      .from(star)
      .innerJoin(design, eq(star.designId, design.id))
      .innerJoin(user, eq(design.userId, user.id))
      .where(eq(star.userId, session.user.id))
      .orderBy(desc(star.createdAt))

    return success(c, { stars })
  } catch (error) {
    logError("FetchStars", error)
    return internalError(c, "Failed to fetch stars")
  }
})

// Check if a design is starred by current user
app.get("/check/:designId", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session) {
    return unauthorized(c)
  }

  const designId = c.req.param("designId")

  try {
    const [existingStar] = await db
      .select()
      .from(star)
      .where(and(
        eq(star.userId, session.user.id),
        eq(star.designId, designId)
      ))
      .limit(1)

    return success(c, { isStarred: !!existingStar })
  } catch (error) {
    logError("CheckStar", error)
    return internalError(c, "Failed to check star")
  }
})

// Get star count for a design
app.get("/count/:designId", async (c) => {
  const designId = c.req.param("designId")

  try {
    const [result] = await db
      .select({ count: count() })
      .from(star)
      .where(eq(star.designId, designId))

    return success(c, { count: result?.count || 0 })
  } catch (error) {
    logError("GetStarCount", error)
    return internalError(c, "Failed to get star count")
  }
})

// Create a star (star a design)
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

    // Check if user already starred this design
    const [existingStar] = await db
      .select()
      .from(star)
      .where(and(
        eq(star.userId, session.user.id),
        eq(star.designId, designId)
      ))
      .limit(1)

    if (existingStar) {
      return success(c, { star: existingStar, isNew: false })
    }

    const [newStar] = await db
      .insert(star)
      .values({
        id: randomUUID(),
        userId: session.user.id,
        designId: designId,
        createdAt: new Date(),
      })
      .returning()

    return created(c, { star: newStar, isNew: true })
  } catch (error) {
    logError("CreateStar", error)
    return internalError(c, "Failed to star design")
  }
})

// Delete a star (unstar a design)
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
      .delete(star)
      .where(and(
        eq(star.userId, session.user.id),
        eq(star.designId, designId)
      ))

    return success(c, { success: true })
  } catch (error) {
    logError("DeleteStar", error)
    return internalError(c, "Failed to unstar design")
  }
})

export default app
