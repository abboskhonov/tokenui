import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query"
import { api } from "@/lib/api/client"
import type { Design, CreateDesignData } from "@/lib/types/design"

// Query keys
export const designKeys = {
  all: ["designs"] as const,
  my: () => [...designKeys.all, "my"] as const,
  public: (category?: string) => [...designKeys.all, "public", category] as const,
  detail: (username: string, slug: string) => [...designKeys.all, "detail", username, slug] as const,
}

// Upload image to R2
export async function uploadImage(file: File): Promise<{ url: string; key: string; size: number; contentType: string }> {
  const formData = new FormData()
  formData.append("file", file)
  
  const response = await fetch(`${api["baseURL"]}/api/upload/image`, {
    method: "POST",
    body: formData,
    credentials: "include",
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Upload failed" }))
    throw new Error(error.error || "Failed to upload image")
  }
  
  return response.json()
}

// Upload HTML content to R2
export async function uploadHtml(html: string): Promise<{ url: string; key: string; size: number; contentType: string }> {
  const response = await fetch(`${api["baseURL"]}/api/upload/html`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ html }),
    credentials: "include",
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Upload failed" }))
    throw new Error(error.error || "Failed to upload HTML")
  }
  
  return response.json()
}

// Get my designs
export function useMyDesigns() {
  return useQuery({
    queryKey: designKeys.my(),
    queryFn: async () => {
      const response = await api.get<{ designs: Design[] }>("/api/designs/my")
      return response.designs
    },
    staleTime: 1000 * 60 * 2, // Data stays fresh for 2 minutes
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
  })
}

// Get public designs
export function usePublicDesigns(category?: string) {
  return useQuery({
    queryKey: designKeys.public(category),
    queryFn: async () => {
      const url = category 
        ? `/api/designs?category=${encodeURIComponent(category)}`
        : "/api/designs"
      const response = await api.get<{ designs: Design[] }>(url)
      return response.designs
    },
    staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes even when not in use
  })
}

// Get public designs with infinite scroll
interface PublicDesignsPage {
  designs: Design[]
  pagination: {
    limit: number
    offset: number
    hasMore: boolean
  }
}

export function usePublicDesignsInfinite(category?: string, search?: string) {
  return useInfiniteQuery({
    queryKey: [...designKeys.public(category), "infinite", search],
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams()
      params.append("limit", "20")
      params.append("offset", pageParam.toString())
      if (category) params.append("category", category)
      if (search) params.append("search", search)
      
      const response = await api.get<PublicDesignsPage>(`/api/designs?${params.toString()}`)
      return response
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination.hasMore) return undefined
      return lastPage.pagination.offset + lastPage.pagination.limit
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 2,
  })
}

// Get single design by username and slug
export function useDesign(username: string, slug: string) {
  return useQuery({
    queryKey: designKeys.detail(username, slug),
    queryFn: async () => {
      const response = await api.get<{ design: Design }>(`/api/designs/${username}/${slug}`)
      return response.design
    },
    enabled: !!username && !!slug,
  })
}

// Create design mutation
export function useCreateDesign() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateDesignData) => {
      const response = await api.post<{ design: Design }>("/api/designs", data)
      return response.design
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: designKeys.my() })
      queryClient.invalidateQueries({ queryKey: designKeys.public() })
    },
  })
}
