"use client"

import { useEffect } from "react"

interface ErrorBoundaryProps {
  error: Error
  reset: () => void
}

export function DesignDetailError({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error("Design Detail Error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 p-6">
        <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
        <p className="text-muted-foreground">{error.message || "Failed to load design"}</p>
        <button 
          onClick={reset}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
