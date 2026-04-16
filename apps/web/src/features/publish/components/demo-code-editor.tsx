"use client"

import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Copy01Icon, Tick02Icon, Cancel01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { CodeEditor } from "./code-editor"

interface DemoCodeEditorProps {
  demoCode: string
  setDemoCode: (code: string) => void
  isCopied: boolean
  onCopy: () => void
  onClose: () => void
}

export function DemoCodeEditor({
  demoCode,
  setDemoCode,
  isCopied,
  onCopy,
  onClose,
}: DemoCodeEditorProps) {
  return (
    <div 
      className="absolute inset-0 bg-background/95 backdrop-blur-sm flex flex-col z-50"
      style={{ pointerEvents: 'auto' }}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <span className="text-sm font-medium">Demo Code Editor</span>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 gap-1.5 text-xs"
            onClick={onCopy}
          >
            <HugeiconsIcon 
              icon={isCopied ? Tick02Icon : Copy01Icon} 
              className={cn("size-3.5", isCopied && "text-green-500")} 
            />
            {isCopied ? "Copied!" : "Copy"}
          </Button>
          <Button 
            variant="ghost" 
            size="icon-sm" 
            className="h-7 w-7"
            onClick={onClose}
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <CodeEditor
          value={demoCode}
          onChange={setDemoCode}
          language="markup"
          placeholder={`<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="p-8">
  <!-- Your demo here -->
</body>
</html>`}
        />
      </div>
    </div>
  )
}
