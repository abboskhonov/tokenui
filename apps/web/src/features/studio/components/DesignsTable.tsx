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
    <div className="rounded-xl bg-card/50 ring-1 ring-border overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Component
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-[100px]">
              Status
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-[100px]">
              Visibility
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-[120px]">
              Created
            </th>
            <th className="py-3 px-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider w-[80px]">
              Views
            </th>
            <th className="py-3 px-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider w-[80px]">
              Copies
            </th>
            <th className="py-3 px-4 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider w-[60px]">
              
            </th>
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
