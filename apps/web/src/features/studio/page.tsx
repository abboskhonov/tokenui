"use client"

import { useState, useCallback } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useStudioDesigns, useDeleteStudioDesign } from "./queries"
import { useAnalyticsSummary, useCliAnalytics } from "@/lib/queries/designs"
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
  
  // Fire all queries in parallel for maximum speed
  const { data: designs, isLoading: isDesignsLoading } = useStudioDesigns()
  // Combined analytics - views and stars load together in one request
  const { data: analytics, isLoading: isAnalyticsLoading } = useAnalyticsSummary()
  const { data: cliAnalytics, isLoading: isCliAnalyticsLoading } = useCliAnalytics()
  
  const deleteMutation = useDeleteStudioDesign()
  
  const [activeTab, setActiveTab] = useState<"approved" | "pending" | "draft" | "rejected">("approved")
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Filter designs based on tab and search
  const filteredDesigns = designs?.filter((design) => {
    const matchesTab = design.status === activeTab
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

      <main className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-16 xl:px-20 py-8">
        {/* Stats - shows skeleton while loading */}
        <StudioStats 
          designs={designs} 
          viewAnalytics={analytics ? { dailyViews: analytics.dailyViews, totalViews: analytics.totalViews } : undefined}
          starAnalytics={analytics ? { dailyStars: analytics.dailyStars, totalStars: analytics.totalStars } : undefined}
          downloadAnalytics={analytics ? { dailyDownloads: analytics.dailyDownloads, totalDownloads: analytics.totalDownloads } : undefined}
          cliAnalytics={cliAnalytics}
          isAnalyticsLoading={isAnalyticsLoading}
          isCliLoading={isCliAnalyticsLoading}
        />

        {/* Filters - shows immediately */}
        <StudioFilters
          designs={designs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Designs Table - shows immediately with its own loading state */}
        <DesignsTable
          designs={filteredDesigns}
          isLoading={isDesignsLoading}
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
