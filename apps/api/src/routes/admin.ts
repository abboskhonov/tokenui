import { Hono } from "hono"
import { eq, desc, count, sql, and } from "drizzle-orm"
import { z } from "zod"
import { db } from "../db"
import { design, user, bookmark, cliRun, designView } from "../db/schema"
import type { AuthContext } from "../types"
import { badRequest } from "../utils/errors"
import { validateBody, validateParams, getValidatedBody, getValidatedParams } from "../middleware/validation"

const adminRoutes = new Hono<AuthContext>()

// Validation schemas
const designIdSchema = z.object({
  id: z.string().uuid("Invalid design ID"),
})

const reviewSchema = z.object({
  message: z.string().max(500, "Message too long").optional(),
})

// Admin middleware - check if user is admin
adminRoutes.use("*", async (c, next) => {
  const session = c.get("session")

  if (!session?.user) {
    return c.json({ error: "Unauthorized" }, 401)
  }

  // Check if user is admin by role
  const [userData] = await db
    .select({ role: user.role })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1)

  if (userData?.role !== "admin") {
    return c.json({ error: "Forbidden - Admin access required" }, 403)
  }

  await next()
})

// Get admin dashboard stats
adminRoutes.get("/stats", async (c) => {
  try {
    // Single query for all stats
    const statsResult = await db.execute(sql`
      SELECT 
        (SELECT COUNT(*) FROM ${user}) as total_users,
        (SELECT COUNT(*) FROM ${design}) as total_designs,
        (SELECT COUNT(*) FROM ${design} WHERE status = 'pending') as pending_review,
        (SELECT COUNT(*) FROM ${design} 
         WHERE status = 'approved' 
         AND updated_at >= ${new Date().toISOString()}::timestamp) as approved_today
    `)

    const stats = statsResult.rows[0] as { 
      total_users: string | number
      total_designs: string | number
      pending_review: string | number
      approved_today: string | number
    }

    return c.json({
      totalUsers: Number(stats?.total_users || 0),
      totalDesigns: Number(stats?.total_designs || 0),
      pendingReview: Number(stats?.pending_review || 0),
      approvedToday: Number(stats?.approved_today || 0),
    })
  } catch (error) {
    console.error("Admin stats error:", error)
    return c.json({ error: "Failed to fetch stats" }, 500)
  }
})

// Get all users with their design counts - OPTIMIZED with single query
adminRoutes.get("/users", async (c) => {
  try {
    const usersWithCounts = await db.execute(sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.username,
        u.image,
        u.role,
        u.created_at,
        COUNT(d.id) as designs
      FROM ${user} u
      LEFT JOIN ${design} d ON d.user_id = u.id
      GROUP BY u.id, u.name, u.email, u.username, u.image, u.role, u.created_at
      ORDER BY u.created_at DESC
    `)

    return c.json({
      users: usersWithCounts.rows.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        username: u.username,
        image: u.image,
        role: u.role,
        createdAt: u.created_at,
        designs: Number(u.designs),
      })),
    })
  } catch (error) {
    console.error("Admin users error:", error)
    return c.json({ error: "Failed to fetch users" }, 500)
  }
})

// Get all designs with pagination - OPTIMIZED with join
adminRoutes.get("/designs", async (c) => {
  try {
    const limit = Math.min(parseInt(c.req.query("limit") || "20"), 50)
    const offset = parseInt(c.req.query("offset") || "0")

    // Single query with join for author info
    const designsWithAuthors = await db.execute(sql`
      SELECT 
        d.id,
        d.name,
        d.slug,
        d.category,
        d.status,
        d.review_message as "reviewMessage",
        d.thumbnail_url as "thumbnailUrl",
        d.view_count as "viewCount",
        d.created_at as "createdAt",
        d.updated_at as "updatedAt",
        d.user_id as "userId",
        COALESCE(u.username, u.name, 'Unknown') as author
      FROM ${design} d
      LEFT JOIN ${user} u ON u.id = d.user_id
      ORDER BY d.created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `)

    // Get total count
    const [countResult] = await db
      .select({ count: count() })
      .from(design)

    return c.json({
      designs: designsWithAuthors.rows,
      pagination: {
        limit,
        offset,
        total: countResult?.count || 0,
        hasMore: designsWithAuthors.rows.length === limit,
      },
    })
  } catch (error) {
    console.error("Admin designs error:", error)
    return c.json({ error: "Failed to fetch designs" }, 500)
  }
})

// Get pending review designs - OPTIMIZED with join
adminRoutes.get("/designs/pending", async (c) => {
  try {
    const pendingDesigns = await db.execute(sql`
      SELECT 
        d.id,
        d.name,
        d.slug,
        d.description,
        d.category,
        d.content,
        d.thumbnail_url,
        d.demo_url,
        d.created_at,
        d.user_id,
        u.name as author_name,
        u.username as author_username,
        u.image as author_image
      FROM ${design} d
      LEFT JOIN ${user} u ON u.id = d.user_id
      WHERE d.status = 'pending'
      ORDER BY d.created_at DESC
    `)

    return c.json({
      designs: pendingDesigns.rows.map((d: any) => ({
        id: d.id,
        name: d.name,
        slug: d.slug,
        description: d.description,
        category: d.category,
        content: d.content,
        thumbnailUrl: d.thumbnail_url,
        demoUrl: d.demo_url,
        createdAt: d.created_at,
        userId: d.user_id,
        author: d.author_username || d.author_name || "Unknown",
        authorImage: d.author_image,
      })),
    })
  } catch (error) {
    console.error("Admin pending designs error:", error)
    return c.json({ error: "Failed to fetch pending designs" }, 500)
  }
})

// Approve a design
adminRoutes.post(
  "/designs/:id/approve",
  validateParams(designIdSchema),
  validateBody(reviewSchema),
  async (c) => {
    try {
      const { id } = getValidatedParams<typeof designIdSchema._type>(c)
      const { message } = getValidatedBody<typeof reviewSchema._type>(c)

      await db
        .update(design)
        .set({
          status: "approved",
          reviewMessage: message || null,
          updatedAt: new Date(),
          publishedAt: new Date(), // Set published date when approved
        })
        .where(eq(design.id, id))

      return c.json({ success: true, message: "Design approved" })
    } catch (error) {
      console.error("Approve design error:", error)
      return c.json({ error: "Failed to approve design" }, 500)
    }
  }
)

// Reject a design
adminRoutes.post(
  "/designs/:id/reject",
  validateParams(designIdSchema),
  validateBody(reviewSchema),
  async (c) => {
    try {
      const { id } = getValidatedParams<typeof designIdSchema._type>(c)
      const { message } = getValidatedBody<typeof reviewSchema._type>(c)

      await db
        .update(design)
        .set({
          status: "rejected",
          reviewMessage: message || null,
          updatedAt: new Date(),
        })
        .where(eq(design.id, id))

      return c.json({ success: true, message: "Design rejected" })
    } catch (error) {
      console.error("Reject design error:", error)
      return c.json({ error: "Failed to reject design" }, 500)
    }
  }
)

// Get CLI run analytics
adminRoutes.get("/analytics/cli", async (c) => {
  try {
    // Calculate last 7 days
    const days: Date[] = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      days.push(date)
    }

    // Single query for all daily stats
    const dailyStatsResult = await Promise.all(
      days.map(async (day) => {
        const nextDay = new Date(day)
        nextDay.setDate(nextDay.getDate() + 1)

        const result = await db.execute(sql`
          SELECT COUNT(*) as count 
          FROM ${cliRun}
          WHERE run_at >= ${day.toISOString()}::timestamp
            AND run_at < ${nextDay.toISOString()}::timestamp
        `)

        return Number(result.rows[0]?.count || 0)
      })
    )

    // Get total and version breakdown
    const [totalResult, versionResult] = await Promise.all([
      db.execute(sql`SELECT COUNT(*) as count FROM ${cliRun}`),
      db.execute(sql`
        SELECT version, COUNT(*) as count 
        FROM ${cliRun}
        GROUP BY version 
        ORDER BY count DESC
      `),
    ])

    return c.json({
      dailyInstalls: dailyStatsResult,
      totalInstalls: Number(totalResult.rows[0]?.count || 0),
      uniqueInstalls: 0, // Not tracking unique machines (anonymous)
      versionBreakdown: versionResult.rows,
    })
  } catch (error) {
    console.error("CLI analytics error:", error)
    return c.json({ error: "Failed to fetch CLI analytics" }, 500)
  }
})

// Get global view analytics
adminRoutes.get("/analytics/views", async (c) => {
  try {
    // Calculate last 7 days
    const days: Date[] = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      days.push(date)
    }

    // Get views for each day
    const dailyViews = await Promise.all(
      days.map(async (day) => {
        const nextDay = new Date(day)
        nextDay.setDate(nextDay.getDate() + 1)

        const result = await db.execute(sql`
          SELECT COUNT(*) as count 
          FROM ${designView}
          WHERE viewed_at >= ${day.toISOString()}::timestamp
            AND viewed_at < ${nextDay.toISOString()}::timestamp
        `)

        return Number(result.rows[0]?.count || 0)
      })
    )

    // Get total and unique viewers
    const [totalResult, uniqueResult] = await Promise.all([
      db.execute(sql`SELECT COUNT(*) as count FROM ${designView}`),
      db.execute(sql`
        SELECT COUNT(DISTINCT COALESCE(user_id, ip_hash)) as count 
        FROM ${designView}
      `),
    ])

    return c.json({
      dailyViews,
      totalViews: Number(totalResult.rows[0]?.count || 0),
      uniqueViewers: Number(uniqueResult.rows[0]?.count || 0),
    })
  } catch (error) {
    console.error("View analytics error:", error)
    return c.json({ error: "Failed to fetch view analytics" }, 500)
  }
})

// Get top viewed designs - OPTIMIZED with join
adminRoutes.get("/analytics/top-designs", async (c) => {
  try {
    const limit = Math.min(parseInt(c.req.query("limit") || "10"), 50)

    // Single query with join
    const topDesigns = await db.execute(sql`
      SELECT 
        d.id,
        d.name,
        d.slug,
        d.category,
        d.thumbnail_url as "thumbnailUrl",
        d.view_count as "viewCount",
        d.user_id as "userId",
        COALESCE(u.username, u.name, 'Unknown') as author
      FROM ${design} d
      LEFT JOIN ${user} u ON u.id = d.user_id
      ORDER BY d.view_count DESC
      LIMIT ${limit}
    `)

    return c.json({ designs: topDesigns.rows })
  } catch (error) {
    console.error("Top designs error:", error)
    return c.json({ error: "Failed to fetch top designs" }, 500)
  }
})

// Get platform analytics summary
adminRoutes.get("/analytics/summary", async (c) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Single query for all stats
    const summaryResult = await db.execute(sql`
      SELECT 
        (SELECT COUNT(*) FROM ${user}) as total_users,
        (SELECT COUNT(*) FROM ${design}) as total_designs,
        (SELECT COUNT(*) FROM ${cliRun}) as total_cli_runs,
        (SELECT COUNT(*) FROM ${designView}) as total_views,
        (SELECT COUNT(*) FROM ${designView} 
         WHERE viewed_at >= ${today.toISOString()}::timestamp) as views_today,
        (SELECT COUNT(*) FROM ${cliRun} 
         WHERE run_at >= ${today.toISOString()}::timestamp) as installs_today,
        (SELECT COUNT(*) FROM ${user} 
         WHERE created_at >= ${today.toISOString()}::timestamp) as new_users_today
    `)

    const stats = summaryResult.rows[0] as {
      total_users: string | number
      total_designs: string | number
      total_cli_runs: string | number
      total_views: string | number
      views_today: string | number
      installs_today: string | number
      new_users_today: string | number
    }

    return c.json({
      totalUsers: Number(stats?.total_users || 0),
      totalDesigns: Number(stats?.total_designs || 0),
      totalCliInstalls: Number(stats?.total_cli_runs || 0),
      totalViews: Number(stats?.total_views || 0),
      viewsToday: Number(stats?.views_today || 0),
      installsToday: Number(stats?.installs_today || 0),
      newUsersToday: Number(stats?.new_users_today || 0),
    })
  } catch (error) {
    console.error("Summary analytics error:", error)
    return c.json({ error: "Failed to fetch summary" }, 500)
  }
})

export default adminRoutes
