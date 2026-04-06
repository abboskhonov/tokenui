import { Hono } from "hono"
import { eq, sql } from "drizzle-orm"
import { db } from "../db"
import { cliRun, user } from "../db/schema"
import { success, internalError, logError } from "../utils/errors"
import type { AuthContext } from "../types"

const app = new Hono<AuthContext>()

// Track CLI run - public endpoint (no auth required)
// Simple anonymous counter - just +1 in the database
app.post("/run", async (c) => {
  try {
    const body = await c.req.json<{
      version?: string
      command?: string
    }>()

    // Record anonymous run - no machine ID, no IP tracking
    await db.insert(cliRun).values({
      id: crypto.randomUUID(),
      version: body.version || "unknown",
      command: body.command || null,
    })

    return success(c, { 
      success: true,
      message: "Run tracked" 
    })
  } catch (error) {
    logError("TrackCliRun", error)
    return internalError(c, "Failed to track")
  }
})

// Get CLI run analytics - admin only
app.get("/analytics", async (c) => {
  const session = c.get("session")

  if (!session?.user) {
    return c.json({ error: "Unauthorized" }, 401)
  }

  try {
    // Check if user is admin
    const [userData] = await db
      .select({ role: user.role })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1)

    if (userData?.role !== "admin") {
      return c.json({ error: "Forbidden" }, 403)
    }

    // Calculate last 7 days
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      days.push(date)
    }

    // Get runs for each day
    const dailyRuns = await Promise.all(
      days.map(async (day) => {
        const nextDay = new Date(day)
        nextDay.setDate(nextDay.getDate() + 1)

        const result = await db.execute(sql`
          SELECT COUNT(*) as count 
          FROM cli_run 
          WHERE run_at >= ${day.toISOString()}::timestamp
            AND run_at < ${nextDay.toISOString()}::timestamp
        `)

        return Number(result.rows[0]?.count || 0)
      })
    )

    // Get total runs
    const totalResult = await db.execute(sql`
      SELECT COUNT(*) as count FROM cli_run
    `)

    return success(c, {
      dailyInstalls: dailyRuns,
      dailyRuns: dailyRuns,  // Alias for StudioStats component
      totalInstalls: Number(totalResult.rows[0]?.count || 0),
      totalRuns: Number(totalResult.rows[0]?.count || 0),  // Alias for StudioStats component
      uniqueInstalls: 0,
      uniqueMachines: 0,  // Alias for StudioStats component
    })
  } catch (error) {
    logError("FetchCliAnalytics", error)
    return internalError(c, "Failed to fetch analytics")
  }
})

export default app
