import { Hono } from "hono"
import { eq, desc, count, sql, and } from "drizzle-orm"
import { db } from "../db"
import { design, user, bookmark } from "../db/schema"
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

export default adminRoutes
