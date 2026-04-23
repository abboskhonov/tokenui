import { createFileRoute } from "@tanstack/react-router"
import { DocsPublishingPage } from "@/features/docs/pages"

export const Route = createFileRoute("/docs/publishing")({
  head: () => ({
    meta: [
      { title: "Publishing Skills - TasteUI Docs" },
      {
        name: "description",
        content:
          "Share your design system inspirations with the community. Learn the skill format and submission process for TasteUI.",
      },
      {
        name: "og:title",
        content: "Publishing Skills - TasteUI Docs",
      },
      {
        name: "og:description",
        content:
          "Share your design system inspirations with the community. Learn the skill format and submission process for TasteUI.",
      },
      { name: "og:url", content: "https://tasteui.dev/docs/publishing" },
      { name: "og:type", content: "article" },
      {
        name: "twitter:title",
        content: "Publishing Skills - TasteUI Docs",
      },
      {
        name: "twitter:description",
        content:
          "Share your design system inspirations with the community. Learn the skill format and submission process for TasteUI.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://tasteui.dev/docs/publishing" },
    ],
  }),
  component: DocsPublishingPage,
})
