"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface FAQItemProps {
  question: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function FAQItem({ question, children, defaultOpen = false }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <h3 className="font-medium pr-4">{question}</h3>
        <span className={cn(
          "text-muted-foreground transition-transform",
          isOpen && "rotate-180"
        )}>
          ↓
        </span>
      </button>
      <div className={cn(
        "overflow-hidden transition-all",
        isOpen ? "max-h-[500px] pb-4" : "max-h-0"
      )}>
        <div className="text-muted-foreground leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
}

function CodeBlock({ command }: { command: string }) {
  return (
    <div className="my-3 rounded-lg bg-muted p-3">
      <code className="text-sm font-mono">{command}</code>
    </div>
  )
}

export function DocsFAQPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">FAQ</h1>
        <p className="text-lg text-muted-foreground">
          Frequently asked questions about TokenUI. Can't find what you're looking for? 
          Reach out to us on Discord or GitHub.
        </p>
      </div>

      {/* General */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold mb-6">General</h2>
        
        <FAQItem question="What is TokenUI?" defaultOpen={true}>
          <p>
            TokenUI is a platform for discovering and sharing UI components and design patterns. 
            It provides a curated collection of "skills" — reusable code snippets, components, 
            and design tokens that help developers and AI agents build consistent interfaces.
          </p>
        </FAQItem>

        <FAQItem question="Who is TokenUI for?">
          <p>
            TokenUI is designed for both developers and AI agents. Whether you're building 
            a prototype, a production app, or using an AI coding assistant, TokenUI provides 
            ready-to-use components that follow best practices.
          </p>
        </FAQItem>

        <FAQItem question="Is TokenUI free to use?">
          <p>
            Yes, all skills on TokenUI are free to use. The platform is open-source and 
            community-driven. Some skills may have specific licenses (MIT, Apache 2.0, etc.) 
            which are displayed on their detail pages.
          </p>
        </FAQItem>
      </section>

      {/* Getting Started */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold mb-6">Getting Started</h2>
        
        <FAQItem question="Do I need to install anything?">
          <p>
            No installation required for basic usage. You can use npx to run the CLI directly:
          </p>
          <CodeBlock command="npx tokenui add <skill-name>" />
          <p>
            If you prefer, you can install the CLI globally with npm install -g tokenui.
          </p>
        </FAQItem>

        <FAQItem question="What frameworks are supported?">
          <p>
            TokenUI is built primarily for React applications using TypeScript and Tailwind CSS. 
            Many skills will work with other setups, but the best experience is with:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>React 18+ with TypeScript</li>
            <li>Tailwind CSS for styling</li>
            <li>Any build tool (Vite, Next.js, Remix, etc.)</li>
          </ul>
        </FAQItem>

        <FAQItem question="How do I add my first skill?">
          <p>
            Browse the gallery, find a skill you like, and run:
          </p>
          <CodeBlock command="npx tokenui add <skill-name>" />
          <p>
            The CLI will install the skill and all its dependencies to your project.
          </p>
        </FAQItem>
      </section>

      {/* Skills & Components */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold mb-6">Skills & Components</h2>
        
        <FAQItem question="What is a skill?">
          <p>
            A skill is a self-contained package that can include:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>React components with TypeScript</li>
            <li>Styling (Tailwind classes or CSS)</li>
            <li>Design tokens (colors, spacing, typography)</li>
            <li>Documentation and usage examples</li>
            <li>Required dependencies</li>
          </ul>
        </FAQItem>

        <FAQItem question="Can I customize the components?">
          <p>
            Absolutely! Once installed, skills are just code in your project. You can modify 
            them however you like. Most components use Tailwind classes for styling, making 
            customization straightforward.
          </p>
        </FAQItem>

        <FAQItem question="Do skills work with my existing design system?">
          <p>
            Yes. Skills can be adapted to match your design system. You can either:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Customize the installed components directly</li>
            <li>Use CSS variables to override default styles</li>
            <li>Create wrapper components that match your system</li>
          </ul>
        </FAQItem>

        <FAQItem question="How do I update a skill?">
          <p>
            Use the update command to get the latest version:
          </p>
          <CodeBlock command="npx tokenui update <skill-name>" />
          <p>
            Or update all skills at once:
          </p>
          <CodeBlock command="npx tokenui update --all" />
        </FAQItem>
      </section>

      {/* Publishing */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold mb-6">Publishing</h2>
        
        <FAQItem question="How do I publish a skill?">
          <p>
            Click the "Publish" button in the navigation, or run:
          </p>
          <CodeBlock command="npx tokenui publish" />
          <p>
            Fill out the form with your skill details, upload a preview screenshot, 
            and submit. All submissions are reviewed before appearing in the gallery.
          </p>
        </FAQItem>

        <FAQItem question="What makes a good skill?">
          <p>
            A great skill is:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Focused</strong> — Does one thing well</li>
            <li><strong>Documented</strong> — Clear usage instructions</li>
            <li><strong>Accessible</strong> — Works with keyboard and screen readers</li>
            <li><strong>Flexible</strong> — Easy to customize via props</li>
            <li><strong>Tested</strong> — Works in common scenarios</li>
          </ul>
        </FAQItem>

        <FAQItem question="Can I publish work-in-progress skills?">
          <p>
            Yes, you can save skills as drafts. They won't appear in the public gallery 
            until you explicitly publish them. This is useful for iterating on your designs 
            before sharing.
          </p>
        </FAQItem>

        <FAQItem question="Who owns the skills I publish?">
          <p>
            You retain ownership of your work. By publishing, you grant TokenUI users a 
            license to use your skill according to the license you specify (MIT recommended). 
            You can remove your skills from the gallery at any time.
          </p>
        </FAQItem>
      </section>

      {/* AI & Agents */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold mb-6">AI & Agents</h2>
        
        <FAQItem question="Can AI agents use TokenUI?">
          <p>
            Yes! TokenUI is designed with AI agents in mind. The CLI provides structured 
            output that agents can parse, and the skill format is designed to be machine-readable 
            with clear dependencies and usage patterns.
          </p>
        </FAQItem>

        <FAQItem question="How do I use TokenUI with AI coding assistants?">
          <p>
            When working with AI agents, you can reference TokenUI skills in your prompts:
          </p>
          <div className="my-3 rounded-lg bg-muted/50 p-3 border-l-2 border-border">
            <p className="text-sm italic">
              "Create a login form using the tokenui form and button skills"
            </p>
          </div>
          <p>
            The agent can then use the CLI to install the appropriate skills.
          </p>
        </FAQItem>

        <FAQItem question="Does TokenUI work with specific AI tools?">
          <p>
            TokenUI is platform-agnostic. It works with any AI coding assistant that can:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Run terminal commands (Claude, GPT-4, Copilot, etc.)</li>
            <li>Read and write files</li>
            <li>Understand component-based architectures</li>
          </ul>
        </FAQItem>
      </section>

      {/* Troubleshooting */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold mb-6">Troubleshooting</h2>
        
        <FAQItem question="The CLI command isn't working">
          <p>
            First, ensure you have Node.js 18+ installed:
          </p>
          <CodeBlock command="node --version" />
          <p>
            If npx isn't working, try installing the CLI globally:
          </p>
          <CodeBlock command="npm install -g tokenui" />
          <p>
            Then use tokenui directly without npx.
          </p>
        </FAQItem>

        <FAQItem question="A skill won't install">
          <p>
            Common issues and solutions:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Check your internet connection</li>
            <li>Verify the skill name is correct</li>
            <li>Use --verbose flag to see detailed error messages</li>
            <li>Try with --force to overwrite existing files</li>
          </ul>
        </FAQItem>

        <FAQItem question="Styles aren't applying correctly">
          <p>
            Ensure Tailwind CSS is properly configured in your project. Skills assume 
            standard Tailwind utility classes are available. Check that your tailwind.config.js 
            includes the paths to your component files.
          </p>
        </FAQItem>

        <FAQItem question="How do I report a bug?">
          <p>
            For CLI bugs, open an issue on the TokenUI GitHub repository with:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Your Node.js version</li>
            <li>The exact command you ran</li>
            <li>The error message (use --verbose)</li>
            <li>Your operating system</li>
          </ul>
          <p className="mt-2">
            For skill-specific bugs, leave a comment on the skill's detail page.
          </p>
        </FAQItem>
      </section>

      {/* Still have questions */}
      <section className="rounded-lg bg-muted p-6">
        <h3 className="font-semibold mb-2">Still have questions?</h3>
        <p className="text-muted-foreground mb-4">
          Join our community or reach out directly.
        </p>
        <div className="flex flex-col gap-2">
          <a 
            href="https://discord.gg/tokenui" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-foreground hover:underline"
          >
            Join our Discord →
          </a>
          <a 
            href="https://github.com/tokenui/tokenui/issues" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-foreground hover:underline"
          >
            GitHub Issues →
          </a>
          <a 
            href="mailto:support@tokenui.dev" 
            className="text-sm text-foreground hover:underline"
          >
            Email support →
          </a>
        </div>
      </section>
    </div>
  )
}
