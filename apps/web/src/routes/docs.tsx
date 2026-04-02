import { createFileRoute } from "@tanstack/react-router"
import { DocsOverviewPage } from "@/features/docs/overview"

export const Route = createFileRoute("/docs")({
  component: DocsOverviewPage,
})
