import { Pool, neonConfig } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless"
import ws from "ws"
import * as schema from "./schema"

// Enable WebSocket support for Neon (only needed for local Bun dev)
if (process.env.NODE_ENV !== "production") {
  neonConfig.webSocketConstructor = ws
}

// Create connection pool with optimized settings
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Connection pool tuning
  max: 10,              // Max connections in pool
  idleTimeoutMillis: 30000,  // Close idle connections after 30s
  connectionTimeoutMillis: 5000,  // Fail fast if can't connect (5s)
})

export const db = drizzle(pool, { schema })
export * from "./schema"
