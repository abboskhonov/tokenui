import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api/client"
import type { Design, CreateDesignData } from "@/lib/types/design"

// Query keys
export const designKeys = {
  all: ["designs"] as const,
  my: () => [...designKeys.all, "my"] as const,
  public: (category?: string) => [...designKeys.all, "public", category] as const,
  detail: (id: string) => [...designKeys.all, "detail", id] as const,
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

// Get my designs
export function useMyDesigns() {
  return useQuery({
    queryKey: designKeys.my(),
    queryFn: async () => {
      const response = await api.get<{ designs: Design[] }>("/api/designs/my")
      return response.designs
    },
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
  })
}

// Get single design
export function useDesign(id: string) {
  return useQuery({
    queryKey: designKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<{ design: Design }>(`/api/designs/${id}`)
      return response.design
    },
    enabled: !!id,
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
