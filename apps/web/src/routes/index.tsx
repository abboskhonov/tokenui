import { createFileRoute } from "@tanstack/react-router"
import { MarketingPage } from "@/features/marketing"

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "tokenui - Design layer for AI agents",
      },
      {
        name: "description",
        content:
          "tokenui is a design layer for AI agents, with reusable landing page skills, token-driven UI, and dev-focused workflow building blocks.",
      },
    ],
  }),
  component: App,
})

function App() {
  return <MarketingPage />
}
