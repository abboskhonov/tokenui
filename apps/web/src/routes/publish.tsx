import { createFileRoute } from "@tanstack/react-router"
import { PublishPage } from "@/features/publish"

export const Route = createFileRoute("/publish")({
  head: () => ({
    meta: [
      {
        title: "Publish - tasteui",
      },
      {
        name: "robots",
        content: "noindex, nofollow",
      },
    ],
  }),
  component: PublishRoute,
})

function PublishRoute() {
  return <PublishPage />
}
