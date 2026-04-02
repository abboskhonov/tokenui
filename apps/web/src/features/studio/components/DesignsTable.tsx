import { DesignRow } from "./DesignRow"
import type { Design } from "@/lib/types/design"

interface DesignsTableProps {
  designs: Design[]
  isLoading: boolean
  activeTab: "published" | "draft"
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function DesignsTable({
  designs,
  isLoading,
  activeTab,
  onEdit,
  onDelete,
}: DesignsTableProps) {
  return (
    <div className="rounded-xl bg-card/50 ring-1 ring-border">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border text-left text-sm text-muted-foreground">
            <th className="py-3 font-medium">Component</th>
            <th className="py-3 font-medium">Status</th>
            <th className="py-3 font-medium">Visibility</th>
            <th className="py-3 font-medium">Created</th>
            <th className="py-3 font-medium">Views</th>
            <th className="py-3 font-medium">Likes</th>
            <th className="py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={7} className="py-12 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
              </td>
            </tr>
          ) : designs.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="py-12 text-center text-muted-foreground"
              >
                No {activeTab === "published" ? "demos" : "drafts"} yet
              </td>
            </tr>
          ) : (
            designs.map((design) => (
              <DesignRow
                key={design.id}
                design={design}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
