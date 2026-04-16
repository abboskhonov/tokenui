import { createContext, useContext, type ReactNode } from "react"
import type { SessionUser } from "@/lib/api/auth-server"

interface UserContextType {
  user: SessionUser | null
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ 
  children, 
  user,
  isLoading = false
}: { 
  children: ReactNode
  user: SessionUser | null 
  isLoading?: boolean
}) {
  return (
    <UserContext.Provider value={{ user, isLoading }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
