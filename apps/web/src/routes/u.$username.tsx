import { createFileRoute } from "@tanstack/react-router"
import { useUserProfile } from "@/lib/queries/users"
import { useState } from "react"
import { useProfileSearch } from "@/features/user-profile/hooks"
import {
  ProfileHeader,
  ProfileInfo,
  ProfileTabs,
  SearchInput,
  DesignsGrid,
  ProfileLoading,
  ProfileError,
  ProfileNotFound,
} from "@/features/user-profile/components"

export const Route = createFileRoute("/u/$username")({
  component: UserProfilePage,
  head: ({ params }) => ({
    meta: [
      {
        title: `${params.username} - tokenui`,
      },
    ],
  }),
  errorComponent: () => <ProfileError />,
  notFoundComponent: () => <ProfileNotFound />,
})

type TabType = "components" | "bookmarks"

function UserProfilePage() {
  const { username } = Route.useParams()
  const { data: profileData, isLoading, error } = useUserProfile(username)
  const [activeTab, setActiveTab] = useState<TabType>("components")
  const { searchQuery, setSearchQuery, filteredDesigns } = useProfileSearch(
    profileData?.designs || []
  )

  if (isLoading) {
    return <ProfileLoading />
  }

  if (error || !profileData) {
    return <ProfileError />
  }

  const { user, stats } = profileData

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ProfileHeader username={username} />

      <main className="mx-auto max-w-6xl px-6 py-4">
        <ProfileInfo user={user} username={username} stats={stats} />

        {/* Tabs & Search */}
        <div className="flex items-center justify-between mb-6">
          <ProfileTabs
            activeTab={activeTab}
            componentsCount={stats.components}
            bookmarksCount={0}
            onTabChange={setActiveTab}
          />
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search components..."
          />
        </div>

        {/* Content */}
        {activeTab === "components" ? (
          <DesignsGrid designs={filteredDesigns} username={username} />
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">No bookmarks yet</p>
          </div>
        )}
      </main>
    </div>
  )
}
