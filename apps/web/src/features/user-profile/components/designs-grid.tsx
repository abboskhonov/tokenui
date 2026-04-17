import { DesignCard } from "./design-card"
import type { Design } from "@/lib/types/design"
import type { UserProfile } from "@/lib/queries/users"

interface DesignsGridProps {
  designs: Design[]
  username: string
  user?: UserProfile
}

export function DesignsGrid({ designs, username, user }: DesignsGridProps) {
  if (designs.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-muted-foreground">No components found</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 grid-cols-2 pb-12">
      {designs.map((design) => (
        <DesignCard key={design.id} design={design} username={username} user={user} />
      ))}
    </div>
  )
}
