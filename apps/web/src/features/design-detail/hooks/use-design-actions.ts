import { useCallback, useState } from "react"
import { toast } from "sonner"
import { useUser } from "@/lib/user-context"
import { 
  useBookmarkCheck, 
  useCreateBookmark, 
  useDeleteBookmark,
  useStarCheck,
  useCreateStar,
  useDeleteStar
} from "@/lib/queries/designs"
import type { Design } from "@/lib/types/design"

export function useDesignActions(design: Design | undefined) {
  const { user } = useUser()
  const designId = design?.id || ""
  
  // Bookmark state
  const { data: isBookmarked } = useBookmarkCheck(designId)
  const createBookmark = useCreateBookmark()
  const deleteBookmark = useDeleteBookmark()
  
  // Star state
  const { data: isStarred } = useStarCheck(designId)
  const createStar = useCreateStar()
  const deleteStar = useDeleteStar()
  
  // Copy state
  const [isCopied, setIsCopied] = useState<string | null>(null)
  
  // Optimistic states
  const isBookmarkedState = isBookmarked || (design && createBookmark.variables === design.id)
  const isBookmarkPending = createBookmark.isPending || deleteBookmark.isPending
  const isStarredState = isStarred || (design && createStar.variables === design.id)
  const isStarPending = createStar.isPending || deleteStar.isPending
  
  const handleBookmarkClick = useCallback(() => {
    if (!user || !design) {
      toast.error("Please sign in to save skills")
      return
    }
    
    if (isBookmarkPending) return
    
    if (isBookmarked) {
      deleteBookmark.mutate(design.id, {
        onSuccess: () => toast.success("Removed from saved"),
        onError: () => toast.error("Failed to remove")
      })
    } else {
      createBookmark.mutate(design.id, {
        onSuccess: () => toast.success("Saved to your collection"),
        onError: () => toast.error("Failed to save")
      })
    }
  }, [isBookmarked, isBookmarkPending, design, deleteBookmark, createBookmark, user])
  
  const handleStarClick = useCallback(() => {
    if (!user || !design) {
      toast.error("Please sign in to star designs")
      return
    }
    
    if (isStarPending) return
    
    if (isStarred) {
      deleteStar.mutate(design.id, {
        onSuccess: () => toast.success("Unstarred design"),
        onError: () => toast.error("Failed to unstar")
      })
    } else {
      createStar.mutate(design.id, {
        onSuccess: () => toast.success("Starred design"),
        onError: () => toast.error("Failed to star")
      })
    }
  }, [isStarred, isStarPending, design, deleteStar, createStar, user])
  
  const handleCopy = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(label)
      setTimeout(() => setIsCopied(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }, [])
  
  return {
    user,
    isBookmarkedState,
    isBookmarkPending,
    handleBookmarkClick,
    isStarredState,
    isStarPending,
    handleStarClick,
    isCopied,
    handleCopy,
  }
}
