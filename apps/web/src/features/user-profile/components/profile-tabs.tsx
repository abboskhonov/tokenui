import { cn } from "@/lib/utils"

export type TabType = "skills" | "bookmarks" | "stars"

interface ProfileTabsProps {
  activeTab: TabType
  skillsCount: number
  bookmarksCount: number
  starsCount: number
  onTabChange: (tab: TabType) => void
}

export function ProfileTabs({ 
  activeTab, 
  skillsCount, 
  bookmarksCount,
  starsCount,
  onTabChange 
}: ProfileTabsProps) {
  return (
    <div className="flex items-center gap-6 border-b border-border">
      <TabButton
        active={activeTab === "skills"}
        label="Skills"
        count={skillsCount}
        onClick={() => onTabChange("skills")}
      />
      <TabButton
        active={activeTab === "bookmarks"}
        label="Bookmarks"
        count={bookmarksCount}
        onClick={() => onTabChange("bookmarks")}
      />
      <TabButton
        active={activeTab === "stars"}
        label="Stars"
        count={starsCount}
        onClick={() => onTabChange("stars")}
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
