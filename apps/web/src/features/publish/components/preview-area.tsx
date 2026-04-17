"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  CodeIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

interface PreviewAreaProps {
  previewUrl: string | null
  onToggleEditor: () => void
  isEditorOpen: boolean
}

export function PreviewArea({
  previewUrl,
  onToggleEditor,
  isEditorOpen,
}: PreviewAreaProps) {
  return (
    <main className="flex-1 flex flex-col min-h-0 bg-muted/30">
      {/* Toolbar with Tabs */}
      <div className="h-12 border-b flex items-center px-4 bg-background/50">
        <div className="flex items-center bg-muted rounded-lg p-0.5">
          <button
            onClick={() => isEditorOpen && onToggleEditor()}
            className={cn(
              "px-4 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1.5",
              !isEditorOpen
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <HugeiconsIcon icon={ViewIcon} className="size-3.5" />
            Preview
          </button>
          <button
            onClick={() => !isEditorOpen && onToggleEditor()}
            className={cn(
              "px-4 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1.5",
              isEditorOpen
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <HugeiconsIcon icon={CodeIcon} className="size-3.5" />
            Code
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full w-full">
          <div className="h-full bg-background">
            {previewUrl ? (
              <iframe
                key={previewUrl}
                src={previewUrl}
                className="w-full h-full border-0"
                sandbox="allow-same-origin allow-scripts"
                title="Skill preview"
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
