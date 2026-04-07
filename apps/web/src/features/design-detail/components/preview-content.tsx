import { HugeiconsIcon } from "@hugeicons/react"
import { File01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { useState, useEffect, useRef } from "react"
import type { Design } from "@/lib/types/design"

interface PreviewContentProps {
  design: Design
  demoUrl: string | null
  previewTheme: "light" | "dark"
}

export function PreviewContent({
  design,
  demoUrl,
  previewTheme,
}: PreviewContentProps) {
  const [isLoading, setIsLoading] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Prefetch the demo URL as soon as component mounts
  useEffect(() => {
    if (demoUrl) {
      const link = document.createElement("link")
      link.rel = "prefetch"
      link.href = demoUrl
      link.as = "document"
      document.head.appendChild(link)

      return () => {
        document.head.removeChild(link)
      }
    }
  }, [demoUrl])

  return (
    <div className="h-full relative overflow-hidden bg-muted/30">
      {/* Full-size preview container - no padding */}
      <div className="h-full w-full">
        {demoUrl ? (
          <div className="w-full h-full relative">
            {/* Loading skeleton */}
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <p className="text-xs text-muted-foreground">Loading preview...</p>
                </div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={demoUrl}
              className={cn(
                "w-full h-full border-0",
                previewTheme === "dark" ? "bg-[#0d1117]" : "bg-white"
              )}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              title={`${design.name} preview`}
              onLoad={() => setIsLoading(false)}
              loading="eager"
            />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
                <HugeiconsIcon icon={File01Icon} className="size-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                No preview available for this skill
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
