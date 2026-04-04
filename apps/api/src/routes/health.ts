import { Hono } from "hono"
import type { AuthContext } from "../types"
import { success } from "../utils/errors"

const app = new Hono<AuthContext>()

// Health check endpoint
app.get("/", (c) => {
  return success(c, {
    status: "ok",
    timestamp: new Date().toISOString(),
    auth: "configured",
    cors: "enabled",
  })
})

export default app
