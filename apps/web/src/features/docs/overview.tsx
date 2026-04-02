"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/features/marketing/sections/header"
import { DocsSidebar } from "./sidebar"

export function DocsOverviewPage() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-12">
            <DocsSidebar />
            
            <main className="flex-1 min-w-0 max-w-3xl">
              <div className="space-y-8">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tight">Documentation</h1>
                  <p className="text-lg text-muted-foreground">
                    Learn how to discover, install, and use designs with your AI agents.
                  </p>
                </div>

                <p className="text-muted-foreground">
                  The <code className="bg-muted px-2 py-1 rounded text-sm font-mono">tasteui</code> platform helps you discover and share UI components and designs.
                </p>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold tracking-tight">What are designs?</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Designs are reusable UI components and layouts for AI agents and developers. 
                    They provide ready-to-use interface elements that can be easily integrated into your projects.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold tracking-tight">Getting started</h2>
                  <p className="text-muted-foreground">
                    Browse the gallery to find designs you like. Click on any design to see a live preview and copy the code.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold tracking-tight">Publishing designs</h2>
                  <p className="text-muted-foreground">
                    Have a design you want to share? Click the Publish button in the header to submit your design to the gallery.
                  </p>
                </section>
              </div>
            </main>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
