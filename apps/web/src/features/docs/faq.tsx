"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/features/marketing/sections/header"
import { DocsSidebar } from "./sidebar"

export function DocsFAQPage() {
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
                  <h1 className="text-4xl font-bold tracking-tight">FAQ</h1>
                  <p className="text-lg text-muted-foreground">
                    Frequently asked questions about tasteui.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">What is tasteui?</h3>
                    <p className="text-muted-foreground">
                      tasteui is a platform for discovering and sharing UI designs and components. 
                      It's designed to help developers and AI agents find reusable interface elements.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">How do I publish a design?</h3>
                    <p className="text-muted-foreground">
                      Click the Publish button in the header, fill out the form with your design details, 
                      upload screenshots, and submit. Your design will be reviewed before appearing in the gallery.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Are designs free to use?</h3>
                    <p className="text-muted-foreground">
                      Yes, all designs on tasteui are free to use in your projects. Make sure to check 
                      individual design licenses for any specific requirements.
                    </p>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
