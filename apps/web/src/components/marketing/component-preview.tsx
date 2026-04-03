import { cn } from "@/lib/utils"

interface ComponentPreviewProps {
  children?: React.ReactNode
  className?: string
}

// Dot pattern background like 21st.dev
function DotPattern() {
  return (
    <div
      className="absolute inset-0 opacity-[0.15]"
      style={{
        backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
        backgroundSize: "16px 16px",
      }}
    />
  )
}

// Clean preview card with dot pattern background
export function ComponentPreview({ children, className }: ComponentPreviewProps) {
  return (
    <div
      className={cn(
        "relative aspect-[4/3] overflow-hidden bg-background",
        className
      )}
    >
      <DotPattern />
      
      {/* Center the component */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        {children || (
          <div className="text-sm text-muted-foreground">
            No preview available
          </div>
        )}
      </div>
    </div>
  )
}

// Generate a deterministic color for a design name
export function getDesignColor(name: string): string {
  const colors = [
    "#f59e0b", // amber
    "#ef4444", // red
    "#f97316", // orange
    "#84cc16", // lime
    "#10b981", // emerald
    "#06b6d4", // cyan
    "#3b82f6", // blue
    "#6366f1", // indigo
    "#8b5cf6", // violet
    "#d946ef", // fuchsia
    "#f43f5e", // rose
  ]
  
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

// Simple colored icon placeholder
export function DesignIcon({ name, className }: { name: string; className?: string }) {
  const color = getDesignColor(name)
  const initial = name.charAt(0).toUpperCase()
  
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg font-medium text-white text-sm",
        className
      )}
      style={{ backgroundColor: color }}
    >
      {initial}
    </div>
  )
}
