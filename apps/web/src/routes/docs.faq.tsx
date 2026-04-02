import { createFileRoute } from "@tanstack/react-router"
import { DocsFAQPage } from "@/features/docs/faq"

export const Route = createFileRoute("/docs/faq")({
  component: DocsFAQPage,
})
