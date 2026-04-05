import { DesignCard } from "./design-card"
import type { Design } from "@/lib/types/design"

interface DesignsGridProps {
  designs: Design[]
  username: string
}

export function DesignsGrid({ designs, username }: DesignsGridProps) {
  if (designs.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-muted-foreground">No components found</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-12">
      {designs.map((design) => (
        <DesignCard key={design.id} design={design} username={username} />
      ))}
    </div>
  )
}
