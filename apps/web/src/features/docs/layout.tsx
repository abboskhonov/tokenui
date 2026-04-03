"use client"

import { Outlet } from "@tanstack/react-router"
import { Header } from "@/features/marketing/sections/header"
import { DocsSidebar } from "@/features/docs/sidebar"

export function DocsLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex gap-12">
          <DocsSidebar />
          
          <main className="flex-1 min-w-0 max-w-3xl">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
