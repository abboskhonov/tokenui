import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "../db"

// Lazy getter for env vars to ensure they're read fresh
function getApiBaseUrl(): string {
  const url = process.env.API_BASE_URL
  console.log("[Auth Config] Reading API_BASE_URL:", url)
  return url || "http://localhost:3001"
}

function getFrontendUrl(): string {
  const url = process.env.FRONTEND_URL
  console.log("[Auth Config] Reading FRONTEND_URL:", url)
  return url || "http://localhost:3000"
}

const isProduction = process.env.NODE_ENV === "production"

// Parse trusted origins from environment or use defaults
const trustedOriginsEnv = process.env.TRUSTED_ORIGINS
const trustedOrigins = trustedOriginsEnv
  ? trustedOriginsEnv.split(",").map((origin) => origin.trim())
  : [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
    ]

// Add production domains if in production
const frontendUrl = getFrontendUrl()
if (isProduction && frontendUrl) {
  if (!trustedOrigins.includes(frontendUrl)) {
    trustedOrigins.push(frontendUrl)
  }
}

const apiBaseUrl = getApiBaseUrl()

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // PostgreSQL
  }),
  baseURL: apiBaseUrl,
  basePath: "/api/auth",
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      redirectURI: `${apiBaseUrl}/api/auth/callback/github`,
      getUserInfo: async (tokens) => {
        // Fetch basic user profile
        const userResponse = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        })

        if (!userResponse.ok) {
          throw new Error(`GitHub API error: ${userResponse.status}`)
        }

        const user: any = await userResponse.json()

        // Try to get email from public profile first
        let email = user.email

        // If no public email, fetch from emails endpoint
        if (!email && tokens.accessToken) {
          try {
            const emailsResponse = await fetch("https://api.github.com/user/emails", {
              headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
                Accept: "application/vnd.github.v3+json",
              },
            })

            if (emailsResponse.ok) {
              const emailsData = await emailsResponse.json()

              if (Array.isArray(emailsData) && emailsData.length > 0) {
                // Find primary email, or first verified, or just first
                const primary = emailsData.find((e: any) => e.primary && e.verified)
                const verified = emailsData.find((e: any) => e.verified)
                email = primary?.email || verified?.email || emailsData[0]?.email
              }
            }
          } catch (err) {
            console.warn("Failed to fetch GitHub emails:", err)
          }
        }

        // If still no email, throw error with helpful message
        if (!email) {
          throw new Error(
            "GitHub did not return an email. " +
            "Please either: 1) Make your email public on GitHub, or " +
            "2) If using GitHub App, enable 'Email addresses' permission to 'Read-only' in your app settings"
          )
        }

        return {
          user: {
            id: user.id.toString(),
            email,
            name: user.name || user.login,
            image: user.avatar_url,
            emailVerified: true,
          },
          data: user,
        }
      },
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirectURI: `${apiBaseUrl}/api/auth/callback/google`,
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  trustedOrigins,
  advanced: {
    // Cookie settings for OAuth - Lax allows cookies on same-site navigation
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: isProduction,
      path: "/",
    },
    crossSubDomainCookies: {
      enabled: true,
    },
  },
})

// Helper to handle OAuth callback redirects
export async function handleAuthRedirect(request: Request): Promise<Response> {
  const url = new URL(request.url)

  // Check if this is a callback request
  if (url.pathname.includes("/callback/")) {
    // Process the callback
    const response = await auth.handler(request)
    
    console.log("[handleAuthRedirect] Response status:", response.status)
    console.log("[handleAuthRedirect] Set-Cookie header:", response.headers.get("set-cookie"))

    // If successful (not an error), redirect to frontend
    if (response.status === 200 || response.status === 302) {
      const redirectUrl = getFrontendUrl()
      console.log("[handleAuthRedirect] Redirecting to:", redirectUrl)
      
      // Copy all headers from original response to preserve cookies
      const headers = new Headers(response.headers)
      headers.set("Location", redirectUrl)
      
      // Redirect to frontend WITH cookies
      return new Response(null, {
        status: 302,
        headers: headers,
      })
    }

    return response
  }

  return auth.handler(request)
}
