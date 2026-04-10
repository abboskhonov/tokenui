import { Hono } from "hono"
import { eq, and, desc, count, like, or, sql, gte, inArray } from "drizzle-orm"
import { randomUUID } from "crypto"
import { auth } from "../auth"
import { db } from "../db"
import { user, design, designView, designDownload, star, bookmark } from "../db/schema"
import type { AuthContext } from "../types"
import { generateSlug } from "../utils/slugs"
import { success, created, unauthorized, notFound, internalError, badRequest, forbidden, logError } from "../utils/errors"
import {
  createDesignSchema,
  updateDesignSchema,
  designQuerySchema,
  sanitizeSearchQuery,
} from "../utils/validation"
import { validateBody, validateQuery, getValidatedBody, getValidatedQuery } from "../middleware/validation"

const app = new Hono<AuthContext>()

// Helper to get view count
async function getPublicViewCount(designId: string): Promise<number> {
  const [result] = await db
    .select({ count: count() })
    .from(designView)
    .where(eq(designView.designId, designId))

  return Number(result?.count || 0)
}

// Helper to get download count
async function getPublicDownloadCount(designId: string): Promise<number> {
  const [result] = await db
    .select({ count: count() })
    .from(designDownload)
    .where(eq(designDownload.designId, designId))

  return Number(result?.count || 0)
}

// Helper to parse files JSON
function parseFiles(filesJson: string | null): unknown[] | null {
  if (!filesJson) return null
  try {
    const parsed = JSON.parse(filesJson)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

// Create a new design (with optional draft mode)
app.post("/", validateBody(createDesignSchema), async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session) {
    return unauthorized(c)
  }

  const body = getValidatedBody<typeof createDesignSchema._type>(c)
  const isDraft = body.status === "draft"

  try {
    // Generate unique slug for this user
    const name = body.name?.trim() || "untitled"
    const baseSlug = generateSlug(name)
    let slug = baseSlug
    let counter = 1

    while (true) {
      const [existing] = await db
        .select({ id: design.id })
        .from(design)
        .where(and(
          eq(design.userId, session.user.id),
          eq(design.slug, slug)
        ))
        .limit(1)

      if (!existing) break
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const [designRecord] = await db
      .insert(design)
      .values({
        id: randomUUID(),
        userId: session.user.id,
        name: name,
        slug: slug,
        description: body.description?.trim() || null,
        category: body.category || "uncategorized",
        content: body.content?.trim() || "",
        demoUrl: body.demoUrl?.trim() || null,
        thumbnailUrl: body.thumbnailUrl?.trim() || null,
        status: body.status ?? "draft",
        files: body.files ? JSON.stringify(body.files) : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    return created(c, { design: designRecord })
  } catch (error) {
    logError("CreateDesign", error)
    return internalError(c, "Failed to create design")
  }
})

// Get user's designs
app.get("/my", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session) {
    return unauthorized(c)
  }

  try {
    const designs = await db
      .select()
      .from(design)
      .where(eq(design.userId, session.user.id))
      .orderBy(desc(design.createdAt))

    return success(c, { designs })
  } catch (error) {
    logError("FetchMyDesigns", error)
    return internalError(c, "Failed to fetch designs")
  }
})

// Get public designs with pagination
app.get("/", validateQuery(designQuerySchema), async (c) => {
  const query = getValidatedQuery<typeof designQuerySchema._type>(c)
  const { category, search, limit, offset } = query

  try {
    const conditions: ReturnType<typeof eq>[] = [eq(design.status, "approved")]

    if (category) {
      conditions.push(eq(design.category, category))
    }

    if (search) {
      // Sanitize search query before using in LIKE
      const sanitizedSearch = sanitizeSearchQuery(search)
      if (sanitizedSearch) {
        const searchPattern = `%${sanitizedSearch.toLowerCase()}%`
        conditions.push(
          or(
            like(sql`LOWER(${design.name})`, searchPattern),
            like(sql`LOWER(${design.category})`, searchPattern),
            like(sql`LOWER(COALESCE(${design.description}, ''))`, searchPattern)
          ) as ReturnType<typeof eq>
        )
      }
    }

    const designs = await db
      .select({
        id: design.id,
        name: design.name,
        slug: design.slug,
        description: design.description,
        category: design.category,
        thumbnailUrl: design.thumbnailUrl,
        status: design.status,
        viewCount: design.viewCount,
        createdAt: design.createdAt,
        userId: design.userId,
        author: {
          name: user.name,
          username: user.username,
          image: user.image,
        }
      })
      .from(design)
      .leftJoin(user, eq(design.userId, user.id))
      .where(and(...conditions))
      .orderBy(desc(design.createdAt))
      .limit(limit)
      .offset(offset)

    return success(c, {
      designs,
      pagination: { limit, offset, hasMore: designs.length === limit }
    })
  } catch (error) {
    logError("FetchDesigns", error)
    return internalError(c, "Failed to fetch designs")
  }
})

// Get trending skills (most views in last 7 days)
app.get("/leaderboard/trending", validateQuery(designQuerySchema), async (c) => {
  const query = getValidatedQuery<typeof designQuerySchema._type>(c)
  const { limit, offset } = query

  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    // Get designs with most recent views
    const trendingDesigns = await db
      .select({
        id: design.id,
        name: design.name,
        slug: design.slug,
        description: design.description,
        category: design.category,
        thumbnailUrl: design.thumbnailUrl,
        viewCount: design.viewCount,
        createdAt: design.createdAt,
        userId: design.userId,
        author: {
          name: user.name,
          username: user.username,
          image: user.image,
        },
        recentViews: count(designView.id)
      })
      .from(design)
      .leftJoin(user, eq(design.userId, user.id))
      .leftJoin(designView, eq(design.id, designView.designId))
      .where(and(
        eq(design.status, "approved"),
        gte(designView.viewedAt, sevenDaysAgo)
      ))
      .groupBy(design.id, user.name, user.username, user.image)
      .orderBy(desc(count(designView.id)))
      .limit(limit)
      .offset(offset)

    return success(c, {
      designs: trendingDesigns,
      pagination: { limit, offset, hasMore: trendingDesigns.length === limit }
    })
  } catch (error) {
    logError("FetchTrending", error)
    return internalError(c, "Failed to fetch trending designs")
  }
})

// Get top rated skills (most stars)
app.get("/leaderboard/top", validateQuery(designQuerySchema), async (c) => {
  const query = getValidatedQuery<typeof designQuerySchema._type>(c)
  const { limit, offset } = query

  try {
    const topDesigns = await db
      .select({
        id: design.id,
        name: design.name,
        slug: design.slug,
        description: design.description,
        category: design.category,
        thumbnailUrl: design.thumbnailUrl,
        viewCount: design.viewCount,
        createdAt: design.createdAt,
        userId: design.userId,
        author: {
          name: user.name,
          username: user.username,
          image: user.image,
        },
        starCount: count(star.id)
      })
      .from(design)
      .leftJoin(user, eq(design.userId, user.id))
      .leftJoin(star, eq(design.id, star.designId))
      .where(eq(design.status, "approved"))
      .groupBy(design.id, user.name, user.username, user.image)
      .orderBy(desc(count(star.id)), desc(design.viewCount))
      .limit(limit)
      .offset(offset)

    return success(c, {
      designs: topDesigns,
      pagination: { limit, offset, hasMore: topDesigns.length === limit }
    })
  } catch (error) {
    logError("FetchTopRated", error)
    return internalError(c, "Failed to fetch top rated designs")
  }
})

// Get newest skills
app.get("/leaderboard/newest", validateQuery(designQuerySchema), async (c) => {
  const query = getValidatedQuery<typeof designQuerySchema._type>(c)
  const { limit, offset } = query

  try {
    const newestDesigns = await db
      .select({
        id: design.id,
        name: design.name,
        slug: design.slug,
        description: design.description,
        category: design.category,
        thumbnailUrl: design.thumbnailUrl,
        viewCount: design.viewCount,
        createdAt: design.createdAt,
        userId: design.userId,
        author: {
          name: user.name,
          username: user.username,
          image: user.image,
        }
      })
      .from(design)
      .leftJoin(user, eq(design.userId, user.id))
      .where(eq(design.status, "approved"))
      .orderBy(desc(design.createdAt))
      .limit(limit)
      .offset(offset)

    return success(c, {
      designs: newestDesigns,
      pagination: { limit, offset, hasMore: newestDesigns.length === limit }
    })
  } catch (error) {
    logError("FetchNewest", error)
    return internalError(c, "Failed to fetch newest designs")
  }
})

// Get top contributors (users with most skills and stars) - OPTIMIZED VERSION
app.get("/leaderboard/contributors", async (c) => {
  const limit = Math.min(parseInt(c.req.query("limit") || "10"), 20)

  try {
    // Single query with subquery for stars count - avoiding N+1
    const contributors = await db.execute(sql`
      SELECT 
        u.id as "userId",
        u.name,
        u.username,
        u.image,
        COUNT(d.id) as "skillCount",
        COALESCE(s.total_stars, 0) as "totalStars",
        COALESCE(SUM(d.view_count), 0) as "totalViews"
      FROM ${user} u
      LEFT JOIN ${design} d ON d.user_id = u.id AND d.status = 'approved'
      LEFT JOIN (
        SELECT d.user_id, COUNT(s.id) as total_stars
        FROM ${design} d
        LEFT JOIN ${star} s ON s.design_id = d.id
        WHERE d.status = 'approved'
        GROUP BY d.user_id
      ) s ON s.user_id = u.id
      WHERE EXISTS (SELECT 1 FROM ${design} WHERE user_id = u.id AND status = 'approved')
      GROUP BY u.id, u.name, u.username, u.image, s.total_stars
      ORDER BY s.total_stars DESC NULLS LAST, COUNT(d.id) DESC
      LIMIT ${limit}
    `)

    return success(c, {
      contributors: contributors.rows.map((c: any) => ({
        userId: c.userId,
        name: c.name,
        username: c.username,
        image: c.image,
        skillCount: Number(c.skillCount),
        totalStars: Number(c.totalStars),
        totalViews: Number(c.totalViews),
      }))
    })
  } catch (error) {
    logError("FetchContributors", error)
    return internalError(c, "Failed to fetch top contributors")
  }
})

// Get single design by ID (for editing)
app.get("/:id", async (c) => {
  const id = c.req.param("id")
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session) {
    return unauthorized(c)
  }

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(id)) {
    return badRequest(c, "Invalid design ID format")
  }

  try {
    const [designRecord] = await db
      .select({
        id: design.id,
        name: design.name,
        slug: design.slug,
        description: design.description,
        category: design.category,
        content: design.content,
        demoUrl: design.demoUrl,
        thumbnailUrl: design.thumbnailUrl,
        status: design.status,
        viewCount: design.viewCount,
        files: design.files,
        createdAt: design.createdAt,
        updatedAt: design.updatedAt,
        userId: design.userId,
        author: {
          name: user.name,
          username: user.username,
          image: user.image,
        }
      })
      .from(design)
      .leftJoin(user, eq(design.userId, user.id))
      .where(and(
        eq(design.id, id),
        eq(design.userId, session.user.id)
      ))
      .limit(1)

    if (!designRecord) {
      return notFound(c, "Design")
    }

    // Parse files JSON before returning
    const designWithParsedFiles = {
      ...designRecord,
      files: parseFiles(designRecord.files as string | null),
    }

    return success(c, { design: designWithParsedFiles })
  } catch (error) {
    logError("FetchDesign", error)
    return internalError(c, "Failed to fetch design")
  }
})

// Get single design by username and slug (for public viewing)
app.get("/:username/:slug", async (c) => {
  const username = c.req.param("username")
  const slug = c.req.param("slug")

  // Validate username and slug format
  const validFormat = /^[a-zA-Z0-9_-]+$/
  if (!validFormat.test(username) || !validFormat.test(slug)) {
    return badRequest(c, "Invalid username or slug format")
  }

  try {
    // Fetch design + user join first (needed for authorization check)
    const [designRecord] = await db
      .select({
        id: design.id,
        name: design.name,
        slug: design.slug,
        description: design.description,
        category: design.category,
        content: design.content,
        demoUrl: design.demoUrl,
        thumbnailUrl: design.thumbnailUrl,
        status: design.status,
        viewCount: design.viewCount,
        files: design.files,
        createdAt: design.createdAt,
        updatedAt: design.updatedAt,
        userId: design.userId,
        author: {
          name: user.name,
          username: user.username,
          image: user.image,
        }
      })
      .from(design)
      .leftJoin(user, eq(design.userId, user.id))
      .where(and(
        eq(user.username, username),
        eq(design.slug, slug)
      ))
      .limit(1)

    if (!designRecord) {
      return notFound(c, "Design")
    }

    // Check authorization
    const sessionPromise = auth.api.getSession({
      headers: c.req.raw.headers,
    })

    // Run counts in parallel with session check
    const [session, starCountResult, downloadCountResult] = await Promise.all([
      sessionPromise,
      db.select({ count: count() }).from(star).where(eq(star.designId, designRecord.id)),
      db.select({ count: count() }).from(designDownload).where(eq(designDownload.designId, designRecord.id)),
    ])

    if (designRecord.status !== "approved" && (!session || session.user.id !== designRecord.userId)) {
      return forbidden(c)
    }

    const starCount = Number(starCountResult?.count || 0)
    const downloadCount = Number(downloadCountResult?.count || 0)

    // Check if current user has starred/bookmarked (only if logged in)
    let isStarred = false
    let isBookmarked = false

    if (session) {
      const [starResult, bookmarkResult] = await Promise.all([
        db.select().from(star).where(and(
          eq(star.userId, session.user.id),
          eq(star.designId, designRecord.id)
        )).limit(1),
        db.select().from(bookmark).where(and(
          eq(bookmark.userId, session.user.id),
          eq(bookmark.designId, designRecord.id)
        )).limit(1),
      ])
      isStarred = !!starResult[0]
      isBookmarked = !!bookmarkResult[0]
    }

    // Parse files JSON before returning
    const designWithParsedFiles = {
      ...designRecord,
      files: parseFiles(designRecord.files as string | null),
      starCount,
      downloadCount,
      isStarred,
      isBookmarked,
    }

    return success(c, { design: designWithParsedFiles })
  } catch (error) {
    logError("FetchDesignBySlug", error)
    return internalError(c, "Failed to fetch design")
  }
})

// Record a view for a design
app.post("/:id/view", async (c) => {
  const designId = c.req.param("id")

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(designId)) {
    return badRequest(c, "Invalid design ID format")
  }

  try {
    const [designRecord] = await db
      .select({ id: design.id, status: design.status, userId: design.userId })
      .from(design)
      .where(eq(design.id, designId))
      .limit(1)

    if (!designRecord) {
      return notFound(c, "Design")
    }

    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    })

    const userId = session?.user?.id
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    if (userId) {
      const [existingView] = await db
        .select()
        .from(designView)
        .where(and(
          eq(designView.designId, designId),
          eq(designView.userId, userId)
        ))
        .orderBy(desc(designView.viewedAt))
        .limit(1)

      if (existingView && existingView.viewedAt > twentyFourHoursAgo) {
        return success(c, {
          success: true,
          isNewView: false,
          viewCount: designRecord.status === "approved" ? await getPublicViewCount(designId) : 0
        })
      }
    }

    await db.insert(designView).values({
      id: randomUUID(),
      designId,
      userId: userId || null,
      viewedAt: new Date(),
    })

    await db
      .update(design)
      .set({
        viewCount: sql`${design.viewCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(design.id, designId))

    const viewCount = designRecord.status === "approved" ? await getPublicViewCount(designId) : 0

    return success(c, {
      success: true,
      isNewView: true,
      viewCount
    })
  } catch (error) {
    logError("RecordView", error)
    return internalError(c, "Failed to record view")
  }
})

// Record a download for a design
app.post("/:id/download", async (c) => {
  const designId = c.req.param("id")

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(designId)) {
    return badRequest(c, "Invalid design ID format")
  }

  try {
    const [designRecord] = await db
      .select({ id: design.id, status: design.status, userId: design.userId })
      .from(design)
      .where(eq(design.id, designId))
      .limit(1)

    if (!designRecord) {
      return notFound(c, "Design")
    }

    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    })

    const userId = session?.user?.id

    // Record the download
    await db.insert(designDownload).values({
      id: randomUUID(),
      designId,
      userId: userId || null,
      downloadedAt: new Date(),
    })

    // Update cached download count on design
    await db
      .update(design)
      .set({
        downloadCount: sql`${design.downloadCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(design.id, designId))

    const downloadCount = designRecord.status === "approved" ? await getPublicDownloadCount(designId) : 0

    return success(c, {
      success: true,
      downloadCount
    })
  } catch (error) {
    logError("RecordDownload", error)
    return internalError(c, "Failed to record download")
  }
})

// Update design
app.put("/:id", validateBody(updateDesignSchema), async (c) => {
  const id = c.req.param("id")
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session) {
    return unauthorized(c)
  }

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(id)) {
    return badRequest(c, "Invalid design ID format")
  }

  try {
    const body = getValidatedBody<typeof updateDesignSchema._type>(c)

    const [existingDesign] = await db
      .select()
      .from(design)
      .where(eq(design.id, id))
      .limit(1)

    if (!existingDesign) {
      return notFound(c, "Design")
    }

    if (existingDesign.userId !== session.user.id) {
      return forbidden(c)
    }

    const [updatedDesign] = await db
      .update(design)
      .set({
        name: body.name || existingDesign.name,
        description: body.description !== undefined ? body.description : existingDesign.description,
        category: body.category || existingDesign.category,
        content: body.content || existingDesign.content,
        demoUrl: body.demoUrl !== undefined ? body.demoUrl : existingDesign.demoUrl,
        thumbnailUrl: body.thumbnailUrl !== undefined ? body.thumbnailUrl : existingDesign.thumbnailUrl,
        status: body.status !== undefined ? body.status : existingDesign.status,
        files: body.files !== undefined ? (body.files ? JSON.stringify(body.files) : null) : existingDesign.files,
        updatedAt: new Date(),
      })
      .where(eq(design.id, id))
      .returning()

    return success(c, { design: updatedDesign })
  } catch (error) {
    logError("UpdateDesign", error)
    return internalError(c, "Failed to update design")
  }
})

// Toggle design visibility
app.patch("/:id/visibility", async (c) => {
  const id = c.req.param("id")
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session) {
    return unauthorized(c)
  }

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(id)) {
    return badRequest(c, "Invalid design ID format")
  }

  try {
    const body = await c.req.json()
    const { status } = body

    // Validate status value
    if (!["draft", "pending", "approved", "rejected"].includes(status)) {
      return badRequest(c, "Invalid status value")
    }

    const [existingDesign] = await db
      .select()
      .from(design)
      .where(eq(design.id, id))
      .limit(1)

    if (!existingDesign) {
      return notFound(c, "Design")
    }

    if (existingDesign.userId !== session.user.id) {
      return forbidden(c)
    }

    const [updatedDesign] = await db
      .update(design)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(design.id, id))
      .returning()

    return success(c, { design: updatedDesign })
  } catch (error) {
    logError("UpdateVisibility", error)
    return internalError(c, "Failed to update visibility")
  }
})

// Delete design
app.delete("/:id", async (c) => {
  const id = c.req.param("id")
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session) {
    return unauthorized(c)
  }

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(id)) {
    return badRequest(c, "Invalid design ID format")
  }

  try {
    const [existingDesign] = await db
      .select()
      .from(design)
      .where(eq(design.id, id))
      .limit(1)

    if (!existingDesign) {
      return notFound(c, "Design")
    }

    if (existingDesign.userId !== session.user.id) {
      return forbidden(c)
    }

    await db
      .delete(design)
      .where(eq(design.id, id))

    return success(c, { success: true })
  } catch (error) {
    logError("DeleteDesign", error)
    return internalError(c, "Failed to delete design")
  }
})

export default app
