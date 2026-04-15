import { Hono } from "hono"
import { auth } from "../auth"
import type { AuthContext } from "../types"

const app = new Hono<AuthContext>()

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000"

// Better Auth - Mount all auth routes
app.all("/*", async (c) => {
  const url = new URL(c.req.url)

  // Handle OAuth callbacks specially to redirect to frontend
  if (url.pathname.includes("/callback/")) {
    const response = await auth.handler(c.req.raw)

    const hasError = url.searchParams.get("error")

    if (!hasError && (response.status === 200 || response.status === 302)) {
      const headers = new Headers(response.headers)
      headers.set("Location", frontendUrl)

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
