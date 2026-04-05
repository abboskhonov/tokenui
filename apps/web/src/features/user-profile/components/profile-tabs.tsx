import { cn } from "@/lib/utils"

type TabType = "components" | "bookmarks"

interface ProfileTabsProps {
  activeTab: TabType
  componentsCount: number
  bookmarksCount: number
  onTabChange: (tab: TabType) => void
}

export function ProfileTabs({ 
  activeTab, 
  componentsCount, 
  bookmarksCount,
  onTabChange 
}: ProfileTabsProps) {
  return (
    <div className="flex items-center gap-6 border-b border-border">
      <TabButton
        active={activeTab === "components"}
        label="Components"
        count={componentsCount}
        onClick={() => onTabChange("components")}
      />
      <TabButton
        active={activeTab === "bookmarks"}
        label="Bookmarks"
        count={bookmarksCount}
        onClick={() => onTabChange("bookmarks")}
      />
    </div>
  )
}

interface TabButtonProps {
  active: boolean
  label: string
  count: number
  onClick: () => void
}

function TabButton({ active, label, count, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 pb-3 text-sm transition-colors border-b-2",
        active
          ? "border-foreground text-foreground font-medium"
          : "border-transparent text-muted-foreground hover:text-foreground"
      )}
    >
      <span>{label}</span>
      <span className="text-xs text-muted-foreground">({count})</span>
    </button>
  )
}
