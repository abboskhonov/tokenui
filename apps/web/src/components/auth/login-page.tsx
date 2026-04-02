"use client"

import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HugeiconsIcon } from "@hugeicons/react"
import { GithubIcon, GoogleIcon } from "@hugeicons/core-free-icons"
import { useLogin, useSignInWithGitHub, useSignInWithGoogle } from "@/lib/queries/auth"

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  const login = useLogin()
  const signInWithGitHub = useSignInWithGitHub()
  const signInWithGoogle = useSignInWithGoogle()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login.mutateAsync({ email, password })
      navigate({ to: "/" })
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleGitHubSignIn = async () => {
    await signInWithGitHub.mutateAsync()
  }

  const handleGoogleSignIn = async () => {
    await signInWithGoogle.mutateAsync()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        {/* Social Login */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full h-10 gap-2"
            onClick={handleGitHubSignIn}
            disabled={signInWithGitHub.isPending}
          >
            <HugeiconsIcon icon={GithubIcon} className="size-4" />
            Continue with GitHub
          </Button>
          
          <Button
            variant="outline"
            className="w-full h-10 gap-2"
            onClick={handleGoogleSignIn}
            disabled={signInWithGoogle.isPending}
          >
            <HugeiconsIcon icon={GoogleIcon} className="size-4" />
            Continue with Google
          </Button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-10"
            />
          </div>
          
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-10"
            />
          </div>

          {login.error && (
            <p className="text-sm text-destructive">
              {login.error instanceof Error ? login.error.message : "Login failed"}
            </p>
          )}

          <Button
            type="submit"
            className="w-full h-10"
            disabled={login.isPending}
          >
            {login.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a href="/signup" className="text-foreground hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
