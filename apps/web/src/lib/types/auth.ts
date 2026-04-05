export interface User {
  id: string
  email: string
  name: string | null
  username: string | null
  image: string | null
  bio: string | null
  website: string | null
  github: string | null
  x: string | null
  telegram: string | null
  youtube: string | null
  instagram: string | null
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface Session {
  user: User
  session: {
    id: string
    userId: string
    expiresAt: string
    ipAddress: string | null
    userAgent: string | null
  }
}

export interface ProfileUpdateData {
  name?: string
  username?: string
  bio?: string
  website?: string
  github?: string
  x?: string
  telegram?: string
  youtube?: string
  instagram?: string
  image?: string
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface SignUpCredentials {
  email: string
  password: string
  name: string
}
