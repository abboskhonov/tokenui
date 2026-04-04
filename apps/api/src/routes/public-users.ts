import { Hono } from "hono"
import { eq, and, desc, count } from "drizzle-orm"
import { db } from "../db"
import { user, design } from "../db/schema"
import type { AuthContext } from "../types"
import { success, notFound, internalError, logError } from "../utils/errors"

const app = new Hono<AuthContext>()

// Get public user profile by username
app.get("/:username", async (c) => {
  const username = c.req.param("username")

  try {
    const [userRecord] = await db
      .select({
        id: user.id,
        name: user.name,
        username: user.username,
        image: user.image,
        bio: user.bio,
        website: user.website,
        github: user.github,
        x: user.x,
        telegram: user.telegram,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(eq(user.username, username))
      .limit(1)

    if (!userRecord) {
      return notFound(c, "User")
    }

    // Run designs and count queries in parallel
    const [designs, [{ count: designCount }]] = await Promise.all([
      db
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
        })
        .from(design)
        .where(and(
          eq(design.userId, userRecord.id),
          eq(design.status, "approved")
        ))
        .orderBy(desc(design.createdAt))
        .limit(50),
      db
        .select({ count: count() })
        .from(design)
        .where(and(
          eq(design.userId, userRecord.id),
          eq(design.status, "approved")
        ))
    ])

    return success(c, {
      user: userRecord,
      designs,
      stats: {
        components: designCount,
        followers: 0,
        following: 0,
      }
    })
  } catch (error) {
    logError("FetchUserProfile", error)
    return internalError(c, "Failed to fetch user profile")
  }
})

export default app
