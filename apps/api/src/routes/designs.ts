import { Hono } from "hono"
import { eq, and, desc, count, like, or, sql, gte, inArray } from "drizzle-orm"
import { randomUUID } from "crypto"
import { db } from "../db"
import { user, design, designView, designDownload, star, bookmark, designInstall } from "../db/schema"
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
  const session = c.get("session")

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
        demoHtml: body.demoHtml?.trim() || null, // NEW: Store HTML content directly
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
  const session = c.get("session")

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

    // Get install counts subquery
    const installCountSubquery = db
      .select({
        designId: designInstall.designId,
        count: sql<number>`COUNT(*)`.as("count"),
      })
      .from(designInstall)
      .groupBy(designInstall.designId)
      .as("install_counts")

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
        downloadCount: design.downloadCount,
        installCount: sql<number>`COALESCE(${installCountSubquery.count}, 0)`.as("install_count"),
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
      .leftJoin(installCountSubquery, eq(installCountSubquery.designId, design.id))
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
  const session = c.get("session")

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
// OPTIMIZED: Single SQL query WITHOUT files/content for fast initial load
// Files/content are lazy-loaded via separate /files endpoint when user clicks Code tab
app.get("/:username/:slug", async (c) => {
  const username = c.req.param("username")
  const slug = c.req.param("slug")

  // Validate username and slug format
  const validFormat = /^[a-zA-Z0-9_-]+$/
  if (!validFormat.test(username) || !validFormat.test(slug)) {
    return badRequest(c, "Invalid username or slug format")
  }

  // Get session for user-specific data (isStarred, isBookmarked)
  const session = c.get("session")
  const currentUserId = session?.user?.id

  try {
    // Single optimized query - includes content (for preview) but NOT files (heavy JSON)
    // Files are loaded separately via /:username/:slug/files endpoint when user clicks Code tab
    const result = await db.execute(sql`
      SELECT 
        d.id,
        d.name,
        d.slug,
        d.description,
        d.category,
        d.content,
        d.demo_url as "demoUrl",
        d.demo_html as "demoHtml",
        d.thumbnail_url as "thumbnailUrl",
        d.status,
        d.view_count as "viewCount",
        d.created_at as "createdAt",
        d.updated_at as "updatedAt",
        d.user_id as "userId",
        u.name as "authorName",
        u.username as "authorUsername",
        u.image as "authorImage",
        COALESCE(s.count, 0) as "starCount",
        COALESCE(dl.count, 0) as "downloadCount",
        CASE WHEN us.star_id IS NOT NULL THEN true ELSE false END as "isStarred",
        CASE WHEN ub.bookmark_id IS NOT NULL THEN true ELSE false END as "isBookmarked"
      FROM ${design} d
      INNER JOIN ${user} u ON d.user_id = u.id
      LEFT JOIN (
        SELECT design_id, COUNT(*) as count 
        FROM ${star} 
        GROUP BY design_id
      ) s ON s.design_id = d.id
      LEFT JOIN (
        SELECT design_id, COUNT(*) as count 
        FROM ${designDownload} 
        GROUP BY design_id
      ) dl ON dl.design_id = d.id
      LEFT JOIN (
        SELECT design_id as star_id 
        FROM ${star} 
        WHERE user_id = ${currentUserId || null}
      ) us ON us.star_id = d.id
      LEFT JOIN (
        SELECT design_id as bookmark_id 
        FROM ${bookmark} 
        WHERE user_id = ${currentUserId || null}
      ) ub ON ub.bookmark_id = d.id
      WHERE u.username = ${username} 
        AND d.slug = ${slug}
      LIMIT 1
    `)

    if (result.rows.length === 0) {
      return notFound(c, "Design")
    }

    const row = result.rows[0] as Record<string, unknown>

    // Check authorization
    if (row.status !== "approved" && (!session || session.user.id !== row.userId)) {
      return forbidden(c)
    }

    // Build design object WITH content (for preview) but WITHOUT files (lazy loaded)
    const designRecord = {
      id: row.id as string,
      name: row.name as string,
      slug: row.slug as string,
      description: row.description as string | null,
      category: row.category as string,
      content: row.content as string, // Included for preview
      demoUrl: row.demoUrl as string | null,
      demoHtml: row.demoHtml as string | null, // NEW
      thumbnailUrl: row.thumbnailUrl as string | null,
      status: row.status as string,
      viewCount: Number(row.viewCount || 0),
      // files is NOT included - lazy loaded via /files endpoint
      createdAt: row.createdAt as Date,
      updatedAt: row.updatedAt as Date,
      userId: row.userId as string,
      author: {
        name: row.authorName as string | null,
        username: row.authorUsername as string,
        image: row.authorImage as string | null,
      },
      starCount: Number(row.starCount || 0),
      downloadCount: Number(row.downloadCount || 0),
      isStarred: row.isStarred as boolean,
      isBookmarked: row.isBookmarked as boolean,
    }

    return success(c, { design: designRecord })
  } catch (error) {
    logError("FetchDesignBySlug", error)
    return internalError(c, "Failed to fetch design")
  }
})

// Get design files (lazy loaded when user switches to Code tab)
// Content is already included in main design endpoint for preview
// This endpoint only returns the files JSON which can be large
app.get("/:username/:slug/files", async (c) => {
  const username = c.req.param("username")
  const slug = c.req.param("slug")

  // Validate username and slug format
  const validFormat = /^[a-zA-Z0-9_-]+$/
  if (!validFormat.test(username) || !validFormat.test(slug)) {
    return badRequest(c, "Invalid username or slug format")
  }

  try {
    const result = await db.execute(sql`
      SELECT 
        d.id,
        d.files
      FROM ${design} d
      INNER JOIN ${user} u ON d.user_id = u.id
      WHERE u.username = ${username} 
        AND d.slug = ${slug}
        AND d.status = 'approved'
      LIMIT 1
    `)

    if (result.rows.length === 0) {
      return notFound(c, "Design")
    }

    const row = result.rows[0] as { id: string; files: string | null }

    return success(c, {
      id: row.id,
      files: parseFiles(row.files),
    })
  } catch (error) {
    logError("FetchDesignFiles", error)
    return internalError(c, "Failed to fetch design files")
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

    const session = c.get("session")
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

    const session = c.get("session")
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
  const session = c.get("session")

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
        demoHtml: body.demoHtml !== undefined ? body.demoHtml?.trim() || null : existingDesign.demoHtml, // NEW
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
  const session = c.get("session")

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
  const session = c.get("session")

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
