"use client"

import { DocsPage } from "../components/doc-page"
import { CommandBlock } from "../components/code-block"
import { Section, Heading, Paragraph, Step } from "../components/typography"
import type { TOCItem } from "../components/table-of-contents"

const tocItems: TOCItem[] = [
  { id: "install", text: "Install", level: 2 },
  { id: "usage", text: "Usage", level: 2 },
  { id: "options", text: "Options", level: 2 },
]

export function DocsInstallingPage() {
  return (
    <DocsPage
      title="Installing Skills"
      description="Add design system skills to your project with the TasteUI CLI."
      breadcrumbItems={[
        { label: "Docs", href: "/docs" },
        { label: "Installing Skills" }
      ]}
      tocItems={tocItems}
    >
      <Section id="install">
        <Heading id="install">Install</Heading>
        <Paragraph>
          The CLI downloads design system skills to your local project. No global installation needed — use npx directly.
        </Paragraph>
        <CommandBlock command="npx tasteui.dev add username/skill-name" />
        <Paragraph>
          Skills are saved to <code className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono">./.agents/skills/{'{username}'}/{'{skill-name}'}/SKILL.md</code>.
        </Paragraph>
      </Section>

      <Section id="usage">
        <Heading id="usage">Usage</Heading>
        <div className="space-y-6">
          <Step number={1} title="Install by author/skill">
            Use the author username and skill slug:
            <div className="mt-3">
              <CommandBlock command="npx tasteui.dev add jane/vercel-precision" />
            </div>
          </Step>
          <Step number={2} title="Reference in your prompts">
            Once installed, tell your AI to use the skill:
            <div className="mt-3">
              <CommandBlock command="Use the jane/vercel-precision skill for this landing page — black and white, Geist font, ultra-minimal." />
            </div>
          </Step>
        </div>
      </Section>

      <Section id="options">
        <Heading id="options">Options</Heading>
        <div className="space-y-3 text-sm">
          <div className="flex gap-4">
            <code className="text-foreground font-mono min-w-[120px] text-muted-foreground">--path, -p</code>
            <span className="text-muted-foreground">Custom installation directory (default: ./.agents/skills/)</span>
          </div>
          <div className="flex gap-4">
            <code className="text-foreground font-mono min-w-[120px] text-muted-foreground">--force, -f</code>
            <span className="text-muted-foreground">Overwrite existing files</span>
          </div>
          <div className="flex gap-4">
            <code className="text-foreground font-mono min-w-[120px] text-muted-foreground">--dry-run</code>
            <span className="text-muted-foreground">Preview what would be installed without making changes</span>
          </div>
        </div>
      </Section>
    </DocsPage>
  )
}
