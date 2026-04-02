"use client"

import { QueryProvider } from "@/lib/query-provider"

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  )
}
