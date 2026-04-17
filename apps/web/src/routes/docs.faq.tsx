import { createFileRoute } from "@tanstack/react-router"
import { DocsFaqPage } from "@/features/docs/pages/faq"

export const Route = createFileRoute("/docs/faq")({
  component: DocsFaqPage,
})
