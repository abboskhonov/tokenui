import { createServerFn } from "@tanstack/react-start"
import type { Design } from "@/lib/types/design"

const API_BASE_URL = process.env.VITE_API_URL || "http://localhost:3001"

interface PublicDesignsResponse {
  designs: Array<Design>
  pagination: {
    limit: number
    offset: number
    hasMore: boolean
  }
}

export const getPublicDesignsServerFn = createServerFn({ method: "GET" })
  .handler(async () => {
    const response = await fetch(`${API_BASE_URL}/api/designs?limit=20&offset=0`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    
    if (!response.ok) {
      throw new Error("Failed to fetch designs")
    }
    
    const data = await response.json() as PublicDesignsResponse
    
    // Ensure we always return an object with designs array and pagination
    return {
      designs: Array.isArray(data.designs) ? data.designs : [],
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      pagination: data.pagination || { limit: 20, offset: 0, hasMore: false }
    }
  })
