"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { HeroSection } from "@/components/ui/hero-section"
import { Footer } from "./sections/footer"

export function MarketingPage() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden" suppressHydrationWarning>
        <HeroSection />
        <Footer />
      </div>
    </ThemeProvider>
  )
}
