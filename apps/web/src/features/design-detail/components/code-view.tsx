import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeftIcon, Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

interface CodeViewProps {
  content: string
  isCopied: boolean
  onBackToPreview: () => void
  onCopyCode: () => void
}

export function CodeView({
  content,
  isCopied,
  onBackToPreview,
  onCopyCode,
}: CodeViewProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-background/50">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 h-8 text-xs"
            onClick={onBackToPreview}
          >
            <HugeiconsIcon icon={ArrowLeftIcon} className="size-3.5" />
            Back to preview
          </Button>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 h-8 text-xs"
          onClick={onCopyCode}
        >
          <HugeiconsIcon 
            icon={isCopied ? Tick02Icon : Copy01Icon} 
            className={cn("size-3.5", isCopied && "text-green-500")}
          />
          {isCopied ? "Copied!" : "Copy code"}
        </Button>
      </div>
      <div className="flex-1 overflow-auto bg-[#0d1117]">
        <div className="max-w-4xl mx-auto p-6">
          <pre className="text-sm font-mono text-white/90 whitespace-pre-wrap">
            {content || "// No code available"}
          </pre>
        </div>
      </div>
    </div>
  )
}
