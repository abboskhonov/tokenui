import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"

const API_BASE_URL = process.env.VITE_API_URL || "http://localhost:3001"

export interface SessionUser {
  id: string
  name: string
  email: string
  image?: string | null
  username?: string | null
  emailVerified?: boolean
  role?: string | null
}

export const getCurrentUserServerFn = createServerFn({ method: "GET" })
  .handler(async () => {
    // Get the current request to forward cookies
    const request = getRequest()
    const cookie = request?.headers.get("cookie") || ""
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/me`, {
        headers: {
          "Content-Type": "application/json",
          ...(cookie && { "Cookie": cookie }),
        },
        credentials: "include",
      })
      
      if (!response.ok) {
        // Return null for unauthenticated users - this is not an error
        if (response.status === 401) {
          return null
        }
        
        // Log the actual error for debugging
        const errorText = await response.text().catch(() => "Unknown error")
        console.error("API Error:", response.status, errorText)
        
        // For other errors, still return null instead of crashing
        return null
      }
      
      const data = await response.json()
      return data.user as SessionUser
    } catch (error) {
      console.error("ServerFn Error:", error)
      return null
    }
  })

/**
 * Server function to check if current user is an admin
 * Add your email to ADMIN_EMAILS array to gain admin access
 * Example: const ADMIN_EMAILS = ["admin@tokenui.dev", "youremail@gmail.com"]
 */
export const requireAdminServerFn = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const request = getRequest()
      const cookie = request?.headers.get("cookie") || ""
      
      // First check if user is authenticated
      const response = await fetch(`${API_BASE_URL}/api/me`, {
        headers: {
          "Content-Type": "application/json",
          ...(cookie && { "Cookie": cookie }),
        },
        credentials: "include",
      })
      
      if (!response.ok) {
        console.log("Admin check: Not authenticated, status:", response.status)
        return { 
          isAdmin: false, 
          user: null,
          error: "Not authenticated"
        }
      }
      
      const data = await response.json()
      const user = data.user as SessionUser
      
      // Check if user has admin role
      // Add your email to this list to gain admin access
      const ADMIN_EMAILS = ["admin@tokenui.dev"] 
      const isAdmin = user.role === "admin" || ADMIN_EMAILS.includes(user.email)
      
      console.log("Admin check:", user.email, "isAdmin:", isAdmin, "role:", user.role)
      
      return {
        isAdmin,
        user: isAdmin ? user : null,
        error: isAdmin ? null : "Not authorized"
      }
    } catch (error) {
      console.error("Admin check error:", error)
      return { 
        isAdmin: false, 
        user: null,
        error: "Server error"
      }
    }
  })
