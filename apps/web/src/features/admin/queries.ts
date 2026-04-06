import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api/client"
import { designKeys } from "@/lib/queries/designs"

// Query keys
export const adminKeys = {
  all: ["admin"] as const,
  stats: () => [...adminKeys.all, "stats"] as const,
  users: () => [...adminKeys.all, "users"] as const,
  designs: () => [...adminKeys.all, "designs"] as const,
  pending: () => [...adminKeys.all, "pending"] as const,
  analytics: () => [...adminKeys.all, "analytics"] as const,
  cliAnalytics: () => [...adminKeys.analytics(), "cli"] as const,
  viewAnalytics: () => [...adminKeys.analytics(), "views"] as const,
  topDesigns: () => [...adminKeys.analytics(), "top-designs"] as const,
  summary: () => [...adminKeys.analytics(), "summary"] as const,
}

// Dashboard stats
export interface AdminStats {
  totalUsers: number
  totalDesigns: number
  pendingReview: number
  approvedToday: number
}

export function useAdminStats() {
  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: async (): Promise<AdminStats> => {
      const response = await api.get<AdminStats>("/api/admin/stats")
      return response
    },
    staleTime: 30 * 1000, // 30 seconds
  })
}

// Admin user type
export interface AdminUser {
  id: string
  name: string | null
  email: string
  username: string | null
  image: string | null
  role: string
  createdAt: string
  designs: number
}

// Get all users
export function useAdminUsers() {
  return useQuery({
    queryKey: adminKeys.users(),
    queryFn: async (): Promise<AdminUser[]> => {
      const response = await api.get<{ users: AdminUser[] }>("/api/admin/users")
      return response.users
    },
    staleTime: 30 * 1000,
  })
}

// Admin design type
export interface AdminDesign {
  id: string
  name: string
  slug: string | null
  category: string
  status: "draft" | "pending" | "approved" | "rejected"
  reviewMessage: string | null
  viewCount: number
  createdAt: string
  updatedAt: string
  userId: string
  author: string
  thumbnailUrl: string | null
}

// Pagination response type
export interface AdminDesignsResponse {
  designs: AdminDesign[]
  pagination: {
    limit: number
    offset: number
    total: number
    hasMore: boolean
  }
}

// Get all designs with pagination
export function useAdminDesigns(page: number = 1, limit: number = 20) {
  const offset = (page - 1) * limit
  
  return useQuery({
    queryKey: [...adminKeys.designs(), page, limit],
    queryFn: async (): Promise<AdminDesignsResponse> => {
      const response = await api.get<AdminDesignsResponse>(`/api/admin/designs?limit=${limit}&offset=${offset}`)
      return response
    },
    staleTime: 30 * 1000,
  })
}

// Pending review design type
export interface PendingDesign {
  id: string
  name: string
  slug: string | null
  description: string | null
  category: string
  content: string
  thumbnailUrl: string | null
  demoUrl: string | null
  createdAt: string
  userId: string
  author: string
  authorImage: string | null
}

// Get pending review designs
export function usePendingDesigns() {
  return useQuery({
    queryKey: adminKeys.pending(),
    queryFn: async (): Promise<PendingDesign[]> => {
      const response = await api.get<{ designs: PendingDesign[] }>("/api/admin/designs/pending")
      return response.designs
    },
    staleTime: 30 * 1000,
  })
}

// Approve design mutation
export function useApproveDesign() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ designId, message }: { designId: string; message?: string }) => {
      const response = await api.post<{ success: boolean; message: string }>(
        `/api/admin/designs/${designId}/approve`,
        { message }
      )
      return response
    },
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: adminKeys.pending() })
      queryClient.invalidateQueries({ queryKey: adminKeys.designs() })
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() })
      // Also invalidate public designs so they appear on the homepage
      queryClient.invalidateQueries({ queryKey: designKeys.public() })
    },
  })
}

// Reject design mutation
export function useRejectDesign() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ designId, message }: { designId: string; message?: string }) => {
      const response = await api.post<{ success: boolean; message: string }>(
        `/api/admin/designs/${designId}/reject`,
        { message }
      )
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.pending() })
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() })
    },
  })
}

// Delete design mutation (admin only)
export function useDeleteDesign() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (designId: string) => {
      await api.delete(`/api/designs/${designId}`)
    },
    onSuccess: () => {
      // Invalidate all design-related queries
      queryClient.invalidateQueries({ queryKey: adminKeys.designs() })
      queryClient.invalidateQueries({ queryKey: adminKeys.stats() })
      queryClient.invalidateQueries({ queryKey: adminKeys.pending() })
      // Also invalidate public designs
      queryClient.invalidateQueries({ queryKey: designKeys.public() })
    },
  })
}

// CLI Analytics Types
export interface CliAnalytics {
  dailyInstalls: number[]
  totalInstalls: number
  uniqueInstalls: number
  versionBreakdown: { version: string; count: number }[]
}

// Get CLI install analytics
export function useCliAnalytics() {
  return useQuery({
    queryKey: adminKeys.cliAnalytics(),
    queryFn: async (): Promise<CliAnalytics> => {
      const response = await api.get<CliAnalytics>("/api/admin/analytics/cli")
      return response
    },
    staleTime: 60 * 1000, // 1 minute
  })
}

// View Analytics Types
export interface ViewAnalytics {
  dailyViews: number[]
  totalViews: number
  uniqueViewers: number
}

// Get global view analytics
export function useViewAnalytics() {
  return useQuery({
    queryKey: adminKeys.viewAnalytics(),
    queryFn: async (): Promise<ViewAnalytics> => {
      const response = await api.get<ViewAnalytics>("/api/admin/analytics/views")
      return response
    },
    staleTime: 60 * 1000,
  })
}

// Top Design Type
export interface TopDesign {
  id: string
  name: string
  slug: string | null
  category: string
  thumbnailUrl: string | null
  viewCount: number
  userId: string
  author: string
}

// Get top viewed designs
export function useTopDesigns(limit: number = 10) {
  return useQuery({
    queryKey: [...adminKeys.topDesigns(), limit],
    queryFn: async (): Promise<TopDesign[]> => {
      const response = await api.get<{ designs: TopDesign[] }>(`/api/admin/analytics/top-designs?limit=${limit}`)
      return response.designs
    },
    staleTime: 60 * 1000,
  })
}

// Summary Analytics Type
export interface SummaryAnalytics {
  totalUsers: number
  totalDesigns: number
  totalCliInstalls: number
  totalViews: number
  viewsToday: number
  installsToday: number
  newUsersToday: number
}

// Get summary analytics
export function useSummaryAnalytics() {
  return useQuery({
    queryKey: adminKeys.summary(),
    queryFn: async (): Promise<SummaryAnalytics> => {
      const response = await api.get<SummaryAnalytics>("/api/admin/analytics/summary")
      return response
    },
    staleTime: 30 * 1000,
  })
}
