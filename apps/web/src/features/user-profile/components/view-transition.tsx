import * as React from "react"

export const ViewTransition = (
  React as { 
    ViewTransition?: React.ComponentType<{ 
      children?: React.ReactNode; 
      name?: string; 
      share?: string; 
      default?: string 
    }> 
  }
).ViewTransition ?? (({ children }: { children?: React.ReactNode }) => children)
