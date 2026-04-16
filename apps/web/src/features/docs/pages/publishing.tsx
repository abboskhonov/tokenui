"use client"

import { DocsPage } from "../components/doc-page"
import { CodeBlock } from "../components/code-block"
import { Section, Heading, Paragraph, Step, List } from "../components/typography"
import type { TOCItem } from "../components/table-of-contents"

const tocItems: TOCItem[] = [
  { id: "create", text: "Create", level: 2 },
  { id: "skill-format", text: "Skill Format", level: 2 },
  { id: "submit", text: "Submit", level: 2 },
]

export function DocsPublishingPage() {
  return (
    <DocsPage
      title="Publishing Skills"
      description="Share your design system inspirations with the community."
      breadcrumbItems={[
        { label: "Docs", href: "/docs" },
        { label: "Publishing Skills" }
      ]}
      tocItems={tocItems}
    >
      <Section id="create">
        <Heading id="create">Create</Heading>
        <Paragraph>
          Go to the <a href="/publish" className="text-foreground underline hover:no-underline">Publish page</a> to create a new design system skill. 
          You'll need:
        </Paragraph>
        <List items={[
          <>A name and description — capture the aesthetic in one line</>,
          <>A SKILL.md file with the complete design system documentation</>,
          <>Visual specs — colors, typography, spacing, and component patterns</>,
          <>A demo preview showing the design in action</>,
          <>A thumbnail image for the gallery</>
        ]} />
        <Paragraph>
          Good skills capture a cohesive aesthetic. Think: "Payment infrastructure. Signature purple gradients, weight-300 elegance." 
          Or "All-in-one workspace. Warm minimalism, serif headings, soft surfaces."
        </Paragraph>
      </Section>

      <Section id="skill-format">
        <Heading id="skill-format">Skill Format</Heading>
        <Paragraph>
          Skills are documented using SKILL.md files with YAML frontmatter:
        </Paragraph>
        <CodeBlock 
          filename="SKILL.md"
          code={`---
name: vercel-precision
description: Black and white precision. Geist font. Ultra-minimal frontend aesthetic.
---

# Vercel Precision

A design system inspired by modern developer tools.

## Visual Language

- Colors: Black (#000), white (#fff), subtle grays
- Typography: Geist, tight letter-spacing, light weights
- Spacing: Generous, asymmetrical layouts
- Aesthetic: Clean, code-forward, technically precise

## Usage

Tell your AI agent:

"Use the vercel-precision skill for this landing page — hero with dark background, 
gradient text, monospace code blocks, generous whitespace."

## Components

### Hero
- Full-bleed dark background
- Centered content, max-width constrained
- Gradient text effect on headline
- Subtle grid pattern overlay`}
        />
        <Paragraph>
          Document the visual language clearly. Colors, typography, spacing, and mood. 
          The more specific you are, the better AI agents can replicate the aesthetic.
        </Paragraph>
      </Section>

      <Section id="submit">
        <Heading id="submit">Submit</Heading>
        <Paragraph>
          Skills go through a review process before appearing in the gallery:
        </Paragraph>
        <div className="space-y-6">
          <Step number={1} title="Draft">
            Save your skill as a draft while you work on it. Drafts are private and only visible to you.
            Access them anytime from your <a href="/studio" className="text-foreground underline hover:no-underline">Studio</a>.
          </Step>
          <Step number={2} title="Pending">
            Submit your skill for review. This usually takes 1-2 business days.
          </Step>
          <Step number={3} title="Approved">
            Once approved, your skill appears in the public gallery. Others can install it and 
            let their AI agents build UI that matches your design system.
          </Step>
        </div>
        <Paragraph className="mt-6">
          Track views, stars, and CLI downloads in your Studio dashboard.
        </Paragraph>
      </Section>
    </DocsPage>
  )
}
