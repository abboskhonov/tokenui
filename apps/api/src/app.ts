import { Hono } from "hono"
import { config } from "dotenv"
import type { AuthContext } from "./types"
import { corsConfig, createCacheMiddleware } from "./middleware/cors"
import { authMiddleware } from "./middleware/auth"

// Import route modules
import healthRoutes from "./routes/health"
import authRoutes from "./routes/auth"
import userRoutes from "./routes/users"
import publicUserRoutes from "./routes/public-users"
import designRoutes from "./routes/designs"
import analyticsRoutes from "./routes/analytics"
import uploadRoutes from "./routes/uploads"
import bookmarkRoutes from "./routes/bookmarks"
import starRoutes from "./routes/stars"
import adminRoutes from "./routes/admin"

// Load environment variables
config()

// Create Hono app with auth context
const app = new Hono<AuthContext>()

// Global middleware
app.use("*", corsConfig)
app.use("*", authMiddleware)

// Cache middleware for public routes
app.use("/api/designs", createCacheMiddleware(60))
app.use("/api/users/*", createCacheMiddleware(60))

// Mount routes
app.route("/api/health", healthRoutes)
app.route("/api/auth", authRoutes)
// Fix: Mount user routes at /api so /me becomes /api/me and /profile becomes /api/profile
app.route("/api", userRoutes)
app.route("/api/users", publicUserRoutes)
app.route("/api/designs", designRoutes)
app.route("/api/analytics", analyticsRoutes)
app.route("/api/upload", uploadRoutes)
app.route("/api/bookmarks", bookmarkRoutes)
app.route("/api/stars", starRoutes)
app.route("/api/admin", adminRoutes)

export default app
