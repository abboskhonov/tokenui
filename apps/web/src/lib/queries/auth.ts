import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api/client"
import { signIn, signUp, signOut } from "@/lib/auth-client"
import type { User, ProfileUpdateData, LoginCredentials, SignUpCredentials, Session } from "@/lib/types/auth"

interface UploadImageResponse {
  url: string
  key: string
  size: number
  contentType: string
}

// Query keys
export const authKeys = {
  all: ["auth"] as const,
  session: () => [...authKeys.all, "session"] as const,
  user: () => [...authKeys.all, "user"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
}

// Upload image to R2
export function useUploadImage() {
  return useMutation({
    mutationFn: async (file: File): Promise<UploadImageResponse> => {
      const formData = new FormData()
      formData.append("file", file)
      
      const response = await api.post<UploadImageResponse>("/api/upload/image", formData)
      return response
    },
  })
}

// Get current user/session
export function useSession() {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: async () => {
      try {
        const response = await api.get<Session>("/api/me")
        return response
      } catch (error) {
        return null
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get full user profile
export function useUserProfile() {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      const response = await api.get<{ user: User }>("/api/user/profile")
      return response.user
    },
    staleTime: 5 * 60 * 1000,
  })
}

// Update user profile
export function useUpdateProfile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: ProfileUpdateData) => {
      const response = await api.put<{ user: User }>("/api/user/profile", data)
      return response.user
    },
    onSuccess: (updatedUser) => {
      // Update both profile and session queries
      queryClient.setQueryData(authKeys.profile(), updatedUser)
      queryClient.setQueryData(authKeys.session(), (old: any) => {
        if (old) {
          return { ...old, user: updatedUser }
        }
        return old
      })
      
      // Invalidate all designs queries to refetch with new author image
      queryClient.invalidateQueries({ queryKey: ["designs"] })
    },
  })
}

// Login with email/password
export function useLogin() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const result = await signIn.email({
        email: credentials.email,
        password: credentials.password,
        rememberMe: credentials.rememberMe,
      })
      
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.session() })
      queryClient.invalidateQueries({ queryKey: authKeys.profile() })
    },
  })
}

// Sign up
export function useSignUp() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (credentials: SignUpCredentials) => {
      const result = await signUp.email({
        email: credentials.email,
        password: credentials.password,
        name: credentials.name,
      })
      
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.session() })
      queryClient.invalidateQueries({ queryKey: authKeys.profile() })
    },
  })
}

// Sign in with GitHub
export function useSignInWithGitHub() {
  return useMutation({
    mutationFn: async () => {
      const result = await signIn.social({
        provider: "github",
        callbackURL: "/",
      })
      
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      return result.data
    },
  })
}

// Sign in with Google
export function useSignInWithGoogle() {
  return useMutation({
    mutationFn: async () => {
      const result = await signIn.social({
        provider: "google",
        callbackURL: "/",
      })
      
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      return result.data
    },
  })
}

// Logout
export function useLogout() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      await signOut()
    },
    onSuccess: () => {
      queryClient.clear()
      window.location.href = "/"
    },
  })
}
