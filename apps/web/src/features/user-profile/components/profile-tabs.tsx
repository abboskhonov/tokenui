import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CubeIcon,
  Bookmark02Icon,
  StarIcon,
} from "@hugeicons/core-free-icons"

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
    <div className="flex items-center gap-1">
      <TabButton
        active={activeTab === "skills"}
        label="Skills"
        count={skillsCount}
        icon={CubeIcon}
        onClick={() => onTabChange("skills")}
      />
      <TabButton
        active={activeTab === "bookmarks"}
        label="Bookmarks"
        count={bookmarksCount}
        icon={Bookmark02Icon}
        onClick={() => onTabChange("bookmarks")}
      />
      <TabButton
        active={activeTab === "stars"}
        label="Stars"
        count={starsCount}
        icon={StarIcon}
        onClick={() => onTabChange("stars")}
      />
    </div>
  )
}

interface TabButtonProps {
  active: boolean
  label: string
  count: number
  icon: typeof Cube01Icon
  onClick: () => void
}

function TabButton({ active, label, count, icon, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 text-sm transition-all rounded-md",
        active
          ? "bg-muted text-foreground font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      )}
    >
      <HugeiconsIcon icon={icon} className="size-4" />
      <span>{label}</span>
      <span
        className={cn(
          "min-w-[18px] px-1.5 py-0.5 rounded-full text-xs font-medium",
          active
            ? "bg-background text-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {count}
      </span>
    </button>
  )
}
