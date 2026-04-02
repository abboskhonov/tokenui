import { HugeiconsIcon } from "@hugeicons/react"
import {
  Edit01Icon,
  Delete01Icon,
  MoreVerticalIcon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Design } from "@/lib/types/design"

interface DesignRowProps {
  design: Design
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function DesignRow({ design, onEdit, onDelete }: DesignRowProps) {
  // Calculate copies as 10% of views (min 1)
  const copies = Math.max(1, Math.floor(design.viewCount * 0.1))
  
  return (
    <tr 
      className={cn(
        "border-b border-border/50 transition-colors duration-200",
        "hover:bg-muted/40"
      )}
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-20 overflow-hidden rounded-md bg-muted ring-1 ring-border/50">
            {design.thumbnailUrl ? (
              <img
                src={design.thumbnailUrl}
                alt={design.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                —
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{design.name}</span>
            <span className="text-xs text-muted-foreground">{design.category}</span>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <span 
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
            design.isPublic 
              ? "bg-green-500/10 text-green-600 dark:text-green-400" 
              : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
          )}
        >
          {design.isPublic ? "Published" : "Draft"}
        </span>
      </td>
      <td className="py-3 px-4 text-sm text-muted-foreground">
        {design.isPublic ? "Public" : "Private"}
      </td>
      <td className="py-3 px-4 text-sm text-muted-foreground tabular-nums">
        {new Date(design.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </td>
      <td className="py-3 px-4 text-right text-sm tabular-nums text-muted-foreground">
        {design.viewCount.toLocaleString()}
      </td>
      <td className="py-3 px-4 text-right text-sm tabular-nums text-muted-foreground">
        {copies.toLocaleString()}
      </td>
      <td className="py-3 px-4 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <HugeiconsIcon icon={MoreVerticalIcon} className="size-4" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onEdit(design.id)}>
              <HugeiconsIcon icon={Edit01Icon} className="mr-2 size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(design.id)}
              className="text-destructive focus:text-destructive"
            >
              <HugeiconsIcon icon={Delete01Icon} className="mr-2 size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  )
}