"use client"

import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  ComputerIcon,
  Sun01Icon,
  Moon01Icon,
  CodeIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

interface PreviewAreaProps {
  previewUrl: string | null
  previewMode: "desktop" | "mobile"
  setPreviewMode: (mode: "desktop" | "mobile") => void
  previewTheme: "light" | "dark"
  setPreviewTheme: (theme: "light" | "dark") => void
  onToggleEditor: () => void
  isEditorOpen: boolean
}

export function PreviewArea({
  previewUrl,
  previewMode,
  setPreviewMode,
  previewTheme,
  setPreviewTheme,
  onToggleEditor,
  isEditorOpen,
}: PreviewAreaProps) {
  return (
    <main className="flex-1 flex flex-col min-h-0 bg-muted/30">
      {/* Toolbar */}
      <div className="h-12 border-b flex items-center justify-between px-4 bg-background/50">
        <div className="flex items-center gap-2 text-sm font-medium">
          <HugeiconsIcon icon={CodeIcon} className="size-4 text-muted-foreground" />
          Preview
        </div>
        <div className="flex items-center gap-2">
          {/* Device Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-0.5">
            <button
              onClick={() => setPreviewMode("desktop")}
              className={cn(
                "px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1.5",
                previewMode === "desktop" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <HugeiconsIcon icon={ComputerIcon} className="size-3.5" />
              Desktop
            </button>
            <button
              onClick={() => setPreviewMode("mobile")}
              className={cn(
                "px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1.5",
                previewMode === "mobile" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <HugeiconsIcon icon={ComputerIcon} className="size-3.5 rotate-90" />
              Mobile
            </button>
          </div>

          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="icon-sm" 
            className="h-8 w-8"
            onClick={() => setPreviewTheme(previewTheme === "light" ? "dark" : "light")}
          >
            <HugeiconsIcon 
              icon={previewTheme === "dark" ? Sun01Icon : Moon01Icon} 
              className="size-4" 
            />
          </Button>

          {/* Edit Demo Button */}
          <Button 
            variant="outline" 
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={onToggleEditor}
          >
            <HugeiconsIcon icon={CodeIcon} className="size-3.5" />
            {isEditorOpen ? "Hide Code" : "Edit HTML"}
          </Button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-hidden relative">
        <div className={cn(
          "h-full transition-all duration-300 mx-auto",
          previewMode === "mobile" ? "max-w-[375px]" : "w-full"
        )}>
          <div className={cn(
            "h-full",
            previewTheme === "dark" ? "bg-[#0d1117]" : "bg-background"
          )}>
            {previewUrl ? (
              <iframe
                key={previewUrl}
                src={previewUrl}
                className="w-full h-full border-0"
                sandbox="allow-same-origin allow-scripts"
                title="Component preview"
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-2 text-muted-foreground">
                  <p>No preview available</p>
                  <p className="text-sm">Edit the demo code to create a preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
