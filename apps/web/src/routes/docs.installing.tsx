import { createFileRoute } from "@tanstack/react-router"
import { DocsInstallingPage } from "@/features/docs/pages"

export const Route = createFileRoute("/docs/installing")({
  head: () => ({
    meta: [
      { title: "Installing Skills - TasteUI Docs" },
      {
        name: "description",
        content:
          "Learn how to install design system skills to your project with the TasteUI CLI. Use npx to add skills instantly.",
      },
      {
        name: "og:title",
        content: "Installing Skills - TasteUI Docs",
      },
      {
        name: "og:description",
        content:
          "Learn how to install design system skills to your project with the TasteUI CLI. Use npx to add skills instantly.",
      },
      { name: "og:url", content: "https://tasteui.dev/docs/installing" },
      { name: "og:type", content: "article" },
      {
        name: "twitter:title",
        content: "Installing Skills - TasteUI Docs",
      },
      {
        name: "twitter:description",
        content:
          "Learn how to install design system skills to your project with the TasteUI CLI. Use npx to add skills instantly.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://tasteui.dev/docs/installing" },
    ],
  }),
  component: DocsInstallingPage,
})
