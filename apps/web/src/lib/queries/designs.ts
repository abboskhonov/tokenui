import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query"
import { api } from "@/lib/api/client"
import type { Design, CreateDesignData, Bookmark, Star } from "@/lib/types/design"

// Query keys
export const designKeys = {
  all: ["designs"] as const,
  my: () => [...designKeys.all, "my"] as const,
  public: (category?: string) => [...designKeys.all, "public", category] as const,
  trending: () => [...designKeys.all, "trending"] as const,
  topRated: () => [...designKeys.all, "top-rated"] as const,
  newest: () => [...designKeys.all, "newest"] as const,
  detail: (username: string, slug: string) => [...designKeys.all, "detail", username, slug] as const,
  files: (username: string, slug: string) => [...designKeys.all, "files", username, slug] as const,
  bookmarks: () => [...designKeys.all, "bookmarks"] as const,
  bookmarkCheck: (designId: string) => [...designKeys.all, "bookmark-check", designId] as const,
  stars: () => [...designKeys.all, "stars"] as const,
  starCheck: (designId: string) => [...designKeys.all, "star-check", designId] as const,
  starCount: (designId: string) => [...designKeys.all, "star-count", designId] as const,
  viewAnalytics: () => [...designKeys.all, "view-analytics"] as const,
  starAnalytics: () => [...designKeys.all, "star-analytics"] as const,
  downloadAnalytics: () => [...designKeys.all, "download-analytics"] as const,
  cliAnalytics: () => [...designKeys.all, "cli-analytics"] as const,
  contributors: () => [...designKeys.all, "contributors"] as const,
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
    staleTime: 1000 * 60 * 2, // Data stays fresh for 2 minutes
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes even when not in use
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

interface UsePublicDesignsInfiniteOptions {
  placeholderData?: {
    pages: PublicDesignsPage[]
    pageParams: number[]
  }
}

export function usePublicDesignsInfinite(
  category?: string, 
  search?: string,
  sort: "newest" | "trending" | "mostViewed" | "mostStarred" = "newest",
  options?: UsePublicDesignsInfiniteOptions
) {
  return useInfiniteQuery({
    queryKey: [...designKeys.public(category), "infinite", search, sort],
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams()
      params.append("limit", "20")
      params.append("offset", pageParam.toString())
      params.append("sort", sort)
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
    staleTime: 1000 * 60 * 5, // 5 minutes - match router staleTime for instant navigation
    placeholderData: options?.placeholderData,
  })
}

// Leaderboard: Trending skills (most views in last 7 days)
export function useTrendingDesigns() {
  return useQuery({
    queryKey: designKeys.trending(),
    queryFn: async () => {
      const response = await api.get<{ designs: Design[]; pagination: { limit: number; offset: number; hasMore: boolean } }>("/api/designs/leaderboard/trending")
      return response.designs
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10,
  })
}

// Leaderboard: Top rated skills (most stars)
export function useTopRatedDesigns() {
  return useQuery({
    queryKey: designKeys.topRated(),
    queryFn: async () => {
      const response = await api.get<{ designs: Design[]; pagination: { limit: number; offset: number; hasMore: boolean } }>("/api/designs/leaderboard/top")
      return response.designs
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })
}

// Leaderboard: Newest skills
export function useNewestDesigns() {
  return useQuery({
    queryKey: designKeys.newest(),
    queryFn: async () => {
      const response = await api.get<{ designs: Design[]; pagination: { limit: number; offset: number; hasMore: boolean } }>("/api/designs/leaderboard/newest")
      return response.designs
    },
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
  })
}

// Get single design by username and slug (lightweight - no files/content)
export function useDesign(username: string, slug: string) {
  return useQuery({
    queryKey: designKeys.detail(username, slug),
    queryFn: async () => {
      const response = await api.get<{ design: Design }>(`/api/designs/${username}/${slug}`)
      return response.design
    },
    enabled: !!username && !!slug,
    staleTime: 1000 * 60 * 2, // Match prefetch staleTime - 2 minutes
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
  })
}

import type { FileNode } from "@/features/publish/components/file-tree"

// Get design files (lazy loaded when user switches to Code tab)
// Content is already included in main design endpoint
export interface DesignFiles {
  id: string
  files: FileNode[] | null
}

export function useDesignFiles(username: string, slug: string, enabled: boolean = false) {
  return useQuery({
    queryKey: designKeys.files(username, slug),
    queryFn: async () => {
      const response = await api.get<DesignFiles>(`/api/designs/${username}/${slug}/files`)
      return response
    },
    enabled: !!username && !!slug && enabled,
    staleTime: 1000 * 60 * 5, // Files don't change often
    gcTime: 1000 * 60 * 10,
  })
}

// Check if skill name exists for current user
export function useCheckDesignName(name: string, excludeId?: string) {
  return useQuery({
    queryKey: [...designKeys.all, "check-name", name, excludeId],
    queryFn: async () => {
      const params = new URLSearchParams({ name })
      if (excludeId) params.append("excludeId", excludeId)
      const response = await api.get<{ exists: boolean; name?: string }>(`/api/designs/check-name?${params}`)
      return response
    },
    enabled: name.length > 0,
    staleTime: 1000 * 30, // 30 seconds
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

// Get user's bookmarks
export function useBookmarks() {
  return useQuery({
    queryKey: designKeys.bookmarks(),
    queryFn: async () => {
      const response = await api.get<{ bookmarks: Bookmark[] }>("/api/bookmarks")
      return response.bookmarks
    },
  })
}

// Check if a design is bookmarked (only for authenticated users)
export function useBookmarkCheck(designId: string, initialData?: boolean, isAuthenticated?: boolean) {
  return useQuery({
    queryKey: designKeys.bookmarkCheck(designId),
    queryFn: async () => {
      const response = await api.get<{ isBookmarked: boolean }>(`/api/bookmarks/check/${designId}`)
      return response.isBookmarked
    },
    enabled: !!designId && isAuthenticated === true,
    initialData: initialData,
  })
}

// Create bookmark mutation
export function useCreateBookmark() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (designId: string) => {
      const response = await api.post<{ bookmark: { id: string } }>("/api/bookmarks", { designId })
      return response.bookmark
    },
    onSuccess: (_, designId) => {
      queryClient.invalidateQueries({ queryKey: designKeys.bookmarks() })
      queryClient.invalidateQueries({ queryKey: designKeys.bookmarkCheck(designId) })
    },
  })
}

// Delete bookmark mutation
export function useDeleteBookmark() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (designId: string) => {
      await api.delete(`/api/bookmarks/${designId}`)
    },
    onSuccess: (_, designId) => {
      queryClient.invalidateQueries({ queryKey: designKeys.bookmarks() })
      queryClient.invalidateQueries({ queryKey: designKeys.bookmarkCheck(designId) })
    },
  })
}

// Get user's stars
export function useStars() {
  return useQuery({
    queryKey: designKeys.stars(),
    queryFn: async () => {
      const response = await api.get<{ stars: Star[] }>("/api/stars")
      return response.stars
    },
  })
}

// Check if a design is starred (only for authenticated users)
export function useStarCheck(designId: string, initialData?: boolean, isAuthenticated?: boolean) {
  return useQuery({
    queryKey: designKeys.starCheck(designId),
    queryFn: async () => {
      const response = await api.get<{ isStarred: boolean }>(`/api/stars/check/${designId}`)
      return response.isStarred
    },
    enabled: !!designId && isAuthenticated === true,
    initialData: initialData,
  })
}

// Get star count for a design
export function useStarCount(designId: string, initialData?: number) {
  return useQuery({
    queryKey: designKeys.starCount(designId),
    queryFn: async () => {
      const response = await api.get<{ count: number }>(`/api/stars/count/${designId}`)
      return response.count
    },
    enabled: !!designId,
    initialData: initialData,
  })
}

// Create star mutation (star a design)
export function useCreateStar() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (designId: string) => {
      const response = await api.post<{ star: { id: string }; isNew: boolean }>("/api/stars", { designId })
      return response
    },
    onSuccess: (_, designId) => {
      queryClient.invalidateQueries({ queryKey: designKeys.stars() })
      queryClient.invalidateQueries({ queryKey: designKeys.starCheck(designId) })
      queryClient.invalidateQueries({ queryKey: designKeys.starCount(designId) })
    },
  })
}

// Delete star mutation (unstar a design)
export function useDeleteStar() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (designId: string) => {
      await api.delete(`/api/stars/${designId}`)
    },
    onSuccess: (_, designId) => {
      queryClient.invalidateQueries({ queryKey: designKeys.stars() })
      queryClient.invalidateQueries({ queryKey: designKeys.starCheck(designId) })
      queryClient.invalidateQueries({ queryKey: designKeys.starCount(designId) })
    },
  })
}

// Track view mutation - records a view with 24h deduplication
export function useTrackView() {
  return useMutation({
    mutationFn: async (designId: string) => {
      const response = await api.post<{ 
        success: boolean
        isNewView: boolean
        viewCount: number 
      }>(`/api/designs/${designId}/view`, {})
      return response
    },
  })
}

// Track download mutation - records a download
export function useTrackDownload() {
  return useMutation({
    mutationFn: async (designId: string) => {
      const response = await api.post<{ 
        success: boolean
        downloadCount: number 
      }>(`/api/designs/${designId}/download`, {})
      return response
    },
  })
}

// Get combined view + star + download analytics (last 7 days)
export function useAnalyticsSummary() {
  return useQuery({
    queryKey: [...designKeys.all, "analytics-summary"],
    queryFn: async () => {
      const response = await api.get<{ 
        dailyViews: number[]
        totalViews: number
        dailyStars: number[]
        totalStars: number
        dailyDownloads: number[]
        totalDownloads: number
      }>("/api/analytics/summary")
      return response
    },
  })
}

// Get view analytics (last 7 days) - legacy, use useAnalyticsSummary instead
export function useViewAnalytics() {
  return useQuery({
    queryKey: designKeys.viewAnalytics(),
    queryFn: async () => {
      const response = await api.get<{ 
        dailyViews: number[]
        totalViews: number 
      }>("/api/analytics/views")
      return response
    },
  })
}

// Get star analytics (last 7 days) - legacy, use useAnalyticsSummary instead
export function useStarAnalytics() {
  return useQuery({
    queryKey: designKeys.starAnalytics(),
    queryFn: async () => {
      const response = await api.get<{ 
        dailyStars: number[]
        totalStars: number 
      }>("/api/analytics/stars")
      return response
    },
  })
}

// Get download analytics (last 7 days) - legacy, use useAnalyticsSummary instead
export function useDownloadAnalytics() {
  return useQuery({
    queryKey: designKeys.downloadAnalytics(),
    queryFn: async () => {
      const response = await api.get<{ 
        dailyDownloads: number[]
        totalDownloads: number 
      }>("/api/analytics/downloads")
      return response
    },
  })
}

// Top contributor type
export interface TopContributor {
  userId: string
  name: string | null
  username: string
  image: string | null
  skillCount: number
  totalStars: number
  totalViews: number
}

// Leaderboard: Top contributors (users with most skills and stars)
export function useTopContributors(limit = 5) {
  return useQuery({
    queryKey: designKeys.contributors(),
    queryFn: async () => {
      const response = await api.get<{ contributors: TopContributor[] }>(`/api/designs/leaderboard/contributors?limit=${limit}`)
      return response.contributors
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10,
  })
}

// CLI Analytics type
export interface CliAnalytics {
  dailyRuns: number[]
  totalRuns: number
  uniqueMachines: number
  todayRuns: number
}

// Get CLI run analytics (last 7 days) - admin only
export function useCliAnalytics() {
  return useQuery({
    queryKey: designKeys.cliAnalytics(),
    queryFn: async () => {
      const response = await api.get<CliAnalytics>("/api/cli/analytics")
      return response
    },
  })
}
