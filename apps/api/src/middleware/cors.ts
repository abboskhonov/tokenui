import type { Context, Next } from "hono"
import { cors } from "hono/cors"

// CORS configuration for API
export const corsConfig = cors({
  origin: ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"],
  allowHeaders: ["Content-Type", "Authorization", "Accept"],
  allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE", "PATCH"],
  exposeHeaders: ["Content-Length", "Set-Cookie"],
  maxAge: 600,
  credentials: true,
})

// Cache middleware for public GET requests
export async function cacheMiddleware(
  c: Context,
  next: Next,
  maxAge = 60,
  staleWhileRevalidate = 300
): Promise<void> {
  await next()
  if (c.req.method === "GET") {
    c.header("Cache-Control", `public, max-age=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`)
  }
}

// Apply cache to specific routes
export function createCacheMiddleware(maxAge = 60) {
  return async (c: Context, next: Next): Promise<void> => {
    await cacheMiddleware(c, next, maxAge)
  }
}
