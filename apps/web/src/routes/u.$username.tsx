import { createFileRoute } from "@tanstack/react-router"
import { useUserProfile } from "@/lib/queries/users"
import { useBookmarks, useStars } from "@/lib/queries/designs"
import { useState } from "react"
import { useProfileSearch } from "@/features/user-profile/hooks"
import type { TabType } from "@/features/user-profile/components"
import {
  ProfileHeader,
  ProfileInfo,
  ProfileTabs,
  SearchInput,
  DesignsGrid,
  BookmarkCard,
  StarCard,
  ProfileSkeleton,
  ProfileError,
  ProfileNotFound,
} from "@/features/user-profile/components"

export const Route = createFileRoute("/u/$username")({
  component: UserProfilePage,
  head: ({ params }) => ({
    meta: [
      {
        title: `${params.username} - tasteui`,
      },
    ],
  }),
  // No blocking loader - navigate immediately and show skeleton
  errorComponent: () => <ProfileError />,
  notFoundComponent: () => <ProfileNotFound />,
})

function UserProfilePage() {
  const { username } = Route.useParams()
  const { data: profileData, isLoading, error } = useUserProfile(username)
  const { data: bookmarks = [] } = useBookmarks()
  const { data: stars = [] } = useStars()
  const [activeTab, setActiveTab] = useState<TabType>("skills")
  
  // Search only applies to skills tab
  const { searchQuery, setSearchQuery, filteredDesigns } = useProfileSearch(
    profileData?.designs || []
  )

  // Show skeleton while loading - data is prefetched so this is brief
  if (isLoading && !profileData) {
    return <ProfileSkeleton username={username} />
  }

  if (error || !profileData) {
    return <ProfileError />
  }

  const { user, stats } = profileData

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProfileHeader username={username} />

      <main className="mx-auto max-w-[1600px] px-6 md:px-12 lg:px-16 xl:px-20 py-4">
        <ProfileInfo user={user} username={username} stats={stats} />

        {/* Tabs & Search */}
        <div className="flex items-center justify-between mb-6">
          <ProfileTabs
            activeTab={activeTab}
            skillsCount={stats.components}
            bookmarksCount={bookmarks.length}
            starsCount={stars.length}
            onTabChange={setActiveTab}
          />
          {activeTab === "skills" && (
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search skills..."
            />
          )}
        </div>

        {/* Content */}
        {activeTab === "skills" && (
          <DesignsGrid designs={filteredDesigns} username={username} />
        )}
        
        {activeTab === "bookmarks" && (
          <BookmarksGrid bookmarks={bookmarks} />
        )}
        
        {activeTab === "stars" && (
          <StarsGrid stars={stars} />
        )}
      </main>
    </div>
  )
}

import type { Bookmark, Star } from "@/lib/types/design"

function BookmarksGrid({ bookmarks }: { bookmarks: Bookmark[] }) {
  if (bookmarks.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-muted-foreground">No bookmarks yet</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-12">
      {bookmarks.map((bookmark) => (
        <BookmarkCard key={bookmark.id} bookmark={bookmark} />
      ))}
    </div>
  )
}

function StarsGrid({ stars }: { stars: Star[] }) {
  if (stars.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-muted-foreground">No starred designs yet</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-12">
      {stars.map((star) => (
        <StarCard key={star.id} star={star} />
      ))}
    </div>
  )
}
