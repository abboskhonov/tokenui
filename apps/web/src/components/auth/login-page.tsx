"use client"

import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import { GithubIcon, GoogleIcon, CommandLineIcon } from "@hugeicons/core-free-icons"
import { useSignInWithGitHub, useSignInWithGoogle } from "@/lib/queries/auth"

export function LoginPage() {
  const signInWithGitHub = useSignInWithGitHub()
  const signInWithGoogle = useSignInWithGoogle()

  const handleGitHubSignIn = async () => {
    await signInWithGitHub.mutateAsync()
  }

  const handleGoogleSignIn = async () => {
    await signInWithGoogle.mutateAsync()
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 bg-[radial-gradient(circle_at_center,var(--brand)/6%,transparent_70%)]" style={{ willChange: "transform" }} />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-foreground text-background">
              <HugeiconsIcon icon={CommandLineIcon} className="size-4" />
            </div>
            <span className="text-base font-semibold text-foreground tracking-tight">
              tokenui
            </span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 pt-16">
        <Card className="w-full max-w-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl font-semibold tracking-tight">Welcome back</CardTitle>
            <CardDescription>
              Sign in to continue to tokenui
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={handleGitHubSignIn}
              disabled={signInWithGitHub.isPending}
            >
              <HugeiconsIcon icon={GithubIcon} className="size-4" />
              Continue with GitHub
            </Button>

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={handleGoogleSignIn}
              disabled={signInWithGoogle.isPending}
            >
              <HugeiconsIcon icon={GoogleIcon} className="size-4" />
              Continue with Google
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
