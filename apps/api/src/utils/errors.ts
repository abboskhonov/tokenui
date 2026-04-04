import type { Context } from "hono"
import type { ApiError } from "../types"

// HTTP status codes
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const

// Standard error responses
export function unauthorized(c: Context): Response {
  return c.json<ApiError>({ error: "Unauthorized" }, HttpStatus.UNAUTHORIZED)
}

export function forbidden(c: Context): Response {
  return c.json<ApiError>({ error: "Forbidden" }, HttpStatus.FORBIDDEN)
}

export function notFound(c: Context, resource = "Resource"): Response {
  return c.json<ApiError>({ error: `${resource} not found` }, HttpStatus.NOT_FOUND)
}

export function badRequest(c: Context, message: string): Response {
  return c.json<ApiError>({ error: message }, HttpStatus.BAD_REQUEST)
}

export function conflict(c: Context, message: string): Response {
  return c.json<ApiError>({ error: message }, HttpStatus.CONFLICT)
}

export function internalError(c: Context, message = "Internal server error"): Response {
  return c.json<ApiError>({ error: message }, HttpStatus.INTERNAL_SERVER_ERROR)
}

// Success responses
export function success<T>(c: Context, data: T, status = HttpStatus.OK): Response {
  return c.json(data, status)
}

export function created<T>(c: Context, data: T): Response {
  return c.json(data, HttpStatus.CREATED)
}

// Log errors consistently
export function logError(context: string, error: unknown): void {
  console.error(`[${context}]`, error)
}
