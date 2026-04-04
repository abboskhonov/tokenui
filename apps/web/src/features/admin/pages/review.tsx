import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Eye, Loader2, MessageSquare, Code, Monitor, Smartphone, Sun, Moon, RefreshCw, Copy, Check } from "lucide-react";
import { usePendingDesigns, useApproveDesign, useRejectDesign } from "../queries";
import { toast } from "sonner";
import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { SkillCard } from "@/components/marketing/skill-card";

// Design preview type
interface PendingDesign {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  category: string;
  content: string;
  thumbnailUrl: string | null;
  demoUrl: string | null;
  createdAt: string;
  userId: string;
  author: string;
  authorImage: string | null;
}

export function AdminReviewPage() {
  const { data: pendingReviews, isLoading } = usePendingDesigns();
  const approveMutation = useApproveDesign();
  const rejectMutation = useRejectDesign();
  const [message, setMessage] = useState("");
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");
  
  // Preview dialog state
  const [previewDesign, setPreviewDesign] = useState<PendingDesign | null>(null);
  const [previewTab, setPreviewTab] = useState<"preview" | "code">("preview");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light");
  const [isCopied, setIsCopied] = useState(false);

  const handleAction = async () => {
    if (!selectedDesignId) return;
    
    try {
      if (actionType === "approve") {
        await approveMutation.mutateAsync({ designId: selectedDesignId, message });
        toast.success("Design approved successfully");
      } else {
        await rejectMutation.mutateAsync({ designId: selectedDesignId, message });
        toast.success("Design rejected");
      }
      setDialogOpen(false);
      setMessage("");
      setSelectedDesignId(null);
    } catch (error) {
      toast.error(actionType === "approve" ? "Failed to approve design" : "Failed to reject design");
    }
  };

  const openActionDialog = (designId: string, action: "approve" | "reject") => {
    setSelectedDesignId(designId);
    setActionType(action);
    setDialogOpen(true);
  };

  const openPreview = (design: PendingDesign) => {
    setPreviewDesign(design);
    setPreviewTab("preview");
    setPreviewMode("desktop");
    setPreviewTheme("light");
  };

  const handleCopyCode = useCallback(() => {
    if (previewDesign?.content) {
      navigator.clipboard.writeText(previewDesign.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast.success("Code copied to clipboard");
    }
  }, [previewDesign?.content]);

  const refreshPreview = useCallback(() => {
    const iframe = document.querySelector(`iframe[data-design-id="${previewDesign?.id}"]`) as HTMLIFrameElement;
    if (iframe && previewDesign?.demoUrl) {
      const url = new URL(previewDesign.demoUrl);
      url.searchParams.set("_t", Date.now().toString());
      iframe.src = url.toString();
    }
  }, [previewDesign?.demoUrl, previewDesign?.id]);

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
          <h1 className="text-2xl font-bold tracking-tight">Review Queue</h1>
          <p className="text-muted-foreground">
            Review and approve submitted design skills
          </p>
        </div>
        <Badge variant="secondary" className="text-base px-3 py-1">
          {pendingReviews?.length ?? 0} pending
        </Badge>
      </div>

      {/* Pending Reviews List */}
      <div className="space-y-4">
        {pendingReviews?.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Thumbnail */}
                <div className="h-24 w-24 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                  {item.thumbnailUrl ? (
                    <img 
                      src={item.thumbnailUrl} 
                      alt={item.name} 
                      className="h-full w-full object-cover rounded-lg" 
                    />
                  ) : (
                    <div className="h-full w-full">
                      <SkillCard variant="pattern" className="h-full w-full" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        by @{item.author} • {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline">{item.category}</Badge>
                  </div>
                  
                  <p className="text-sm mt-2 text-muted-foreground line-clamp-2">
                    {item.description || "No description provided"}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="gap-1"
                      onClick={() => openPreview(item)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                    >
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                    <Button 
                      size="sm" 
                      variant="default" 
                      className="gap-1 bg-green-600 hover:bg-green-700"
                      onClick={() => openActionDialog(item.id, "approve")}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      className="gap-1"
                      onClick={() => openActionDialog(item.id, "reject")}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(pendingReviews?.length === 0 || !pendingReviews) && (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-semibold text-lg">All Caught Up!</h3>
            <p className="text-muted-foreground">No designs waiting for review</p>
          </CardContent>
        </Card>
      )}

      {/* Action Dialog with Message Input */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approve Design" : "Reject Design"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve" 
                ? "Add an optional message for the creator (e.g., 'Great work!'). This will be shown to them."
                : "Please provide a reason for rejection. This will help the creator understand what needs to be improved."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {actionType === "approve" ? "Approval Message (Optional)" : "Rejection Reason (Optional)"}
              </span>
            </div>
            <Input
              placeholder={actionType === "approve" ? "e.g., Great work!" : "e.g., Needs more details..."}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAction}
              variant={actionType === "approve" ? "default" : "destructive"}
              className={actionType === "approve" ? "bg-green-600 hover:bg-green-700" : ""}
              disabled={approveMutation.isPending || rejectMutation.isPending}
            >
              {actionType === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog - Large Full-Screen Style */}
      <Dialog open={!!previewDesign} onOpenChange={() => setPreviewDesign(null)}>
        <DialogContent className="sm:max-w-[95vw] w-[95vw] h-[90vh] p-0 overflow-hidden gap-0 bg-background">
          <DialogTitle className="sr-only">Design Preview</DialogTitle>
          {previewDesign && (
            <div className="flex h-full">
              {/* Left Sidebar - Design Info */}
              <div className="w-[300px] bg-muted/30 border-r flex flex-col overflow-y-auto">
                <div className="p-6 space-y-6">
                  {/* Design Info */}
                  <div>
                    <h2 className="text-xl font-semibold mb-1">{previewDesign.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      by @{previewDesign.author}
                    </p>
                  </div>

                  {/* Category */}
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{previewDesign.category}</Badge>
                    <Badge variant="secondary">Pending Review</Badge>
                  </div>

                  {/* Description */}
                  {previewDesign.description && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Description
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {previewDesign.description}
                      </p>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="pt-4 border-t border-border space-y-3">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Submitted</span>
                        <span>{new Date(previewDesign.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Slug</span>
                        <span className="font-mono text-xs">{previewDesign.slug || previewDesign.id.slice(0, 8)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="pt-4 border-t border-border space-y-3">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </h4>
                    <div className="space-y-2">
                      <Button 
                        className="w-full gap-2 bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          setPreviewDesign(null);
                          openActionDialog(previewDesign.id, "approve");
                        }}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button 
                        variant="destructive"
                        className="w-full gap-2"
                        onClick={() => {
                          setPreviewDesign(null);
                          openActionDialog(previewDesign.id, "reject");
                        }}
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content - Preview Area */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Toolbar */}
                <div className="flex items-center justify-between px-4 py-3 border-b bg-background/50">
                  <div className="flex items-center gap-2">
                    {/* Tab Toggle */}
                    <div className="flex items-center bg-muted rounded-lg p-0.5">
                      <button
                        onClick={() => setPreviewTab("preview")}
                        className={cn(
                          "px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1.5",
                          previewTab === "preview" 
                            ? "bg-background text-foreground shadow-sm" 
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Monitor className="h-3.5 w-3.5" />
                        Preview
                      </button>
                      <button
                        onClick={() => setPreviewTab("code")}
                        className={cn(
                          "px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1.5",
                          previewTab === "code" 
                            ? "bg-background text-foreground shadow-sm" 
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Code className="h-3.5 w-3.5" />
                        Code
                      </button>
                    </div>

                    {previewTab === "preview" && (
                      <>
                        <div className="h-4 w-px bg-border mx-1" />
                        
                        {/* Device Toggle */}
                        <div className="flex items-center bg-muted rounded-lg p-0.5">
                          <button
                            onClick={() => setPreviewMode("desktop")}
                            className={cn(
                              "px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1.5",
                              previewMode === "desktop" 
                                ? "bg-background text-foreground shadow-sm" 
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <Monitor className="h-3.5 w-3.5" />
                            Desktop
                          </button>
                          <button
                            onClick={() => setPreviewMode("mobile")}
                            className={cn(
                              "px-2.5 py-1 rounded text-xs font-medium transition-all flex items-center gap-1.5",
                              previewMode === "mobile" 
                                ? "bg-background text-foreground shadow-sm" 
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <Smartphone className="h-3.5 w-3.5" />
                            Mobile
                          </button>
                        </div>

                        <div className="h-4 w-px bg-border mx-1" />

                        {/* Theme Toggle */}
                        <Button 
                          variant="ghost" 
                          size="icon-sm" 
                          className="h-7 w-7"
                          onClick={() => setPreviewTheme(previewTheme === "dark" ? "light" : "dark")}
                        >
                          {previewTheme === "dark" ? (
                            <Sun className="h-3.5 w-3.5" />
                          ) : (
                            <Moon className="h-3.5 w-3.5" />
                          )}
                        </Button>

                        {/* Refresh */}
                        <Button 
                          variant="ghost" 
                          size="icon-sm" 
                          className="h-7 w-7"
                          onClick={refreshPreview}
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    )}

                    {previewTab === "code" && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 ml-2"
                        onClick={handleCopyCode}
                      >
                        {isCopied ? (
                          <><Check className="h-4 w-4 text-green-500" /> Copied!</>
                        ) : (
                          <><Copy className="h-4 w-4" /> Copy Code</>
                        )}
                      </Button>
                    )}
                  </div>

                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setPreviewDesign(null)}
                  >
                    Close
                  </Button>
                </div>

                {/* Content Area */}
                {previewTab === "preview" ? (
                  <div className={cn(
                    "flex-1 overflow-hidden",
                    previewTheme === "dark" ? "bg-[#0d1117]" : "bg-background"
                  )}>
                    <div 
                      className={cn(
                        "w-full h-full transition-all duration-300",
                        previewMode === "mobile" ? "max-w-[375px] mx-auto" : "w-full"
                      )}
                    >
                      {previewDesign.demoUrl ? (
                        <iframe
                          data-design-id={previewDesign.id}
                          src={previewDesign.demoUrl}
                          className="w-full h-full border-0"
                          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                          title={`${previewDesign.name} preview`}
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <div className="w-full max-w-md">
                            <SkillCard variant="pattern" className="w-full" />
                            <p className="text-sm text-muted-foreground text-center mt-4">
                              No preview available for this design
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-auto bg-[#0d1117]">
                    <div className="p-6">
                      <pre className="text-sm font-mono text-white/90 whitespace-pre-wrap">
                        {previewDesign.content || "// No code available"}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
