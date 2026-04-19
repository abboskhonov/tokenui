"use client"

import { HydrationBoundary } from "@tanstack/react-query"
import { Footer } from "./sections/footer"
import type { DehydratedState } from "@tanstack/react-query"
import type { Design } from "@/lib/types/design"
import { ThemeProvider } from "@/components/theme-provider"
import { HeroSection } from "@/components/marketing/hero-section"

interface MarketingPageProps {
  initialDesigns?: Array<Design>
  dehydratedState?: DehydratedState
}

export function MarketingPage({ initialDesigns, dehydratedState }: MarketingPageProps) {
  return (
    <ThemeProvider>
      <HydrationBoundary state={dehydratedState}>
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden" suppressHydrationWarning>
          <HeroSection initialDesigns={initialDesigns} />
          <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <Footer />
          </div>
        </div>
      </HydrationBoundary>
    </ThemeProvider>
  )
}
