import { Hono } from "hono"
import { eq, and, count, sql } from "drizzle-orm"
import { auth } from "../auth"
import { db } from "../db"
import { design, designView } from "../db/schema"
import type { AuthContext } from "../types"
import { success, unauthorized, internalError, logError } from "../utils/errors"

const app = new Hono<AuthContext>()

// Get view analytics for user's designs (last 7 days)
app.get("/views", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session) {
    return unauthorized(c)
  }

  try {
    // Get user's designs first
    const userDesigns = await db
      .select({ id: design.id })
      .from(design)
      .where(eq(design.userId, session.user.id))

    const designIds = userDesigns.map(d => d.id)

    if (designIds.length === 0) {
      return success(c, {
        dailyViews: Array(7).fill(0),
        totalViews: 0
      })
    }

    // Calculate last 7 days
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      days.push(date)
    }

    // Get views for each day using raw SQL with proper parameter binding
    const dailyViews = await Promise.all(
      days.map(async (day) => {
        const nextDay = new Date(day)
        nextDay.setDate(nextDay.getDate() + 1)

        const dayStr = day.toISOString()
        const nextDayStr = nextDay.toISOString()

        const result = await db.execute(sql`
          SELECT COUNT(*) as count 
          FROM design_view 
          WHERE design_id IN (${sql.join(designIds.map(id => sql`${id}`), sql`, `)})
            AND viewed_at >= ${dayStr}::timestamp
            AND viewed_at < ${nextDayStr}::timestamp
        `)

        return Number(result.rows[0]?.count || 0)
      })
    )

    // Get total views
    const totalResult = await db.execute(sql`
      SELECT COUNT(*) as count 
      FROM design_view 
      WHERE design_id IN (${sql.join(designIds.map(id => sql`${id}`), sql`, `)})
    `)

    return success(c, {
      dailyViews,
      totalViews: Number(totalResult.rows[0]?.count || 0)
    })
  } catch (error) {
    logError("FetchViewAnalytics", error)
    return internalError(c, "Failed to fetch analytics")
  }
})

export default app
