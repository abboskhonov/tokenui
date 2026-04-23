import { createFileRoute } from "@tanstack/react-router"
import { DocsFaqPage } from "@/features/docs/pages/faq"

export const Route = createFileRoute("/docs/faq")({
  head: () => ({
    meta: [
      { title: "FAQ - TasteUI Docs" },
      {
        name: "description",
        content:
          "Frequently asked questions about TasteUI design skills, installation, publishing, and technical details.",
      },
      {
        name: "og:title",
        content: "FAQ - TasteUI Docs",
      },
      {
        name: "og:description",
        content:
          "Frequently asked questions about TasteUI design skills, installation, publishing, and technical details.",
      },
      { name: "og:url", content: "https://tasteui.dev/docs/faq" },
      { name: "og:type", content: "article" },
      {
        name: "twitter:title",
        content: "FAQ - TasteUI Docs",
      },
      {
        name: "twitter:description",
        content:
          "Frequently asked questions about TasteUI design skills, installation, publishing, and technical details.",
      },
    ],
    links: [{ rel: "canonical", href: "https://tasteui.dev/docs/faq" }],
  }),
  component: DocsFaqPage,
})
