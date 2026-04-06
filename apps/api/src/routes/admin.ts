import { Hono } from "hono"
import { eq, desc, count, sql, and } from "drizzle-orm"
import { db } from "../db"
import { design, user, bookmark, cliRun, designView } from "../db/schema"
import type { AuthContext } from "../types"

const adminRoutes = new Hono<AuthContext>()

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
    // Total users
    const [userCount] = await db
      .select({ count: count() })
      .from(user)
    
    // Total designs
    const [designCount] = await db
      .select({ count: count() })
      .from(design)
    
    // Pending review (status = "pending")
    const [pendingCount] = await db
      .select({ count: count() })
      .from(design)
      .where(eq(design.status, "pending"))
    
    // Approved today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const [approvedToday] = await db
      .select({ count: count() })
      .from(design)
      .where(
        and(
          eq(design.status, "approved"),
          sql`${design.updatedAt} >= ${today.toISOString()}`
        )
      )
    
    return c.json({
      totalUsers: userCount?.count || 0,
      totalDesigns: designCount?.count || 0,
      pendingReview: pendingCount?.count || 0,
      approvedToday: approvedToday?.count || 0,
    })
  } catch (error) {
    console.error("Admin stats error:", error)
    return c.json({ error: "Failed to fetch stats" }, 500)
  }
})

// Get all users with their design counts
adminRoutes.get("/users", async (c) => {
  try {
    const users = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        image: user.image,
        role: user.role,
        createdAt: user.createdAt,
      })
      .from(user)
      .orderBy(desc(user.createdAt))
    
    // Get design counts for each user
    const usersWithCounts = await Promise.all(
      users.map(async (u) => {
        const [designCount] = await db
          .select({ count: count() })
          .from(design)
          .where(eq(design.userId, u.id))
        
        return {
          ...u,
          designs: designCount?.count || 0,
        }
      })
    )
    
    return c.json({ users: usersWithCounts })
  } catch (error) {
    console.error("Admin users error:", error)
    return c.json({ error: "Failed to fetch users" }, 500)
  }
})

// Get all designs with pagination
adminRoutes.get("/designs", async (c) => {
  try {
    const limit = Math.min(parseInt(c.req.query("limit") || "20"), 50)
    const offset = parseInt(c.req.query("offset") || "0")
    
    const designs = await db
      .select({
        id: design.id,
        name: design.name,
        slug: design.slug,
        category: design.category,
        status: design.status,
        reviewMessage: design.reviewMessage,
        thumbnailUrl: design.thumbnailUrl,
        viewCount: design.viewCount,
        createdAt: design.createdAt,
        updatedAt: design.updatedAt,
        userId: design.userId,
      })
      .from(design)
      .orderBy(desc(design.createdAt))
      .limit(limit)
      .offset(offset)
    
    // Get total count for pagination
    const [countResult] = await db
      .select({ count: count() })
      .from(design)
    
    // Get author info for each design
    const designsWithAuthors = await Promise.all(
      designs.map(async (d) => {
        const [author] = await db
          .select({
            name: user.name,
            username: user.username,
          })
          .from(user)
          .where(eq(user.id, d.userId))
          .limit(1)
        
        return {
          ...d,
          author: author?.username || author?.name || "Unknown",
        }
      })
    )
    
    return c.json({ 
      designs: designsWithAuthors,
      pagination: { 
        limit, 
        offset, 
        total: countResult?.count || 0,
        hasMore: designs.length === limit 
      }
    })
  } catch (error) {
    console.error("Admin designs error:", error)
    return c.json({ error: "Failed to fetch designs" }, 500)
  }
})

// Get pending review designs
adminRoutes.get("/designs/pending", async (c) => {
  try {
    const pendingDesigns = await db
      .select({
        id: design.id,
        name: design.name,
        slug: design.slug,
        description: design.description,
        category: design.category,
        content: design.content,
        thumbnailUrl: design.thumbnailUrl,
        demoUrl: design.demoUrl,
        createdAt: design.createdAt,
        userId: design.userId,
      })
      .from(design)
      .where(eq(design.status, "pending"))
      .orderBy(desc(design.createdAt))
    
    // Get author info
    const designsWithAuthors = await Promise.all(
      pendingDesigns.map(async (d) => {
        const [author] = await db
          .select({
            name: user.name,
            username: user.username,
            image: user.image,
          })
          .from(user)
          .where(eq(user.id, d.userId))
          .limit(1)
        
        return {
          ...d,
          author: author?.username || author?.name || "Unknown",
          authorImage: author?.image,
        }
      })
    )
    
    return c.json({ designs: designsWithAuthors })
  } catch (error) {
    console.error("Admin pending designs error:", error)
    return c.json({ error: "Failed to fetch pending designs" }, 500)
  }
})

// Approve a design
adminRoutes.post("/designs/:id/approve", async (c) => {
  try {
    const designId = c.req.param("id")
    const body = await c.req.json()
    const { message } = body // Optional approval message
    
    await db
      .update(design)
      .set({ 
        status: "approved",
        reviewMessage: message || null,
        updatedAt: new Date(),
      })
      .where(eq(design.id, designId))
    
    return c.json({ success: true, message: "Design approved" })
  } catch (error) {
    console.error("Approve design error:", error)
    return c.json({ error: "Failed to approve design" }, 500)
  }
})

// Reject a design
adminRoutes.post("/designs/:id/reject", async (c) => {
  try {
    const designId = c.req.param("id")
    const body = await c.req.json()
    const { message } = body // Rejection reason/message
    
    await db
      .update(design)
      .set({ 
        status: "rejected",
        reviewMessage: message || null,
        updatedAt: new Date(),
      })
      .where(eq(design.id, designId))
    
    return c.json({ success: true, message: "Design rejected" })
  } catch (error) {
    console.error("Reject design error:", error)
    return c.json({ error: "Failed to reject design" }, 500)
  }
})

// Get CLI run analytics
adminRoutes.get("/analytics/cli", async (c) => {
  try {
    // Calculate last 7 days
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      days.push(date)
    }

    // Get runs for each day
    const dailyInstalls = await Promise.all(
      days.map(async (day) => {
        const nextDay = new Date(day)
        nextDay.setDate(nextDay.getDate() + 1)

        const dayStr = day.toISOString()
        const nextDayStr = nextDay.toISOString()

        const result = await db.execute(sql`
          SELECT COUNT(*) as count 
          FROM cli_run 
          WHERE run_at >= ${dayStr}::timestamp
            AND run_at < ${nextDayStr}::timestamp
        `)

        return Number(result.rows[0]?.count || 0)
      })
    )

    // Get total runs
    const totalResult = await db.execute(sql`
      SELECT COUNT(*) as count FROM cli_run
    `)

    // Get version breakdown
    const versionResult = await db.execute(sql`
      SELECT version, COUNT(*) as count 
      FROM cli_run 
      GROUP BY version 
      ORDER BY count DESC
    `)

    return c.json({
      dailyInstalls,
      totalInstalls: Number(totalResult.rows[0]?.count || 0),
      uniqueInstalls: 0,  // Not tracking unique machines (anonymous)
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
    const days = []
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

        const dayStr = day.toISOString()
        const nextDayStr = nextDay.toISOString()

        const result = await db.execute(sql`
          SELECT COUNT(*) as count 
          FROM design_view 
          WHERE viewed_at >= ${dayStr}::timestamp
            AND viewed_at < ${nextDayStr}::timestamp
        `)

        return Number(result.rows[0]?.count || 0)
      })
    )

    // Get total views
    const totalResult = await db.execute(sql`
      SELECT COUNT(*) as count FROM design_view
    `)

    // Get unique viewers (by user_id or ip_hash)
    const uniqueResult = await db.execute(sql`
      SELECT COUNT(DISTINCT COALESCE(user_id, ip_hash)) as count FROM design_view
    `)

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

// Get top viewed designs
adminRoutes.get("/analytics/top-designs", async (c) => {
  try {
    const limit = Math.min(parseInt(c.req.query("limit") || "10"), 50)
    
    // Get designs with their view counts, ordered by views
    const topDesigns = await db
      .select({
        id: design.id,
        name: design.name,
        slug: design.slug,
        category: design.category,
        thumbnailUrl: design.thumbnailUrl,
        viewCount: design.viewCount,
        userId: design.userId,
      })
      .from(design)
      .orderBy(desc(design.viewCount))
      .limit(limit)

    // Get author info for each design
    const designsWithAuthors = await Promise.all(
      topDesigns.map(async (d) => {
        const [author] = await db
          .select({
            name: user.name,
            username: user.username,
          })
          .from(user)
          .where(eq(user.id, d.userId))
          .limit(1)

        return {
          ...d,
          author: author?.username || author?.name || "Unknown",
        }
      })
    )

    return c.json({ designs: designsWithAuthors })
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

    // Get today's stats
    const [userCount] = await db
      .select({ count: count() })
      .from(user)

    const [designCount] = await db
      .select({ count: count() })
      .from(design)

    const [cliRunCount] = await db
      .select({ count: count() })
      .from(cliRun)

    const [totalViews] = await db
      .select({ count: count() })
      .from(designView)

    // Get today's views
    const todayViewsResult = await db.execute(sql`
      SELECT COUNT(*) as count 
      FROM design_view 
      WHERE viewed_at >= ${today.toISOString()}::timestamp
    `)

    // Get today's CLI runs
    const todayRunsResult = await db.execute(sql`
      SELECT COUNT(*) as count 
      FROM cli_run 
      WHERE run_at >= ${today.toISOString()}::timestamp
    `)

    // Get new users today
    const [newUsersToday] = await db
      .select({ count: count() })
      .from(user)
      .where(sql`${user.createdAt} >= ${today.toISOString()}::timestamp`)

    return c.json({
      totalUsers: userCount?.count || 0,
      totalDesigns: designCount?.count || 0,
      totalCliInstalls: cliRunCount?.count || 0,
      totalViews: totalViews?.count || 0,
      viewsToday: Number(todayViewsResult.rows[0]?.count || 0),
      installsToday: Number(todayRunsResult.rows[0]?.count || 0),
      newUsersToday: newUsersToday?.count || 0,
    })
  } catch (error) {
    console.error("Summary analytics error:", error)
    return c.json({ error: "Failed to fetch summary" }, 500)
  }
})

export default adminRoutes
