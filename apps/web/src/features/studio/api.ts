import { api } from "@/lib/api/client"
import type { Design, CreateDesignData } from "@/lib/types/design"

// Get user's designs
export async function getMyDesigns(): Promise<Design[]> {
  const response = await api.get<{ designs: Design[] }>("/api/designs/my")
  return response.designs
}

// Get single design
export async function getDesign(id: string): Promise<Design> {
  const response = await api.get<{ design: Design }>(`/api/designs/${id}`)
  return response.design
}

// Create design
export async function createDesign(data: CreateDesignData): Promise<Design> {
  const response = await api.post<{ design: Design }>("/api/designs", data)
  return response.design
}

// Update design
export async function updateDesign(
  id: string,
  data: Partial<CreateDesignData>
): Promise<Design> {
  const response = await api.put<{ design: Design }>(`/api/designs/${id}`, data)
  return response.design
}

// Delete design
export async function deleteDesign(id: string): Promise<void> {
  await api.delete(`/api/designs/${id}`)
}

// Toggle design visibility
export async function toggleDesignVisibility(
  id: string,
  isPublic: boolean
): Promise<Design> {
  const response = await api.patch<{ design: Design }>(`/api/designs/${id}/visibility`, {
    isPublic,
  })
  return response.design
}
