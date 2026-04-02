"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "./sections/header"
import { Hero } from "./sections/hero"
import { SkillsGallery } from "./sections/skills-gallery"
import { Footer } from "./sections/footer"

export function MarketingPage() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden" suppressHydrationWarning>
        {/* Full-width header - no padding wrapper */}
        <Header />

        {/* Centered content with max-width */}
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <main className="flex flex-1 flex-col gap-16 py-12 lg:gap-20 lg:py-16">
            <Hero />

            <div className="flex gap-8">
              <div className="flex-1 min-w-0">
                <SkillsGallery />
              </div>
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </ThemeProvider>
  )
}
