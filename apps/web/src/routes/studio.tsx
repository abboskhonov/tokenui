import { createFileRoute } from "@tanstack/react-router"
import { StudioPage } from "@/features/studio"

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Studio - tokenui" },
      { name: "description", content: "Manage your design skills" },
    ],
  }),
  component: StudioPage,
})
