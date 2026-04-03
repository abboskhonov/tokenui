"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { HeroSection } from "@/components/marketing/hero-section"
import { Footer } from "./sections/footer"
import type { Design } from "@/lib/types/design"

interface MarketingPageProps {
  initialDesigns?: Design[]
}

export function MarketingPage({ initialDesigns }: MarketingPageProps) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden" suppressHydrationWarning>
        <HeroSection initialDesigns={initialDesigns} />
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  )
}
