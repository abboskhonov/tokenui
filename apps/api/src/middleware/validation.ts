import type { Context, Next } from "hono"
import { ZodSchema, ZodError } from "zod"
import { badRequest } from "../utils/errors"

// Generic validation middleware factory
export function validateBody<T>(schema: ZodSchema<T>) {
  return async (c: Context, next: Next): Promise<Response | void> => {
    try {
      const body = await c.req.json()
      const validated = schema.parse(body)
      // Store validated data in context for later use
      c.set("validatedBody", validated)
      await next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        }))
        return c.json(
          {
            error: "Validation failed",
            details: errors,
          },
          400
        )
      }
      return badRequest(c, "Invalid request body")
    }
  }
}

// Validate query parameters
export function validateQuery<T>(schema: ZodSchema<T>) {
  return async (c: Context, next: Next): Promise<Response | void> => {
    try {
      const query = Object.fromEntries(new URL(c.req.url).searchParams)
      const validated = schema.parse(query)
      c.set("validatedQuery", validated)
      await next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        }))
        return c.json(
          {
            error: "Invalid query parameters",
            details: errors,
          },
          400
        )
      }
      return badRequest(c, "Invalid query parameters")
    }
  }
}

// Validate route parameters
export function validateParams<T>(schema: ZodSchema<T>) {
  return async (c: Context, next: Next): Promise<Response | void> => {
    try {
      const params = c.req.param()
      const validated = schema.parse(params)
      c.set("validatedParams", validated)
      await next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        }))
        return c.json(
          {
            error: "Invalid URL parameters",
            details: errors,
          },
          400
        )
      }
      return badRequest(c, "Invalid URL parameters")
    }
  }
}

// Helper to get validated data from context
export function getValidatedBody<T>(c: Context): T {
  return c.get("validatedBody") as T
}

export function getValidatedQuery<T>(c: Context): T {
  return c.get("validatedQuery") as T
}

export function getValidatedParams<T>(c: Context): T {
  return c.get("validatedParams") as T
}
