import { Hono } from "hono"
import { cors } from "hono/cors"
import { config } from "dotenv"
import { auth } from "./auth"
import { user, design } from "./db/schema"
import { db } from "./db"
import { eq, desc } from "drizzle-orm"
import { randomUUID } from "crypto"
import { uploadFile, generateThumbnailKey, validateThumbnail } from "./storage/r2"
import { extname } from "path"

// Load environment variables
config()

const app = new Hono()

// Enable CORS for frontend - must be first!
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"],
    allowHeaders: ["Content-Type", "Authorization", "Accept"],
    allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
    exposeHeaders: ["Content-Length", "Set-Cookie"],
    maxAge: 600,
    credentials: true,
  })
)

// Better Auth - Mount all auth routes
app.all("/api/auth/*", async (c) => {
  const url = new URL(c.req.url)
  
  // Handle OAuth callbacks specially to redirect to frontend
  if (url.pathname.includes("/callback/")) {
    // Process the auth callback - this sets the session cookie
    const response = await auth.handler(c.req.raw)
    
    // Check for error parameter in the original request
    const hasError = url.searchParams.get("error")
    
    if (!hasError && (response.status === 200 || response.status === 302)) {
      // Successful auth - copy cookies from the auth response and redirect to frontend
      const headers = new Headers(response.headers)
      headers.set("Location", "http://localhost:3000")
      
      return new Response(null, {
        status: 302,
        headers: headers,
      })
    }
    
    return response
  }
  
  // Regular auth request
  return auth.handler(c.req.raw)
})

// Health check
app.get("/api/health", async (c) => {
  return c.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    auth: "configured",
    cors: "enabled"
  })
})

// Protected route example
app.get("/api/me", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })
  
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401)
  }
  
  return c.json({ user: session.user })
})

// Get full user profile
app.get("/api/user/profile", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })
  
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401)
  }
  
  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1)
  
  if (!userRecord) {
    return c.json({ error: "User not found" }, 404)
  }
  
  return c.json({ user: userRecord })
})

// Update user profile
app.put("/api/user/profile", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })
  
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401)
  }
  
  const body = await c.req.json()
  
  // Validate input - only allow certain fields
  const allowedFields = ["name", "bio", "website", "github", "x", "telegram", "image"]
  const updateData: Record<string, string | null> = {}
  
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updateData[field] = body[field]
    }
  }
  
  try {
    const [updated] = await db
      .update(user)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id))
      .returning()
    
    return c.json({ user: updated })
  } catch (error) {
    console.error("Error updating profile:", error)
    return c.json({ error: "Failed to update profile" }, 500)
  }
})

// Create a new design
app.post("/api/designs", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })
  
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401)
  }
  
  const body = await c.req.json()
  
  // Validation
  if (!body.name || !body.name.trim()) {
    return c.json({ error: "Name is required" }, 400)
  }
  
  if (!body.category) {
    return c.json({ error: "Category is required" }, 400)
  }
  
  if (!body.content || !body.content.trim()) {
    return c.json({ error: "Content is required" }, 400)
  }
  
  try {
    const [designRecord] = await db
      .insert(design)
      .values({
        id: randomUUID(),
        userId: session.user.id,
        name: body.name.trim(),
        description: body.description?.trim() || null,
        category: body.category,
        content: body.content.trim(),
        demoUrl: body.demoUrl?.trim() || null,
        thumbnailUrl: body.thumbnailUrl?.trim() || null,
        isPublic: body.isPublic ?? true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()
    
    return c.json({ design: designRecord }, 201)
  } catch (error) {
    console.error("Error creating design:", error)
    return c.json({ error: "Failed to create design" }, 500)
  }
})

// Get user's designs
app.get("/api/designs/my", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })
  
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401)
  }
  
  try {
    const designs = await db
      .select()
      .from(design)
      .where(eq(design.userId, session.user.id))
      .orderBy(desc(design.createdAt))
    
    return c.json({ designs })
  } catch (error) {
    console.error("Error fetching designs:", error)
    return c.json({ error: "Failed to fetch designs" }, 500)
  }
})

// Get public designs
app.get("/api/designs", async (c) => {
  const category = c.req.query("category")
  
  try {
    if (category) {
      const designs = await db
        .select({
          id: design.id,
          name: design.name,
          description: design.description,
          category: design.category,
          thumbnailUrl: design.thumbnailUrl,
          isPublic: design.isPublic,
          viewCount: design.viewCount,
          createdAt: design.createdAt,
          userId: design.userId,
          author: {
            name: user.name,
            image: user.image,
          }
        })
        .from(design)
        .leftJoin(user, eq(design.userId, user.id))
        .where(eq(design.isPublic, true) && eq(design.category, category))
        .orderBy(desc(design.createdAt))
      
      return c.json({ designs })
    } else {
      const designs = await db
        .select({
          id: design.id,
          name: design.name,
          description: design.description,
          category: design.category,
          thumbnailUrl: design.thumbnailUrl,
          isPublic: design.isPublic,
          viewCount: design.viewCount,
          createdAt: design.createdAt,
          userId: design.userId,
          author: {
            name: user.name,
            image: user.image,
          }
        })
        .from(design)
        .leftJoin(user, eq(design.userId, user.id))
        .where(eq(design.isPublic, true))
        .orderBy(desc(design.createdAt))
      
      return c.json({ designs })
    }
  } catch (error) {
    console.error("Error fetching designs:", error)
    return c.json({ error: "Failed to fetch designs" }, 500)
  }
})

// Get single design by ID
app.get("/api/designs/:id", async (c) => {
  const id = c.req.param("id")
  
  try {
    const [designRecord] = await db
      .select()
      .from(design)
      .where(eq(design.id, id))
      .limit(1)
    
    if (!designRecord) {
      return c.json({ error: "Design not found" }, 404)
    }
    
    // Check if design is public or user is the owner
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    })
    
    if (!designRecord.isPublic && (!session || session.user.id !== designRecord.userId)) {
      return c.json({ error: "Unauthorized" }, 403)
    }
    
    return c.json({ design: designRecord })
  } catch (error) {
    console.error("Error fetching design:", error)
    return c.json({ error: "Failed to fetch design" }, 500)
  }
})

// Upload image to R2
app.post("/api/upload/image", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })
  
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401)
  }
  
  try {
    const body = await c.req.parseBody()
    const file = body.file
    
    if (!file || !(file instanceof File)) {
      return c.json({ error: "No file provided" }, 400)
    }
    
    // Get file details
    const contentType = file.type || "application/octet-stream"
    const fileExtension = extname(file.name).toLowerCase().replace(".", "") || "jpg"
    
    // Validate file
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    const validation = validateThumbnail(contentType, buffer.length)
    if (!validation.valid) {
      return c.json({ error: validation.error }, 400)
    }
    
    // Generate unique key
    const key = generateThumbnailKey(session.user.id, fileExtension)
    
    // Upload to R2
    const result = await uploadFile(buffer, key, contentType)
    
    return c.json({
      url: result.url,
      key: result.key,
      size: result.size,
      contentType: result.contentType,
    })
  } catch (error) {
    console.error("Error uploading image:", error)
    return c.json(
      { error: error instanceof Error ? error.message : "Failed to upload image" },
      500
    )
  }
})

export default app
