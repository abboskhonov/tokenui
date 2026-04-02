import { createFileRoute } from "@tanstack/react-router"
import { PublishPage } from "@/features/publish"

export const Route = createFileRoute("/publish")({
  head: () => ({
    meta: [
      {
        title: "Publish - tokenui",
      },
    ],
  }),
  component: PublishRoute,
})

function PublishRoute() {
  return <PublishPage />
}
