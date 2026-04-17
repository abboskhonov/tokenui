"use client"

import { DocsPage } from "../components/doc-page"
import { Section, Paragraph, List } from "../components/typography"
import type { TOCItem } from "../components/table-of-contents"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"

const tocItems: TOCItem[] = [
  { id: "general", text: "General", level: 2 },
  { id: "installation", text: "Installation", level: 2 },
  { id: "publishing", text: "Publishing", level: 2 },
  { id: "technical", text: "Technical", level: 2 },
]

interface FaqItemProps {
  question: string
  children: React.ReactNode
}

function FaqItem({ question, children }: FaqItemProps) {
  return (
    <Collapsible className="border-b border-border/50 last:border-b-0">
      <CollapsibleTrigger className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-foreground transition-colors hover:text-foreground/80 [&[data-state=open]>svg]:rotate-180">
        {question}
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <div className="pb-4 pt-0 text-sm text-muted-foreground">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function DocsFaqPage() {
  return (
    <DocsPage
      title="FAQ"
      description="Frequently asked questions about TasteUI design skills."
      breadcrumbItems={[
        { label: "Docs", href: "/docs" },
        { label: "FAQ" }
      ]}
      tocItems={tocItems}
    >
      <Section id="general">
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">General</h2>
          <div className="space-y-0">
            <FaqItem question="What is a design skill?">
              <Paragraph className="text-muted-foreground">
                A skill is a markdown file that documents a design system semantically. It is not a component library 
                or a Figma file. It is a document that explains a brand's visual language to an AI agent — 
                colors with roles, typography rules, spacing philosophy, and the rationale behind aesthetic choices.
              </Paragraph>
            </FaqItem>

            <FaqItem question="How is this different from a component library?">
              <Paragraph className="text-muted-foreground">
                Component libraries give you pre-built code to import. Skills give you a language to describe 
                what you want. An agent reads the skill and builds components that match the aesthetic from scratch, 
                adapted to your specific content and use case.
              </Paragraph>
            </FaqItem>

            <FaqItem question="Which AI agents work with skills?">
              <Paragraph className="text-muted-foreground">
                Any AI agent that can read markdown files and follow instructions. This includes Claude, GPT-4, 
                Gemini, and most modern coding agents. You simply reference the SKILL.md file in your prompts.
              </Paragraph>
            </FaqItem>

            <FaqItem question="Is TasteUI free to use?">
              <Paragraph className="text-muted-foreground">
                Yes. Browsing and installing skills is free. Publishing skills is also free — 
                we review submissions to maintain quality in the gallery.
              </Paragraph>
            </FaqItem>
          </div>
        </div>
      </Section>

      <Section id="installation">
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Installation</h2>
          <div className="space-y-0">
            <FaqItem question="Do I need to install anything globally?">
              <div className="text-muted-foreground space-y-3">
                <Paragraph className="text-muted-foreground">
                  No. Use npx directly without any global installation:
                </Paragraph>
                <code className="block px-3 py-2 rounded bg-muted text-sm font-mono">
                  npx tasteui.dev add username/skill-name
                </code>
              </div>
            </FaqItem>

            <FaqItem question="Where are skills saved?">
              <Paragraph className="text-muted-foreground">
                Skills are saved to <code className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono">./.agents/skills/{'{username}'}/{'{skill-name}'}/SKILL.md</code> 
                in your project directory. This keeps them version-controllable and easy to reference.
              </Paragraph>
            </FaqItem>

            <FaqItem question="Can I use multiple skills in one project?">
              <Paragraph className="text-muted-foreground">
                Yes, but they might conflict visually. It is best to pick one primary aesthetic and stick with it. 
                If you need to mix, be explicit in your prompts about which skill applies to which part.
              </Paragraph>
            </FaqItem>

            <FaqItem question="How do I update a skill?">
              <div className="text-muted-foreground space-y-3">
                <Paragraph className="text-muted-foreground">
                  Re-run the install command with the <code className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono">--force</code> flag 
                  to overwrite the existing files:
                </Paragraph>
                <code className="block px-3 py-2 rounded bg-muted text-sm font-mono">
                  npx tasteui.dev add username/skill-name --force
                </code>
              </div>
            </FaqItem>
          </div>
        </div>
      </Section>

      <Section id="publishing">
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Publishing</h2>
          <div className="space-y-0">
            <FaqItem question="What makes a good skill?">
              <div className="text-muted-foreground space-y-3">
                <Paragraph className="text-muted-foreground">
                  Good skills capture a cohesive aesthetic with specific details:
                </Paragraph>
                <List items={[
                  <>A clear, distinctive visual theme (not generic "modern minimal")</>,
                  <>Specific color values with role descriptions</>,
                  <>Typography rules with exact sizes, weights, and spacing</>,
                  <>Rationale that explains the design philosophy</>
                ]} />
              </div>
            </FaqItem>

            <FaqItem question="How long does review take?">
              <Paragraph className="text-muted-foreground">
                Typically 1-2 business days. We check that the skill is complete, the aesthetic is well-defined, 
                and the documentation is clear enough for AI agents to follow.
              </Paragraph>
            </FaqItem>

            <FaqItem question="Can I edit a skill after publishing?">
              <Paragraph className="text-muted-foreground">
                Yes. Go to your <a href="/studio" className="text-foreground underline hover:no-underline">Studio</a> to edit 
                published skills. Updates go through the same review process.
              </Paragraph>
            </FaqItem>
          </div>
        </div>
      </Section>

      <Section id="technical">
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Technical</h2>
          <div className="space-y-0">
            <FaqItem question="Why markdown instead of JSON tokens?">
              <Paragraph className="text-muted-foreground">
                Markdown is readable by humans and parseable by AI. JSON tokens tell you what values to use 
                but not where or why. Markdown lets you include context, rationale, and usage examples — 
                the things that help agents make good design decisions.
              </Paragraph>
            </FaqItem>

            <FaqItem question="Can I preview a skill before installing?">
              <Paragraph className="text-muted-foreground">
                Yes. Each skill has a detail page showing the thumbnail, description, and a preview of the 
                SKILL.md content. Browse the gallery to explore available skills.
              </Paragraph>
            </FaqItem>

            <FaqItem question="Do skills work with any framework?">
              <Paragraph className="text-muted-foreground">
                Skills are framework-agnostic. The SKILL.md describes the visual language — colors, typography, spacing — 
                without prescribing implementation. Your agent builds the components in whatever framework you are using.
              </Paragraph>
            </FaqItem>
          </div>
        </div>
      </Section>
    </DocsPage>
  )
}
