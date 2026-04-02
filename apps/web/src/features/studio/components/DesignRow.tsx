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
import { Badge } from "@/components/ui/badge"
import type { Design } from "@/lib/types/design"

interface DesignRowProps {
  design: Design
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function DesignRow({ design, onEdit, onDelete }: DesignRowProps) {
  return (
    <tr className="border-b border-border transition-colors hover:bg-muted/50">
      <td className="py-4">
        <div className="flex items-center gap-3">
          {design.thumbnailUrl ? (
            <img
              src={design.thumbnailUrl}
              alt={design.name}
              className="h-10 w-16 rounded object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-10 w-16 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
              No img
            </div>
          )}
          <span className="font-medium">{design.name}</span>
        </div>
      </td>
      <td className="py-4">
        <Badge variant={design.isPublic ? "default" : "secondary"}>
          {design.isPublic ? "Published" : "Draft"}
        </Badge>
      </td>
      <td className="py-4 text-sm text-muted-foreground">
        {design.isPublic ? "Public" : "Private"}
      </td>
      <td className="py-4 text-sm text-muted-foreground">
        {new Date(design.createdAt).toLocaleDateString()}
      </td>
      <td className="py-4 text-sm">{design.viewCount}</td>
      <td className="py-4 text-sm">0</td>
      <td className="py-4">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <HugeiconsIcon icon={MoreVerticalIcon} className="size-4" />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(design.id)}>
              <HugeiconsIcon icon={Edit01Icon} className="mr-2 size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(design.id)}
              className="text-destructive"
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
