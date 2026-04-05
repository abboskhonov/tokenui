import { HugeiconsIcon } from "@hugeicons/react"
import { File01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { ViewTransition } from "./view-transition"

interface PreviewContentProps {
  designId: string
  designName: string
  demoUrl: string | null
  previewMode: "desktop" | "mobile"
  previewTheme: "light" | "dark"
}

export function PreviewContent({
  designId,
  designName,
  demoUrl,
  previewMode,
  previewTheme,
}: PreviewContentProps) {
  return (
    <div className={cn(
      "flex-1 overflow-hidden min-h-0",
      previewTheme === "dark" ? "bg-[#0d1117]" : "bg-background"
    )}>
      <div 
        className={cn(
          "w-full h-full transition-all duration-300",
          previewMode === "mobile" ? "max-w-[375px] mx-auto" : "w-full"
        )}
      >
        {demoUrl ? (
          <ViewTransition name={`design-thumbnail-${designId}`} share="morph">
            <div className="w-full h-full">
              <iframe
                src={demoUrl}
                className="w-full h-full border-0"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                title={`${designName} preview`}
              />
            </div>
          </ViewTransition>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
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
