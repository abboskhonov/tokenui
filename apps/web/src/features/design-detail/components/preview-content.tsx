import { HugeiconsIcon } from "@hugeicons/react"
import { File01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { useState, useEffect, useRef, useMemo } from "react"
import type { Design } from "@/lib/types/design"

interface PreviewContentProps {
  design: Design
  previewTheme: "light" | "dark"
}

// Scale factor - smaller = more zoomed out
const SCALE_FACTOR = 0.9

function injectZoomStyles(html: string): string {
  const zoomStyles = `
<style data-preview-zoom="true">
  html {
    overflow-x: hidden;
    overflow-y: auto;
    height: 100%;
  }
  body {
    margin: 0 !important;
    zoom: ${SCALE_FACTOR};
    -moz-transform: scale(${SCALE_FACTOR});
    -moz-transform-origin: 0 0;
    transform: scale(${SCALE_FACTOR});
    transform-origin: 0 0;
    width: ${100 / SCALE_FACTOR}% !important;
    min-width: ${100 / SCALE_FACTOR}% !important;
    overflow-x: hidden;
    /* Compensate for zoom by reducing min-height proportionally */
    min-height: ${100 / SCALE_FACTOR}vh;
  }
</style>`

  // Insert before closing </head>
  if (html.includes('</head>')) {
    return html.replace('</head>', `${zoomStyles}</head>`)
  }

  // If no head, insert after <body> or at start
  if (html.includes('<body')) {
    const bodyMatch = html.match(/<body[^>]*>/i)
    if (bodyMatch) {
      return html.replace(bodyMatch[0], `${bodyMatch[0]}${zoomStyles}`)
    }
  }

  // Fallback: prepend
  return zoomStyles + html
}

export function PreviewContent({
  design,
  previewTheme,
}: PreviewContentProps) {
  const [isLoading, setIsLoading] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Create blob URL from demoHtml content with zoom styles injected
  const demoUrl = useMemo(() => {
    if (design.demoHtml) {
      const modifiedHtml = injectZoomStyles(design.demoHtml)
      const blob = new Blob([modifiedHtml], { type: "text/html" })
      return URL.createObjectURL(blob)
    }
    // Fallback: use old demoUrl for backward compatibility
    if (design.demoUrl) {
      return design.demoUrl
    }
    return null
  }, [design.demoHtml, design.demoUrl])

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (demoUrl && demoUrl.startsWith("blob:")) {
        URL.revokeObjectURL(demoUrl)
      }
    }
  }, [demoUrl])

  return (
    <div className="h-full relative overflow-hidden bg-muted/30">
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
