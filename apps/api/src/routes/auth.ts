import { Hono } from "hono"
import { auth } from "../auth"
import type { AuthContext } from "../types"

const app = new Hono<AuthContext>()

// Read env var at request time, not module load time
function getFrontendUrl(): string {
  const url = process.env.FRONTEND_URL
  if (!url) {
    console.error("[Auth] FRONTEND_URL not set! Falling back to localhost")
  }
  return url || "http://localhost:3000"
}

// Better Auth - Mount all auth routes
app.all("/*", async (c) => {
  const url = new URL(c.req.url)

  // Handle OAuth callbacks specially to redirect to frontend
  if (url.pathname.includes("/callback/")) {
    const frontendUrl = getFrontendUrl()
    console.log("[Auth Callback] FRONTEND_URL:", frontendUrl)
    console.log("[Auth Callback] Request URL:", c.req.url)
    
    const response = await auth.handler(c.req.raw)
    
    console.log("[Auth Callback] Response status:", response.status)
    console.log("[Auth Callback] Response Location header:", response.headers.get("Location"))

    const hasError = url.searchParams.get("error")

    if (!hasError && (response.status === 200 || response.status === 302)) {
      const headers = new Headers(response.headers)
      headers.set("Location", frontendUrl)
      
      console.log("[Auth Callback] Redirecting to:", frontendUrl)

      return new Response(null, {
        status: 302,
        headers: headers,
      })
    }

    return response
  }

  return auth.handler(c.req.raw)
})

export default app
