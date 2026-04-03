"use client"

import { useState, useCallback } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useStudioDesigns, useDeleteStudioDesign } from "./queries"
import { Navigation } from "@/components/navigation/main-navigation"
import { StudioStats } from "./components/StudioStats"
import { StudioFilters } from "./components/StudioFilters"
import { DesignsTable } from "./components/DesignsTable"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function StudioPage() {
  const navigate = useNavigate()
  const { data: designs, isLoading } = useStudioDesigns()
  const deleteMutation = useDeleteStudioDesign()
  
  const [activeTab, setActiveTab] = useState<"published" | "draft">("published")
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Filter designs based on tab and search
  const filteredDesigns = designs?.filter((design) => {
    const matchesTab = activeTab === "published" ? design.isPublic : !design.isPublic
    const matchesSearch = design.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  }) || []

  const handleEdit = useCallback((id: string) => {
    navigate({ to: "/publish", search: { edit: id } })
  }, [navigate])

  const handleDeleteClick = useCallback((id: string) => {
    setDeleteId(id)
  }, [])

  const handleConfirmDelete = useCallback(() => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => setDeleteId(null),
      })
    }
  }, [deleteId, deleteMutation])

  const handleCancelDelete = useCallback(() => {
    setDeleteId(null)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats */}
        <StudioStats designs={designs} />

        {/* Filters */}
        <StudioFilters
          designs={designs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Designs Table */}
        <DesignsTable
          designs={filteredDesigns}
          isLoading={isLoading}
          activeTab={activeTab}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={handleCancelDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Design</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this design? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
