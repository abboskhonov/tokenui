import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api/client"
import type { Design } from "@/lib/types/design"

// User profile type
export interface UserProfile {
  id: string
  name: string | null
  username: string
  image: string | null
  bio: string | null
  website: string | null
  github: string | null
  x: string | null
  telegram: string | null
  createdAt: string
}

export interface UserStats {
  components: number
  followers: number
  following: number
}

export interface UserProfileResponse {
  user: UserProfile
  designs: Design[]
  stats: UserStats
}

// Query keys
export const userKeys = {
  all: ["users"] as const,
  profile: (username: string) => [...userKeys.all, "profile", username] as const,
}

// Get user profile by username
export function useUserProfile(username: string) {
  return useQuery({
    queryKey: userKeys.profile(username),
    queryFn: async () => {
      const response = await api.get<UserProfileResponse>(`/api/users/${username}`)
      return response
    },
    enabled: !!username,
    staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
  })
}
