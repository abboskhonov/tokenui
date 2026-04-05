import * as React from "react"

// ViewTransition from React 19 canary
export const ViewTransition = (
  React as { 
    ViewTransition?: React.ComponentType<{ 
      children?: React.ReactNode; 
      name?: string; 
      share?: string; 
      default?: string; 
      enter?: string | object; 
      exit?: string | object 
    }> 
  }
).ViewTransition ?? (({ children }: { children?: React.ReactNode }) => children)
