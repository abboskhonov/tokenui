"use client"

import { Header } from "@/features/marketing/sections/header"
import { DocsSidebar } from "./sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  Download04Icon, 
  CodeIcon, 
  Share01Icon,
  ColorsIcon,
  Layers01Icon,
  ZapIcon
} from "@hugeicons/core-free-icons"

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode
  title: string
  description: string 
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
        {icon}
      </div>
      <h3 className="mb-2 font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function CodeBlock({ 
  command, 
  description 
}: { 
  command: string
  description?: string 
}) {
  return (
    <div className="my-4">
      {description && (
        <p className="mb-2 text-sm text-muted-foreground">{description}</p>
      )}
      <div className="rounded-lg bg-muted p-4">
        <code className="text-sm font-mono">{command}</code>
      </div>
    </div>
  )
}

export function DocsOverviewPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex gap-12">
          <DocsSidebar />
          
          <main className="flex-1 min-w-0 max-w-3xl">
            <div className="space-y-12">
              {/* Hero */}
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">Documentation</h1>
                <p className="text-lg text-muted-foreground">
                  Learn how to discover, install, and use design skills with your AI agents. 
                  TokenUI provides a curated collection of UI components and patterns.
                </p>
              </div>

                {/* Quick Start */}
                <section className="space-y-6">
                  <h2 className="text-2xl font-semibold tracking-tight">Quick Start</h2>
                  <p className="text-muted-foreground">
                    Get started in seconds. No installation required—just use npx to run the CLI directly.
                  </p>
                  
                  <CodeBlock 
                    command="npx tokenui add <skill-name>"
                    description="Add any skill to your project instantly"
                  />
                  
                  <p className="text-muted-foreground">
                    Browse all available skills on the homepage, or search for specific components 
                    like "button", "card", "modal", or "form".
                  </p>
                </section>

                {/* What are Skills? */}
                <section className="space-y-6">
                  <h2 className="text-2xl font-semibold tracking-tight">What are Skills?</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Skills are self-contained UI components, design patterns, and coding conventions 
                    that help you build consistent interfaces. Each skill includes:
                  </p>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FeatureCard
                      icon={<HugeiconsIcon icon={Layers01Icon} className="size-5" />}
                      title="UI Components"
                      description="Ready-to-use React components with styling, animations, and accessibility built-in."
                    />
                    <FeatureCard
                      icon={<HugeiconsIcon icon={ColorsIcon} className="size-5" />}
                      title="Design Tokens"
                      description="Colors, typography, and spacing scales that ensure visual consistency."
                    />
                    <FeatureCard
                      icon={<HugeiconsIcon icon={CodeIcon} className="size-5" />}
                      title="Code Patterns"
                      description="Best practices and conventions for writing maintainable React code."
                    />
                    <FeatureCard
                      icon={<HugeiconsIcon icon={ZapIcon} className="size-5" />}
                      title="AI-Optimized"
                      description="Structured for AI agents to understand and implement correctly."
                    />
                  </div>
                </section>

                {/* How it Works */}
                <section className="space-y-6">
                  <h2 className="text-2xl font-semibold tracking-tight">How It Works</h2>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background text-sm font-medium">
                        1
                      </div>
                      <div>
                        <h3 className="font-medium">Browse the Gallery</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Explore skills by category or search for specific components. 
                          Preview live examples before installing.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background text-sm font-medium">
                        2
                      </div>
                      <div>
                        <h3 className="font-medium">Install with CLI</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Use the CLI to add skills to your project. The CLI handles dependencies, 
                          file structure, and configuration automatically.
                        </p>
                        <CodeBlock command="npx tokenui add button" />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background text-sm font-medium">
                        3
                      </div>
                      <div>
                        <h3 className="font-medium">Use in Your Project</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Import and use components like any other React component. 
                          Customize styling using Tailwind classes or CSS variables.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Publishing */}
                <section className="space-y-6">
                  <h2 className="text-2xl font-semibold tracking-tight">Publishing Designs</h2>
                  <p className="text-muted-foreground">
                    Have a design system or component you want to share? Publish it to the TokenUI gallery 
                    so others can discover and use it.
                  </p>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FeatureCard
                      icon={<HugeiconsIcon icon={Share01Icon} className="size-5" />}
                      title="Share Your Work"
                      description="Upload screenshots, code, and documentation for your design."
                    />
                    <FeatureCard
                      icon={<HugeiconsIcon icon={Download04Icon} className="size-5" />}
                      title="Track Downloads"
                      description="See how many developers are using your skills."
                    />
                  </div>

                  <p className="text-muted-foreground">
                    Click the <strong>Publish</strong> button in the navigation to submit your design. 
                    Fill out the form with your design details, upload a preview screenshot, and submit. 
                    All submissions are reviewed before appearing in the gallery.
                  </p>
                </section>

                {/* Next Steps */}
                <section className="space-y-4">
                  <h2 className="text-2xl font-semibold tracking-tight">Next Steps</h2>
                  <div className="flex flex-col gap-2">
                    <a 
                      href="/docs/cli" 
                      className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span className="font-medium">CLI Reference</span>
                      <span>→</span>
                      <span className="text-sm">Complete command documentation</span>
                    </a>
                    <a 
                      href="/docs/faq" 
                      className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span className="font-medium">FAQ</span>
                      <span>→</span>
                      <span className="text-sm">Common questions and answers</span>
                    </a>
                  </div>
                </section>
              </div>
            </main>
          </div>
        </div>
      </div>
  );
}
