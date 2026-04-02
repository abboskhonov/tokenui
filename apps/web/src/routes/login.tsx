import { createFileRoute } from "@tanstack/react-router"
import { LoginPage } from "@/components/auth/login-page"

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      {
        title: "Login - tokenui",
      },
    ],
  }),
  component: LoginRoute,
})

function LoginRoute() {
  return <LoginPage />
}
