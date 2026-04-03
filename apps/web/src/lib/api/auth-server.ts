import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"

const API_BASE_URL = process.env.VITE_API_URL || "http://localhost:3001"

export interface SessionUser {
  id: string
  name: string
  email: string
  image?: string | null
  username?: string | null
}

export const getCurrentUserServerFn = createServerFn({ method: "GET" })
  .handler(async () => {
    // Get the current request to forward cookies
    const request = getRequest()
    const cookie = request?.headers.get("cookie") || ""
    
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
      throw new Error("Failed to fetch user session")
    }
    
    const data = await response.json()
    return data.user as SessionUser
  })
