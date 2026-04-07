import { Hono } from "hono"
import { eq, and, count, sql } from "drizzle-orm"
import { auth } from "../auth"
import { db } from "../db"
import { design, designView, star, designDownload } from "../db/schema"
import type { AuthContext } from "../types"
import { success, unauthorized, internalError, logError } from "../utils/errors"

const app = new Hono<AuthContext>()

// Helper to get last 7 days dates
function getLast7Days(): Date[] {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)
    days.push(date)
  }
  return days
}

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

    const days = getLast7Days()

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

// Get star analytics for user's designs (last 7 days)
app.get("/stars", async (c) => {
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
        dailyStars: Array(7).fill(0),
        totalStars: 0
      })
    }

    const days = getLast7Days()

    // Get stars for each day using raw SQL with proper parameter binding
    const dailyStars = await Promise.all(
      days.map(async (day) => {
        const nextDay = new Date(day)
        nextDay.setDate(nextDay.getDate() + 1)

        const dayStr = day.toISOString()
        const nextDayStr = nextDay.toISOString()

        const result = await db.execute(sql`
          SELECT COUNT(*) as count 
          FROM star 
          WHERE design_id IN (${sql.join(designIds.map(id => sql`${id}`), sql`, `)})
            AND created_at >= ${dayStr}::timestamp
            AND created_at < ${nextDayStr}::timestamp
        `)

        return Number(result.rows[0]?.count || 0)
      })
    )

    // Get total stars
    const totalResult = await db.execute(sql`
      SELECT COUNT(*) as count 
      FROM star 
      WHERE design_id IN (${sql.join(designIds.map(id => sql`${id}`), sql`, `)})
    `)

    return success(c, {
      dailyStars,
      totalStars: Number(totalResult.rows[0]?.count || 0)
    })
  } catch (error) {
    logError("FetchStarAnalytics", error)
    return internalError(c, "Failed to fetch star analytics")
  }
})

// Get download analytics for user's designs (last 7 days)
app.get("/downloads", async (c) => {
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
        dailyDownloads: Array(7).fill(0),
        totalDownloads: 0
      })
    }

    const days = getLast7Days()

    // Get downloads for each day using raw SQL with proper parameter binding
    const dailyDownloads = await Promise.all(
      days.map(async (day) => {
        const nextDay = new Date(day)
        nextDay.setDate(nextDay.getDate() + 1)

        const dayStr = day.toISOString()
        const nextDayStr = nextDay.toISOString()

        const result = await db.execute(sql`
          SELECT COUNT(*) as count 
          FROM design_download 
          WHERE design_id IN (${sql.join(designIds.map(id => sql`${id}`), sql`, `)})
            AND downloaded_at >= ${dayStr}::timestamp
            AND downloaded_at < ${nextDayStr}::timestamp
        `)

        return Number(result.rows[0]?.count || 0)
      })
    )

    // Get total downloads
    const totalResult = await db.execute(sql`
      SELECT COUNT(*) as count 
      FROM design_download 
      WHERE design_id IN (${sql.join(designIds.map(id => sql`${id}`), sql`, `)})
    `)

    return success(c, {
      dailyDownloads,
      totalDownloads: Number(totalResult.rows[0]?.count || 0)
    })
  } catch (error) {
    logError("FetchDownloadAnalytics", error)
    return internalError(c, "Failed to fetch download analytics")
  }
})

// Get combined analytics (views + stars + downloads) for user's designs (last 7 days)
app.get("/summary", async (c) => {
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
        totalViews: 0,
        dailyStars: Array(7).fill(0),
        totalStars: 0,
        dailyDownloads: Array(7).fill(0),
        totalDownloads: 0,
      })
    }

    const days = getLast7Days()

    // Get views, stars, and downloads in parallel for each day
    const [dailyViews, dailyStars, dailyDownloads] = await Promise.all([
      Promise.all(
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
      ),
      Promise.all(
        days.map(async (day) => {
          const nextDay = new Date(day)
          nextDay.setDate(nextDay.getDate() + 1)

          const dayStr = day.toISOString()
          const nextDayStr = nextDay.toISOString()

          const result = await db.execute(sql`
            SELECT COUNT(*) as count 
            FROM star 
            WHERE design_id IN (${sql.join(designIds.map(id => sql`${id}`), sql`, `)})
              AND created_at >= ${dayStr}::timestamp
              AND created_at < ${nextDayStr}::timestamp
          `)

          return Number(result.rows[0]?.count || 0)
        })
      ),
      Promise.all(
        days.map(async (day) => {
          const nextDay = new Date(day)
          nextDay.setDate(nextDay.getDate() + 1)

          const dayStr = day.toISOString()
          const nextDayStr = nextDay.toISOString()

          const result = await db.execute(sql`
            SELECT COUNT(*) as count 
            FROM design_download 
            WHERE design_id IN (${sql.join(designIds.map(id => sql`${id}`), sql`, `)})
              AND downloaded_at >= ${dayStr}::timestamp
              AND downloaded_at < ${nextDayStr}::timestamp
          `)

          return Number(result.rows[0]?.count || 0)
        })
      )
    ])

    // Get total views, stars, and downloads in parallel
    const [totalViewsResult, totalStarsResult, totalDownloadsResult] = await Promise.all([
      db.execute(sql`
        SELECT COUNT(*) as count 
        FROM design_view 
        WHERE design_id IN (${sql.join(designIds.map(id => sql`${id}`), sql`, `)})
      `),
      db.execute(sql`
        SELECT COUNT(*) as count 
        FROM star 
        WHERE design_id IN (${sql.join(designIds.map(id => sql`${id}`), sql`, `)})
      `),
      db.execute(sql`
        SELECT COUNT(*) as count 
        FROM design_download 
        WHERE design_id IN (${sql.join(designIds.map(id => sql`${id}`), sql`, `)})
      `)
    ])

    return success(c, {
      dailyViews,
      totalViews: Number(totalViewsResult.rows[0]?.count || 0),
      dailyStars,
      totalStars: Number(totalStarsResult.rows[0]?.count || 0),
      dailyDownloads,
      totalDownloads: Number(totalDownloadsResult.rows[0]?.count || 0),
    })
  } catch (error) {
    logError("FetchSummaryAnalytics", error)
    return internalError(c, "Failed to fetch analytics")
  }
})

export default app
