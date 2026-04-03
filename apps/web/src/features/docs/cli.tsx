"use client"

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
      <div className="rounded-lg bg-muted p-4 overflow-x-auto">
        <code className="text-sm font-mono">{command}</code>
      </div>
    </div>
  )
}

function CommandSection({
  title,
  description,
  command,
  example,
  options
}: {
  title: string
  description: string
  command: string
  example?: string
  options?: { flag: string; description: string }[]
}) {
  return (
    <section className="space-y-4">
      <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
      
      <CodeBlock command={command} />
      
      {example && (
        <div className="mt-2">
          <p className="text-sm text-muted-foreground mb-2">Example:</p>
          <CodeBlock command={example} />
        </div>
      )}
      
      {options && options.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Options:</p>
          <div className="space-y-2">
            {options.map((opt) => (
              <div key={opt.flag} className="flex gap-4 text-sm">
                <code className="text-foreground font-mono min-w-[120px]">{opt.flag}</code>
                <span className="text-muted-foreground">{opt.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export function DocsCLIPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">CLI Reference</h1>
        <p className="text-lg text-muted-foreground">
          Complete reference for the TokenUI command-line interface. 
          Install and manage design skills directly from your terminal.
        </p>
      </div>

      {/* Installation */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Installation</h2>
        <p className="text-muted-foreground">
          No installation required. Use npx to run the CLI directly. 
          If you prefer, you can install it globally for faster execution.
        </p>
        
        <div className="space-y-4">
          <CodeBlock 
            command="npx tokenui <command>"
            description="Run without installing (recommended)"
          />
          <CodeBlock 
            command="npm install -g tokenui"
            description="Install globally (optional)"
          />
        </div>
      </section>

      {/* Commands */}
      <section className="space-y-8">
        <h2 className="text-2xl font-semibold tracking-tight">Commands</h2>

        <CommandSection
          title="add"
          description="Add a skill to your project. Installs the skill and all its dependencies."
          command="npx tokenui add <skill-name>"
          example="npx tokenui add button"
          options={[
            { flag: "--path, -p", description: "Custom installation path" },
            { flag: "--force, -f", description: "Overwrite existing files" },
            { flag: "--dry-run", description: "Preview changes without applying" },
          ]}
        />

        <CommandSection
          title="list"
          description="List all available skills in the gallery. Filter by category or search term."
          command="npx tokenui list"
          example="npx tokenui list --category forms"
          options={[
            { flag: "--category, -c", description: "Filter by category" },
            { flag: "--search, -s", description: "Search by keyword" },
            { flag: "--limit, -l", description: "Limit results (default: 20)" },
          ]}
        />

        <CommandSection
          title="info"
          description="Show detailed information about a specific skill."
          command="npx tokenui info <skill-name>"
          example="npx tokenui info modal"
        />

        <CommandSection
          title="remove"
          description="Remove a skill from your project."
          command="npx tokenui remove <skill-name>"
          example="npx tokenui remove button"
          options={[
            { flag: "--force, -f", description: "Skip confirmation prompt" },
          ]}
        />

        <CommandSection
          title="update"
          description="Update skills to their latest versions."
          command="npx tokenui update"
          example="npx tokenui update button"
          options={[
            { flag: "--all, -a", description: "Update all skills" },
          ]}
        />

        <CommandSection
          title="publish"
          description="Publish a skill to the TokenUI gallery. Opens the publish page in your browser."
          command="npx tokenui publish"
          options={[
            { flag: "--draft", description: "Save as draft instead of publishing" },
          ]}
        />

        <CommandSection
          title="init"
          description="Initialize a new TokenUI-compatible project. Sets up the directory structure and configuration."
          command="npx tokenui init"
          example="npx tokenui init my-app"
          options={[
            { flag: "--template, -t", description: "Use a starter template" },
            { flag: "--yes, -y", description: "Skip prompts with defaults" },
          ]}
        />
      </section>

      {/* Global Options */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Global Options</h2>
        <p className="text-muted-foreground">
          These options work with any command:
        </p>
        
        <div className="space-y-2">
          <div className="flex gap-4 text-sm">
            <code className="text-foreground font-mono min-w-[120px]">--help, -h</code>
            <span className="text-muted-foreground">Show help for a command</span>
          </div>
          <div className="flex gap-4 text-sm">
            <code className="text-foreground font-mono min-w-[120px]">--version, -v</code>
            <span className="text-muted-foreground">Show CLI version</span>
          </div>
          <div className="flex gap-4 text-sm">
            <code className="text-foreground font-mono min-w-[120px]">--verbose</code>
            <span className="text-muted-foreground">Enable verbose logging</span>
          </div>
          <div className="flex gap-4 text-sm">
            <code className="text-foreground font-mono min-w-[120px]">--silent</code>
            <span className="text-muted-foreground">Suppress all output except errors</span>
          </div>
        </div>
      </section>

      {/* Configuration */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Configuration</h2>
        <p className="text-muted-foreground">
          Create a tokenui.json file in your project root to customize behavior:
        </p>
        
        <CodeBlock 
          command={`{
  "path": "./src/components",
  "typescript": true,
  "tailwind": true,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}`}
        />

        <div className="space-y-2">
          <p className="text-sm font-medium">Configuration options:</p>
          <div className="flex gap-4 text-sm">
            <code className="text-foreground font-mono min-w-[140px]">path</code>
            <span className="text-muted-foreground">Default installation directory for skills</span>
          </div>
          <div className="flex gap-4 text-sm">
            <code className="text-foreground font-mono min-w-[140px]">typescript</code>
            <span className="text-muted-foreground">Use TypeScript by default</span>
          </div>
          <div className="flex gap-4 text-sm">
            <code className="text-foreground font-mono min-w-[140px]">tailwind</code>
            <span className="text-muted-foreground">Enable Tailwind CSS integration</span>
          </div>
          <div className="flex gap-4 text-sm">
            <code className="text-foreground font-mono min-w-[140px]">aliases</code>
            <span className="text-muted-foreground">Import path aliases for your project</span>
          </div>
        </div>
      </section>

      {/* Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Common Workflows</h2>

        <div className="space-y-4">
          <div>
            <p className="font-medium mb-2">Add multiple skills at once:</p>
            <CodeBlock command="npx tokenui add button card modal input" />
          </div>

          <div>
            <p className="font-medium mb-2">Search and add skills interactively:</p>
            <CodeBlock command="npx tokenui list --search form | npx tokenui add" />
          </div>

          <div>
            <p className="font-medium mb-2">Update all skills in your project:</p>
            <CodeBlock command="npx tokenui update --all" />
          </div>

          <div>
            <p className="font-medium mb-2">Install to a custom directory:</p>
            <CodeBlock command="npx tokenui add button --path ./app/ui" />
          </div>
        </div>
      </section>
    </div>
  )
}
