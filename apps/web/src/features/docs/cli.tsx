"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/features/marketing/sections/header"
import { DocsSidebar } from "./sidebar"

export function DocsCLIPage() {
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
                  <h1 className="text-4xl font-bold tracking-tight">CLI Reference</h1>
                  <p className="text-lg text-muted-foreground">
                    Command-line interface for managing designs.
                  </p>
                </div>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold tracking-tight">Installation</h2>
                  <div className="bg-muted rounded-lg p-4">
                    <code className="text-sm font-mono">npm install -g tasteui-cli</code>
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold tracking-tight">Commands</h2>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">tasteui init</h3>
                      <p className="text-muted-foreground text-sm">
                        Initialize a new design project in the current directory.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">tasteui add &lt;design&gt;</h3>
                      <p className="text-muted-foreground text-sm">
                        Add a design to your project. Run without arguments to browse available designs.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">tasteui publish</h3>
                      <p className="text-muted-foreground text-sm">
                        Publish your design to the tasteui gallery.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </main>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
