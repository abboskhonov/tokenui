import { createFileRoute, Link } from "@tanstack/react-router"
import { useDesign } from "@/lib/queries/designs"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  Copy01Icon, 
  ComputerIcon,
  Cancel01Icon,
  File01Icon,
  ArrowLeftIcon,
  Menu01Icon,
  Sun01Icon,
  Moon01Icon,
  ReloadIcon,
  CodeIcon,
  Bookmark01Icon,
  MoreVerticalIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { useState, useCallback } from "react"
import * as React from "react"
import { cn } from "@/lib/utils"

// ViewTransition is available in React canary - import from react
const ViewTransition = (React as { ViewTransition?: React.ComponentType<{ children?: React.ReactNode; name?: string; share?: string | object; enter?: string | object; exit?: string | object; default?: string; update?: string }> }).ViewTransition ?? (({ children }: { children?: React.ReactNode }) => children)

// Route parameter validation
export const Route = createFileRoute("/s/$username/$designSlug")({
  component: SkillDetailPage,
  head: ({ params }) => ({
    meta: [
      {
        title: `${params.designSlug} by ${params.username} - tokenui`,
      },
    ],
  }),
  errorComponent: () => <SkillDetailError />,
  notFoundComponent: () => <SkillNotFound />,
})

// Types
type TabType = "preview" | "code"

function SkillDetailPage() {
  const { username, designSlug } = Route.useParams()
  const { data: design, isLoading, error } = useDesign(username, designSlug)
  const [activeTab, setActiveTab] = useState<TabType>("preview")
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light")
  const [isCopied, setIsCopied] = useState<string | null>(null)

  const handleCopy = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(label)
      setTimeout(() => setIsCopied(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }, [])

  const handleCopyPrompt = useCallback(() => {
    if (design?.content) {
      handleCopy(design.content, "prompt")
    }
  }, [design?.content, handleCopy])

  const handleCopyCode = useCallback(() => {
    if (design?.content) {
      handleCopy(design.content, "code")
    }
  }, [design?.content, handleCopy])

  const togglePreviewTheme = useCallback(() => {
    setPreviewTheme(prev => prev === "light" ? "dark" : "light")
  }, [])

  const refreshPreview = useCallback(() => {
    const iframe = document.querySelector("iframe") as HTMLIFrameElement
    if (iframe && design?.demoUrl) {
      const url = new URL(design.demoUrl)
      url.searchParams.set("_t", Date.now().toString())
      iframe.src = url.toString()
    }
  }, [design?.demoUrl])

  if (isLoading) {
    return <SkillDetailLoading />
  }

  if (error || !design) {
    return <SkillDetailError />
  }

  const installationCommand = `npx tokenui add ${design.author?.username || username}/${design.slug}`

  return (
    <ViewTransition 
      enter={{ 'nav-forward': 'nav-forward-enter', 'nav-back': 'nav-back-enter', default: 'none' }}
      exit={{ 'nav-forward': 'nav-forward-exit', 'nav-back': 'nav-back-exit', default: 'none' }}
      default="none"
    >
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
      <header className="sticky top-0 z-50 h-14 border-b border-border bg-background/95 backdrop-blur-xl">
        <div className="mx-auto h-full max-w-[1800px] px-4 flex items-center justify-between">
          {/* Left: Menu + Breadcrumb */}
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon-sm" className="h-8 w-8 -ml-2">
                <HugeiconsIcon icon={Menu01Icon} className="size-4" />
              </Button>
            </Link>
            
            <div className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Skills
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">{username}</span>
              <span className="text-muted-foreground">/</span>
              <span className="font-medium">{designSlug}</span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2 h-8 text-xs"
              onClick={handleCopyPrompt}
            >
              <HugeiconsIcon 
                icon={isCopied === "prompt" ? Tick02Icon : Copy01Icon} 
                className={cn("size-4", isCopied === "prompt" && "text-green-500")} 
              />
              <span className="hidden sm:inline">
                {isCopied === "prompt" ? "Copied!" : "Copy prompt"}
              </span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2 h-8 text-xs"
              onClick={handleCopyCode}
            >
              <HugeiconsIcon 
                icon={isCopied === "code" ? Tick02Icon : File01Icon} 
                className={cn("size-4", isCopied === "code" && "text-green-500")} 
              />
              <span className="hidden sm:inline">
                {isCopied === "code" ? "Copied!" : "Copy code"}
              </span>
            </Button>

            <div className="h-4 w-px bg-border mx-1 hidden sm:block" />
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2 h-8 text-xs hidden sm:inline-flex"
              onClick={() => setActiveTab(activeTab === "preview" ? "code" : "preview")}
            >
              <HugeiconsIcon icon={CodeIcon} className="size-4" />
              View code
            </Button>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-[320px] min-h-[calc(100vh-56px)] border-r border-border bg-card/30 hidden lg:block">
          <div className="p-6 space-y-6">
            {/* Title Section */}
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{design.name.toLowerCase()}</h1>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {design.description || "A reusable UI component for modern applications."}
              </p>
            </div>

            {/* Created by */}
            <Link to="/u/$username" params={{ username }} className="flex items-center gap-3 group cursor-pointer">
              {design.author?.image ? (
                <img
                  src={design.author.image}
                  alt={design.author.name || "Author"}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-border group-hover:ring-primary/50 transition-all"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand to-brand/70 flex items-center justify-center text-primary-foreground font-medium">
                  {(design.author?.name || design.name).charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-medium group-hover:text-primary transition-colors">{design.author?.name || username}</p>
                <p className="text-xs text-muted-foreground">@{username}</p>
              </div>
            </Link>

            {/* Installation */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Install
              </p>
              <div 
                className="group relative rounded-lg bg-muted/50 px-3 py-2.5 font-mono text-xs cursor-pointer hover:bg-muted transition-colors border border-border/50"
                onClick={() => handleCopy(installationCommand, "install")}
              >
                <span className="text-muted-foreground">$</span>{" "}
                <span className="text-foreground">{installationCommand}</span>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <HugeiconsIcon 
                    icon={isCopied === "install" ? Tick02Icon : Copy01Icon} 
                    className={cn("size-3.5", isCopied === "install" && "text-green-500")}
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-lg font-semibold">{design.viewCount.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Views</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="text-lg font-semibold">
                  {Math.max(1, Math.floor(design.viewCount * 0.1)).toLocaleString()}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Copies</p>
              </div>
            </div>

            {/* Created date */}
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Created on {new Date(design.createdAt).toLocaleDateString("en-US", { 
                  month: "long", 
                  day: "numeric", 
                  year: "numeric" 
                })}
              </p>
            </div>
          </div>
        </aside>

        {/* Main Preview Area */}
        <main className="flex-1 min-h-[calc(100vh-56px)] bg-muted/30">
          {activeTab === "preview" ? (
            <div className="h-full flex flex-col">
              {/* Preview Toolbar */}
              <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-background/50">
                <div className="flex items-center gap-1">
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
                      <HugeiconsIcon icon={ComputerIcon} className="size-3.5" />
                      <span className="hidden sm:inline">Desktop</span>
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
                      <HugeiconsIcon icon={ComputerIcon} className="size-3.5 rotate-90" />
                      <span className="hidden sm:inline">Mobile</span>
                    </button>
                  </div>

                  <div className="h-4 w-px bg-border mx-2" />

                  {/* Theme Toggle */}
                  <Button 
                    variant="ghost" 
                    size="icon-sm" 
                    className="h-7 w-7"
                    onClick={togglePreviewTheme}
                  >
                    <HugeiconsIcon 
                      icon={previewTheme === "dark" ? Sun01Icon : Moon01Icon} 
                      className="size-3.5" 
                    />
                  </Button>

                  {/* Refresh */}
                  <Button 
                    variant="ghost" 
                    size="icon-sm" 
                    className="h-7 w-7"
                    onClick={refreshPreview}
                  >
                    <HugeiconsIcon icon={ReloadIcon} className="size-3.5" />
                  </Button>
                </div>

                {/* Right Toolbar */}
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon-sm" 
                    className="h-7 w-7"
                    onClick={() => setActiveTab("code")}
                  >
                    <HugeiconsIcon icon={CodeIcon} className="size-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" className="h-7 w-7">
                    <HugeiconsIcon icon={Bookmark01Icon} className="size-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" className="h-7 w-7">
                    <HugeiconsIcon icon={MoreVerticalIcon} className="size-3.5" />
                  </Button>
                </div>
              </div>

              {/* Preview Content */}
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
                  {design.demoUrl ? (
                    <ViewTransition 
                      name={`design-thumbnail-${design.id}`}
                      share="morph-forward"
                      default="none"
                    >
                      <iframe
                        src={design.demoUrl}
                        className="w-full h-full border-0"
                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                        title={`${design.name} preview`}
                      />
                    </ViewTransition>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                          <HugeiconsIcon icon={File01Icon} className="size-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          No preview available for this skill
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Code View */
            (<div className="h-full flex flex-col">
              <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-background/50">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2 h-8 text-xs"
                    onClick={() => setActiveTab("preview")}
                  >
                    <HugeiconsIcon icon={ArrowLeftIcon} className="size-3.5" />
                    Back to preview
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 h-8 text-xs"
                  onClick={handleCopyCode}
                >
                  <HugeiconsIcon 
                    icon={isCopied === "code" ? Tick02Icon : Copy01Icon} 
                    className={cn("size-3.5", isCopied === "code" && "text-green-500")}
                  />
                  {isCopied === "code" ? "Copied!" : "Copy code"}
                </Button>
              </div>
              <div className="flex-1 overflow-auto bg-[#0d1117]">
                <div className="max-w-4xl mx-auto p-6">
                  <pre className="text-sm font-mono text-white/90 whitespace-pre-wrap">
                    {design.content || "// No code available"}
                  </pre>
                </div>
              </div>
            </div>)
          )}
        </main>
      </div>
    </div>
    </ViewTransition>
  )
}

function SkillDetailLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )
}

function SkillDetailError() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
          <HugeiconsIcon icon={Cancel01Icon} className="size-8 text-destructive" />
        </div>
        <div>
          <p className="text-lg font-medium">Failed to load skill</p>
          <p className="text-sm text-muted-foreground">Please try again later</p>
        </div>
        <Link to="/">
          <Button variant="outline" className="mt-4">
            <HugeiconsIcon icon={ArrowLeftIcon} className="size-4 mr-2" />
            Back to home
          </Button>
        </Link>
      </div>
    </div>
  )
}

function SkillNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
          <HugeiconsIcon icon={File01Icon} className="size-8 text-muted-foreground" />
        </div>
        <div>
          <p className="text-lg font-medium">Skill not found</p>
          <p className="text-sm text-muted-foreground">The skill you're looking for doesn't exist</p>
        </div>
        <Link to="/">
          <Button variant="outline" className="mt-4">
            <HugeiconsIcon icon={ArrowLeftIcon} className="size-4 mr-2" />
            Back to home
          </Button>
        </Link>
      </div>
    </div>
  )
}