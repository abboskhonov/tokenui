import { HugeiconsIcon } from "@hugeicons/react"
import {
  Edit01Icon,
  Delete01Icon,
  MoreVerticalIcon,
  Alert01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { Design } from "@/lib/types/design"
import { useState } from "react"

interface DesignRowProps {
  design: Design
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function DesignRow({ design, onEdit, onDelete }: DesignRowProps) {
  // Calculate copies as 10% of views (min 1)
  const copies = Math.max(1, Math.floor(design.viewCount * 0.1))
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false)
  
  return (
    <>
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
              {/* Show admin message for rejected designs */}
              {design.status === "rejected" && design.reviewMessage && (
                <button 
                  onClick={() => setShowFeedbackDialog(true)}
                  className="mt-2 flex items-start gap-1.5 text-xs text-left text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30 rounded-md px-2 py-1.5 max-w-md cursor-pointer transition-colors"
                >
                  <HugeiconsIcon icon={Alert01Icon} className="size-3.5 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">
                    <span className="font-medium">Feedback:</span> {design.reviewMessage}
                  </span>
                </button>
              )}
            </div>
          </div>
        </td>
        <td className="py-3 px-4">
          <span 
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
              design.status === "approved" 
                ? "bg-green-500/10 text-green-600 dark:text-green-400" 
                : design.status === "pending"
                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                : design.status === "rejected"
                ? "bg-red-500/10 text-red-600 dark:text-red-400"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
            )}
          >
            {design.status === "approved" ? "Published" : design.status === "pending" ? "Reviewing" : design.status === "rejected" ? "Rejected" : "Draft"}
          </span>
        </td>
        <td className="py-3 px-4 text-sm text-muted-foreground">
          {design.status === "approved" ? "Public" : design.status === "pending" ? "Under Review" : "Private"}
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

      {/* Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <HugeiconsIcon icon={Alert01Icon} className="size-5" />
              Design Rejected
            </DialogTitle>
            <DialogDescription>
              Feedback from the admin on why your design was not approved.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900">
            <p className="text-sm text-red-800 dark:text-red-200 whitespace-pre-wrap">
              {design.reviewMessage}
            </p>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setShowFeedbackDialog(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}