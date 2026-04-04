import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Filter, 
  Eye, 
  Trash2, 
  Loader2, 
  AlertTriangle, 
  LayoutGrid, 
  Table, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAdminDesigns, useDeleteDesign, type AdminDesign } from "../queries";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SkillCard } from "@/components/marketing/skill-card";

// Card component for grid view
function DesignCard({ 
  design, 
  onDelete 
}: { 
  design: AdminDesign
  onDelete: (design: { id: string; name: string }) => void
}) {
  const copies = Math.max(1, Math.floor(design.viewCount * 0.1));
  
  return (
    <div className="group relative rounded-xl bg-card ring-1 ring-border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-foreground/5 hover:ring-border/80">
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {design.thumbnailUrl ? (
          <img
            src={design.thumbnailUrl}
            alt={design.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <SkillCard variant="pattern" />
        )}
        
        {/* Status badge */}
        <div className="absolute top-2 left-2">
          <Badge 
            variant={design.status === "approved" ? "default" : design.status === "rejected" ? "destructive" : "secondary"}
            className={cn(
              "text-xs border-0",
              design.status === "approved" ? "bg-green-600" : ""
            )}
          >
            {design.status.charAt(0).toUpperCase() + design.status.slice(1)}
          </Badge>
        </div>
        
        {/* Actions dropdown */}
        <div className="absolute top-2 right-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/50 text-white hover:bg-black/70 hover:text-white">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <Link 
                to="/s/$username/$designSlug" 
                params={{ 
                  username: design.author, 
                  designSlug: design.slug || design.id 
                }}
              >
                <DropdownMenuItem className="cursor-pointer">
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem 
                onClick={() => onDelete({ id: design.id, name: design.name })}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Info */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-sm text-foreground truncate">{design.name}</h3>
            <p className="text-xs text-muted-foreground truncate">@{design.author}</p>
          </div>
        </div>
        
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="tabular-nums">{design.viewCount.toLocaleString()} views</span>
          <span className="tabular-nums">{copies.toLocaleString()} copies</span>
        </div>
        
        <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{design.category}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(design.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

// Table row component
function DesignTableRow({ 
  design, 
  onDelete 
}: { 
  design: AdminDesign
  onDelete: (design: { id: string; name: string }) => void
}) {
  return (
    <tr className="border-b transition-colors hover:bg-muted/50">
      <td className="p-4 align-middle">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted ring-1 ring-border/50 shrink-0">
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
          <span className="font-medium">{design.name}</span>
        </div>
      </td>
      <td className="p-4 align-middle">@{design.author}</td>
      <td className="p-4 align-middle">{design.category}</td>
      <td className="p-4 align-middle">
        <Badge 
          variant={design.status === "approved" ? "default" : design.status === "rejected" ? "destructive" : "secondary"}
          className={design.status === "approved" ? "bg-green-600" : ""}
        >
          {design.status.charAt(0).toUpperCase() + design.status.slice(1)}
        </Badge>
      </td>
      <td className="p-4 align-middle">{design.viewCount.toLocaleString()}</td>
      <td className="p-4 align-middle text-muted-foreground">
        {new Date(design.createdAt).toLocaleDateString()}
      </td>
      <td className="p-4 align-middle">
        <div className="flex items-center gap-1">
          <Link 
            to="/s/$username/$designSlug" 
            params={{ 
              username: design.author, 
              designSlug: design.slug || design.id 
            }}
          >
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete({ id: design.id, name: design.name })}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

export function AdminDesignsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const { data, isLoading } = useAdminDesigns(currentPage, pageSize);
  const deleteMutation = useDeleteDesign();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [designToDelete, setDesignToDelete] = useState<{ id: string; name: string } | null>(null);

  const designs = data?.designs || [];
  const pagination = data?.pagination;

  const filteredDesigns = designs.filter((design) => {
    const matchesSearch = 
      design.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      design.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      design.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      statusFilter === design.status;
    
    return matchesSearch && matchesStatus;
  });

  const handleDeleteClick = (design: { id: string; name: string }) => {
    setDesignToDelete(design);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!designToDelete) return;
    
    try {
      await deleteMutation.mutateAsync(designToDelete.id);
      toast.success(`Design "${designToDelete.name}" deleted successfully`);
      setDeleteDialogOpen(false);
      setDesignToDelete(null);
    } catch (error) {
      toast.error("Failed to delete design");
    }
  };

  // Reset to first page when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value || "all");
    setCurrentPage(1);
  };

  const totalPages = pagination ? Math.ceil(pagination.total / pageSize) : 0;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">All Designs</h1>
          <p className="text-muted-foreground">
            Manage all submitted design skills
            {pagination && (
              <span className="ml-2 text-xs">
                ({pagination.total.toLocaleString()} total)
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search designs..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => handleStatusChange(value || "all")}>
              <SelectTrigger className="w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select value={pageSize.toString()} onValueChange={(v) => {
              setPageSize(parseInt(v || "20"));
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-[130px]">
                <span className="text-xs text-muted-foreground mr-1">Show</span>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
            
            {/* View Mode Toggle */}
            <div className="flex items-center bg-muted rounded-lg p-0.5">
              <button
                onClick={() => setViewMode("cards")}
                className={cn(
                  "px-3 py-1.5 rounded text-sm font-medium transition-all flex items-center gap-1.5",
                  viewMode === "cards" 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <LayoutGrid className="h-4 w-4" />
                Cards
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={cn(
                  "px-3 py-1.5 rounded text-sm font-medium transition-all flex items-center gap-1.5",
                  viewMode === "table" 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Table className="h-4 w-4" />
                Table
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Designs Display */}
      {viewMode === "cards" ? (
        // Cards Grid View
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {filteredDesigns.map((design) => (
            <DesignCard 
              key={design.id} 
              design={design} 
              onDelete={handleDeleteClick}
            />
          ))}
          {filteredDesigns.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <p className="text-muted-foreground">No designs found on this page</p>
            </div>
          )}
        </div>
      ) : (
        // Table View
        <Card>
          <CardContent className="p-0">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b bg-muted/50">
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium">Design</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Author</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Category</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Views</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Created</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDesigns.map((design) => (
                    <DesignTableRow 
                      key={design.id} 
                      design={design} 
                      onDelete={handleDeleteClick}
                    />
                  ))}
                  {filteredDesigns.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground">
                        No designs found on this page
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, pagination.total)} of {pagination.total.toLocaleString()} designs
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show pages around current page
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="icon-sm"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Design
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>&quot;{designToDelete?.name}&quot;</strong>? 
              This action cannot be undone and will permanently remove this design from the platform.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Deleting...</>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
