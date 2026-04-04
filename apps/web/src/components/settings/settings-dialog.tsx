"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useUserProfile, useUpdateProfile, useUploadImage } from "@/lib/queries/auth"
import { useTheme } from "@/components/theme-provider"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  UserIcon, 
  Moon02Icon, 
  Tick02Icon,
  ArrowUpRightIcon,
  GithubIcon,
  TwitterIcon,
  TelegramIcon,
  LinkIcon,
  Mail01Icon,
  ImageUploadIcon,
} from "@hugeicons/core-free-icons"
import type { ProfileUpdateData } from "@/lib/types/auth"
import { cn } from "@/lib/utils"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Tab = "profile" | "appearance"

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { data: user, isLoading } = useUserProfile()
  const updateProfile = useUpdateProfile()
  const uploadImage = useUploadImage()
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState<Tab>("profile")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  
  const [formData, setFormData] = useState<ProfileUpdateData>({})
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        username: user.username || "",
        bio: user.bio || "",
        website: user.website || "",
        github: user.github || "",
        x: user.x || "",
        telegram: user.telegram || "",
        image: user.image || "",
      })
    }
  }, [user])

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [])

  const triggerSave = useCallback((data: ProfileUpdateData) => {
    if (!user) return
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    
    saveTimeoutRef.current = setTimeout(() => {
      setIsSaving(true)
      updateProfile.mutate(data, {
        onSuccess: () => {
          setLastSaved(new Date())
          setIsSaving(false)
        },
        onError: () => setIsSaving(false),
      })
    }, 1000)
  }, [user, updateProfile])

  const handleChange = (field: keyof ProfileUpdateData, value: string) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    triggerSave(newData)
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a valid image file (JPEG, PNG, WebP, GIF, or AVIF)")
      return
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      alert("File too large. Maximum size is 5MB.")
      return
    }

    setIsUploadingAvatar(true)
    
    try {
      const result = await uploadImage.mutateAsync(file)
      
      // Update form data with new image URL
      const newData = { ...formData, image: result.url }
      setFormData(newData)
      
      // Save immediately (don't wait for debounce)
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      setIsSaving(true)
      updateProfile.mutate(newData, {
        onSuccess: () => {
          setLastSaved(new Date())
          setIsSaving(false)
        },
        onError: () => setIsSaving(false),
      })
    } catch (error) {
      console.error("Failed to upload avatar:", error)
      alert("Failed to upload avatar. Please try again.")
    } finally {
      setIsUploadingAvatar(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden bg-background">
          <div className="flex h-[600px]">
            <div className="w-[240px] bg-muted/30 border-r p-6">
              <div className="h-6 w-24 bg-muted rounded animate-pulse" />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const userName = formData.name || "User"
  const userHandle = formData.username || user?.username || user?.email?.split("@")[0] || "username"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden bg-background">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        
        <div className="flex h-[600px]">
          {/* Sidebar */}
          <div className="w-[240px] bg-muted/30 border-r flex flex-col">
            <div className="p-6">
              <h2 className="text-lg font-semibold">Settings</h2>
            </div>
            
            <nav className="flex-1 px-3">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">
                Account
              </div>
              
              <button
                onClick={() => setActiveTab("profile")}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  activeTab === "profile" 
                    ? "bg-accent text-accent-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <HugeiconsIcon icon={UserIcon} className="size-4" />
                Profile
              </button>
              
              <button
                onClick={() => setActiveTab("appearance")}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  activeTab === "appearance" 
                    ? "bg-accent text-accent-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <HugeiconsIcon icon={Moon02Icon} className="size-4" />
                Appearance
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full">
            {activeTab === "profile" ? (
              <div className="p-6 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold">Account</h3>
                  {isSaving ? (
                    <span className="text-xs text-muted-foreground">Saving...</span>
                  ) : lastSaved ? (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <HugeiconsIcon icon={Tick02Icon} className="size-3 text-green-500" />
                      Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  ) : null}
                </div>

                {/* Profile Card */}
                <div className="bg-muted/30 rounded-xl p-4 flex items-center gap-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                    className="hidden"
                  />
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={formData.image || ""} alt={userName} />
                    <AvatarFallback className="bg-primary/20 text-primary text-lg">
                      {userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{userName}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      @{userHandle}
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 shrink-0"
                    onClick={handleAvatarClick}
                    disabled={isUploadingAvatar}
                  >
                    {isUploadingAvatar ? (
                      <>
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <HugeiconsIcon icon={ImageUploadIcon} className="size-4" />
                        Change Avatar
                      </>
                    )}
                  </Button>
                </div>

                {/* Display Name */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-muted-foreground">
                    Display Name
                  </label>
                  <Input
                    value={formData.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Your name"
                  />
                </div>

                {/* Username */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-muted-foreground">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      @
                    </span>
                    <Input
                      value={formData.username || ""}
                      onChange={(e) => handleChange("username", e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                      placeholder="username"
                      className="pl-7"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your public URL: tokenui.dev/@{formData.username || "username"}
                  </p>
                </div>

                <Separator />

                {/* Bio */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-muted-foreground">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio || ""}
                    onChange={(e) => handleChange("bio", e.target.value.slice(0, 160))}
                    placeholder="Tell us about yourself"
                    className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {(formData.bio || "").length}/160
                  </div>
                </div>

                <Separator />

                {/* Website */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Website</h4>
                  <div className="relative">
                    <HugeiconsIcon icon={LinkIcon} className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="https://yourwebsite.com"
                      value={formData.website || ""}
                      onChange={(e) => handleChange("website", e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <Separator />

                {/* Social Links */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Social Links</h4>
                  
                  <div className="space-y-3">
                    <div className="relative">
                      <HugeiconsIcon icon={GithubIcon} className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="GitHub username"
                        value={formData.github || ""}
                        onChange={(e) => handleChange("github", e.target.value)}
                        className="pl-9"
                      />
                    </div>

                    <div className="relative">
                      <HugeiconsIcon icon={TwitterIcon} className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="X (Twitter) username"
                        value={formData.x || ""}
                        onChange={(e) => handleChange("x", e.target.value)}
                        className="pl-9"
                      />
                    </div>

                    <div className="relative">
                      <HugeiconsIcon icon={TelegramIcon} className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Telegram username"
                        value={formData.telegram || ""}
                        onChange={(e) => handleChange("telegram", e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Connected Accounts */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Connected accounts</h4>
                    <Button variant="ghost" size="sm" className="h-auto py-1 px-2 text-xs gap-1">
                      Manage
                      <HugeiconsIcon icon={ArrowUpRightIcon} className="size-3" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <HugeiconsIcon icon={Mail01Icon} className="size-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{user?.email}</div>
                          <div className="text-xs text-muted-foreground">Email</div>
                        </div>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">Primary</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <HugeiconsIcon icon={GithubIcon} className="size-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{formData.github || "GitHub"}</div>
                        <div className="text-xs text-muted-foreground">GitHub</div>
                      </div>
                      <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded">Connected</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8">
                {/* Theme Section */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-semibold mb-1">Theme</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose how tokenui looks for you.
                    </p>
                  </div>
                  
                  {/* Theme Preview Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Light Theme */}
                    <button
                      onClick={() => setTheme("light")}
                      className={cn(
                        "group relative rounded-xl overflow-hidden border-2 transition-all",
                        theme === "light"
                          ? "border-blue-500 ring-2 ring-blue-500/20"
                          : "border-border hover:border-muted-foreground/50"
                      )}
                    >
                      <div className="aspect-[4/3] bg-[#f5f5f5] p-3">
                        {/* Light theme preview */}
                        <div className="h-full bg-white rounded-lg shadow-sm p-2 space-y-2">
                          <div className="flex gap-2">
                            <div className="w-6 h-6 rounded bg-gray-200" />
                            <div className="flex-1 h-2 rounded bg-gray-100" />
                          </div>
                          <div className="flex gap-2">
                            <div className="w-16 h-2 rounded bg-gray-100" />
                            <div className="flex-1 h-2 rounded bg-gray-100" />
                          </div>
                          <div className="flex gap-2 pt-1">
                            <div className="w-20 h-20 rounded bg-gray-100" />
                            <div className="flex-1 space-y-1">
                              <div className="h-2 rounded bg-gray-100" />
                              <div className="h-2 rounded bg-gray-100 w-3/4" />
                              <div className="h-2 rounded bg-gray-100 w-1/2" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Dark Theme */}
                    <button
                      onClick={() => setTheme("dark")}
                      className={cn(
                        "group relative rounded-xl overflow-hidden border-2 transition-all",
                        theme === "dark"
                          ? "border-blue-500 ring-2 ring-blue-500/20"
                          : "border-border hover:border-muted-foreground/50"
                      )}
                    >
                      <div className="aspect-[4/3] bg-[#0a0a0a] p-3">
                        {/* Dark theme preview */}
                        <div className="h-full bg-[#141414] rounded-lg shadow-sm p-2 space-y-2 border border-[#222]">
                          <div className="flex gap-2">
                            <div className="w-6 h-6 rounded bg-[#222]" />
                            <div className="flex-1 h-2 rounded bg-[#1a1a1a]" />
                          </div>
                          <div className="flex gap-2">
                            <div className="w-16 h-2 rounded bg-[#1a1a1a]" />
                            <div className="flex-1 h-2 rounded bg-[#1a1a1a]" />
                          </div>
                          <div className="flex gap-2 pt-1">
                            <div className="w-20 h-20 rounded bg-[#1a1a1a]" />
                            <div className="flex-1 space-y-1">
                              <div className="h-2 rounded bg-[#1a1a1a]" />
                              <div className="h-2 rounded bg-[#1a1a1a] w-3/4" />
                              <div className="h-2 rounded bg-[#1a1a1a] w-1/2" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* System Theme */}
                    <button
                      onClick={() => setTheme("system")}
                      className={cn(
                        "group relative rounded-xl overflow-hidden border-2 transition-all",
                        theme === "system"
                          ? "border-blue-500 ring-2 ring-blue-500/20"
                          : "border-border hover:border-muted-foreground/50"
                      )}
                    >
                      <div className="aspect-[4/3] bg-[#f5f5f5] p-3">
                        {/* System theme preview - half light half dark */}
                        <div className="h-full rounded-lg shadow-sm overflow-hidden flex">
                          {/* Left half - light */}
                          <div className="flex-1 bg-white p-2 space-y-2">
                            <div className="flex gap-2">
                              <div className="w-6 h-6 rounded bg-gray-200" />
                              <div className="flex-1 h-2 rounded bg-gray-100" />
                            </div>
                            <div className="flex gap-2">
                              <div className="w-16 h-2 rounded bg-gray-100" />
                              <div className="flex-1 h-2 rounded bg-gray-100" />
                            </div>
                            <div className="flex gap-2 pt-1">
                              <div className="w-16 h-16 rounded bg-gray-100" />
                              <div className="flex-1 space-y-1">
                                <div className="h-2 rounded bg-gray-100" />
                                <div className="h-2 rounded bg-gray-100 w-3/4" />
                              </div>
                            </div>
                          </div>
                          {/* Right half - dark */}
                          <div className="flex-1 bg-[#141414] p-2 space-y-2 border-l border-[#222]">
                            <div className="flex gap-2">
                              <div className="w-6 h-6 rounded bg-[#222]" />
                              <div className="flex-1 h-2 rounded bg-[#1a1a1a]" />
                            </div>
                            <div className="flex gap-2">
                              <div className="w-16 h-2 rounded bg-[#1a1a1a]" />
                              <div className="flex-1 h-2 rounded bg-[#1a1a1a]" />
                            </div>
                            <div className="flex gap-2 pt-1">
                              <div className="w-16 h-16 rounded bg-[#1a1a1a]" />
                              <div className="flex-1 space-y-1">
                                <div className="h-2 rounded bg-[#1a1a1a]" />
                                <div className="h-2 rounded bg-[#1a1a1a] w-3/4" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Theme Labels */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className={cn("text-sm", theme === "light" ? "text-foreground font-medium" : "text-muted-foreground")}>
                      Light
                    </div>
                    <div className={cn("text-sm", theme === "dark" ? "text-foreground font-medium" : "text-muted-foreground")}>
                      Dark
                    </div>
                    <div className={cn("text-sm", theme === "system" ? "text-foreground font-medium" : "text-muted-foreground")}>
                      System
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
