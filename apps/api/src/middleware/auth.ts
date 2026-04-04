import type { Context, Next } from "hono"
import { auth } from "../auth"
import type { AuthSession, AuthContext } from "../types"

// Extract session from request and add to context
export async function authMiddleware(
  c: Context<AuthContext>,
  next: Next
): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    })
    c.set("session", session as AuthSession | null)
  } catch {
    c.set("session", null)
  }
  await next()
}

// Require authentication - use after authMiddleware
export function requireAuth<ContextType extends AuthContext>(
  c: Context<ContextType>
): AuthSession {
  const session = c.get("session")
  if (!session) {
    throw new Error("Unauthorized")
  }
  return session
}

// Check if user is authenticated (returns boolean)
export function isAuthenticated<ContextType extends AuthContext>(
  c: Context<ContextType>
): boolean {
  return c.get("session") !== null
}

// Get current user ID or null
export function getUserId<ContextType extends AuthContext>(
  c: Context<ContextType>
): string | null {
  return c.get("session")?.user?.id ?? null
}

// Protected route middleware
export async function protectedMiddleware<ContextType extends AuthContext>(
  c: Context<ContextType>,
  next: Next
): Promise<Response | void> {
  const session = c.get("session")
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401)
  }
  await next()
}
