export interface Design {
  id: string
  userId: string
  name: string
  description: string | null
  category: string
  content: string
  demoUrl: string | null
  thumbnailUrl: string | null
  isPublic: boolean
  viewCount: number
  createdAt: string
  updatedAt: string
  author?: {
    name: string | null
    image: string | null
  }
}

export interface CreateDesignData {
  name: string
  description?: string
  category: string
  content: string
  demoUrl?: string
  thumbnailUrl?: string
  isPublic?: boolean
}
