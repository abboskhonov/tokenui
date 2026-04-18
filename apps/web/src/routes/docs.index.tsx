"use client"

import { createFileRoute } from "@tanstack/react-router"
import { DocsPage } from "@/features/docs/components/doc-page"
import { CodeBlock } from "@/features/docs/components/code-block"
import { VideoEmbed } from "@/features/docs/components/video-embed"
import { Section, Heading, Paragraph, Step, List } from "@/features/docs/components/typography"
import type { TOCItem } from "@/features/docs/components/table-of-contents"

const tocItems: TOCItem[] = [
  { id: "the-problem", text: "The Problem", level: 2 },
  { id: "the-fix", text: "The Fix", level: 2 },
  { id: "how-it-works", text: "How it works", level: 2 },
  { id: "why-skills", text: "Why SKILL.md?", level: 2 },
  { id: "quick-start", text: "Quick Start", level: 2 },
]

function IntroductionPage() {
  return (
    <DocsPage
      title="Documentation"
      description="TasteUI is a collection of design system inspirations from popular websites. Drop one in, let AI agents build matching UI."
      breadcrumbItems={[
        { label: "Docs" }
      ]}
      tocItems={tocItems}
    >
      <VideoEmbed videoUrl="https://pub-760132b719d849e3aea8daf679b700b7.r2.dev/design-previews/demos/tasteui-demo.mp4" title="TasteUI Demo" className="my-6" />

      <Section id="the-problem">
        <Heading id="the-problem">The Problem: AI builds "nice" but not "yours"</Heading>
        <Paragraph>
          Tell any AI agent to "build me a landing page" and you already know what you'll get. 
          Rounded cards. A purple-blue gradient. A centered hero. A "Get Started" button. 
          It works. It also looks like everything else.
        </Paragraph>
        <Paragraph>
          The reason is simple. The agent's idea of "good design" is an average of averages. 
          It has no clue why Vercel uses border instead of shadow, why Linear keeps its letter-spacing so tight, 
          or why Stripe goes easy on gradients. Even if it did know, cramming all of that into a prompt is borderline impossible.
        </Paragraph>
        <Paragraph>
          So you end up with two bad options:
        </Paragraph>
        <List items={[
          <>Write 40 lines of prompt every time ("use #0070f3 for links, -0.02em letter spacing, 8px border radius, no shadows just 1px borders...") and still get half of it wrong.</>,
          <>Screenshot a site, paste it, say "make it look like this." The agent copies pixels but misses the system behind them.</>
        ]} />
        <Paragraph>
          Neither scales.
        </Paragraph>
      </Section>

      <Section id="the-fix">
        <Heading id="the-fix">The Fix: Design Skills</Heading>
        <Paragraph>
          A skill is a markdown file that describes a design system semantically. 
          It is not a token list. Not a Figma export. Not a component library. 
          Picture a document where an experienced designer explains a brand's visual language 
          to a developer who's seeing it for the first time. That's what it reads like.
        </Paragraph>
        <Paragraph>
          Here's what goes inside:
        </Paragraph>
        <List items={[
          <><strong>Visual theme and atmosphere</strong> — tells the agent what the brand looks like and why. The philosophy behind the aesthetic. Sentences like "Minimalism as engineering principle." The agent gets intent, not just instructions.</>,
          <><strong>Color palette and roles</strong> — gives every color a hex value and a job. "#ff5b4f, ship red, used for the production deploy flow because shipping should feel urgent." The name tells you what the color does.</>,
          <><strong>Typography rules</strong> — font, size, weight, line-height, letter-spacing. But the real value is context: which style goes where, and why. "Display sizes get -2.4px tracking because headlines should feel like minified code."</>,
          <><strong>Spacing, shadows, motion, components</strong> — every rule, wherever possible, with a reason attached.</>
        ]} />
        <Paragraph>
          Skills keep token, rule, and rationale in the same file. 
          A token tells you what to use but not where. A rule tells you where but not when to bend it. 
          The rationale is what lets an agent make the right call when it hits a situation the file never covers.
        </Paragraph>
      </Section>

      <Section id="why-skills">
        <Heading id="why-skills">Why SKILL.md?</Heading>
        <Paragraph>
          Because it is the language AI agents speak best. They can read JSON tokens but can't interpret them. 
          They can't see Figma files. They'll imitate a screenshot but won't systematize it. 
          Markdown sits in the middle: readable by humans, parseable by machines, easy to version and diff, 
          and you can drop it in your repo.
        </Paragraph>
        <Paragraph>
          Most teams don't write their own design system from scratch. Most teams say 
          "make it look like Linear," "give it that Stripe feel," or "keep it close to Apple." 
          These references are real. They come up constantly.
        </Paragraph>
        <Paragraph>
          TasteUI collects those starting points. Inspiration files based on Vercel, Stripe, Linear, 
          Apple, Tesla, Notion, Figma, Supabase, and more. All in the same format, all comparable. 
          Pick one, drop it into your project, tell your agent "use this file as reference." 
          Building on top of that language with your own content is up to you.
        </Paragraph>
        <Paragraph>
          The goal is not "copy Vercel." It is to give the agent a starting language. 
          Enough context to escape the generic average and land on a specific aesthetic. 
          From there you drift, you make it yours, you evolve it.
        </Paragraph>
      </Section>

      <Section id="how-it-works">
        <Heading id="how-it-works">How it works</Heading>
        <div className="space-y-6">
          <Step number={1} title="Browse design inspirations">
            Explore skills from brands that match your aesthetic. 
            Each skill captures the essence: "Minimalist. Generous whitespace. Purple gradients and weight-300 elegance." 
            Or "Cinematic dark theme. Signature green accent. Code-forward developer aesthetic."
          </Step>
          <Step number={2} title="Install the design system">
            Run the CLI to add the skill to your project:
            <div className="mt-3">
              <CodeBlock code="npx tasteui.dev add jane/striped-minimalism" />
            </div>
          </Step>
          <Step number={3} title="Let AI build matching UI">
            Tell your AI agent to use the skill:
            <div className="mt-3">
              <CodeBlock 
                code='"Use the jane/striped-minimalism skill to build a pricing page with their signature purple gradients and ultra-light typography."' 
                filename="Example prompt"
              />
            </div>
          </Step>
        </div>
      </Section>

      <Section id="quick-start">
        <Heading id="quick-start">Quick Start</Heading>
        <Paragraph>
          No setup required — just run:
        </Paragraph>
        <CodeBlock 
          code="npx tasteui.dev add username/skill-name"
          filename="Install a design system"
        />
        <Paragraph>
          Skills are saved to <code className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono">./.agents/skills/{'{username}'}/{'{skill-name}'}/SKILL.md</code>. 
          Your AI agent reads the file and follows the design system instructions.
        </Paragraph>
      </Section>
    </DocsPage>
  )
}

export const Route = createFileRoute("/docs/")({
  component: IntroductionPage,
})
