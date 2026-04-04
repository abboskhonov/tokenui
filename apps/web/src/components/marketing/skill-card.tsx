import { cn } from "@/lib/utils"

type SkillCardProps = {
  variant: "audit" | "layout" | "skills" | "search" | "command" | "pattern"
  className?: string
}

const previewThemes = {
  audit: {
    bg: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
    accent: "from-blue-500/20 via-purple-500/20 to-pink-500/20",
    content: "grid",
  },
  layout: {
    bg: "bg-gradient-to-br from-zinc-900 via-neutral-900 to-zinc-900",
    accent: "from-orange-500/20 via-red-500/20 to-pink-500/20",
    content: "hero",
  },
  skills: {
    bg: "bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900",
    accent: "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
    content: "cards",
  },
  search: {
    bg: "bg-gradient-to-br from-neutral-900 via-stone-900 to-neutral-900",
    accent: "from-violet-500/20 via-purple-500/20 to-fuchsia-500/20",
    content: "search",
  },
  command: {
    bg: "bg-black",
    accent: "from-white/10 via-gray-500/10 to-white/10",
    content: "command",
  },
  pattern: {
    bg: "bg-black",
    accent: "from-white/20 via-transparent to-white/20",
    content: "pattern",
  },
} as const

function PatternBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Flowing curved lines */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 400 300"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        {/* Curved flowing lines */}
        <path
          d="M0,150 Q100,50 200,150 T400,150"
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="1"
          opacity="0.6"
        />
        <path
          d="M0,180 Q100,80 200,180 T400,180"
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="0.8"
          opacity="0.5"
        />
        <path
          d="M0,120 Q100,20 200,120 T400,120"
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="0.6"
          opacity="0.4"
        />
        <path
          d="M0,210 Q100,110 200,210 T400,210"
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="0.7"
          opacity="0.5"
        />
        <path
          d="M0,90 Q100,190 200,90 T400,90"
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="0.5"
          opacity="0.3"
        />
        {/* Diagonal lines from left */}
        <line
          x1="50"
          y1="300"
          x2="150"
          y2="0"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.5"
        />
        <line
          x1="80"
          y1="300"
          x2="180"
          y2="0"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.5"
        />
        <line
          x1="20"
          y1="300"
          x2="120"
          y2="0"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  )
}

function DotMatrixPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900" />
      {/* Dot matrix overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "12px 12px",
        }}
      />
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-transparent to-transparent" />
    </div>
  )
}

function CommandPalette() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-6">
      <div className="w-full max-w-xs space-y-3">
        <div className="mb-4 text-center text-xs text-white/60">
          What can I help you ship?
        </div>
        {/* Search input */}
        <div className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-2">
          <span className="text-white/40">$</span>
          <div className="h-4 w-px bg-white/20" />
          <span className="text-xs text-white/40">Ask AI to build...</span>
        </div>
        {/* Command chips */}
        <div className="flex flex-wrap gap-1.5">
          {["Core Vitals", "Hero Section", "Upload Files", "Landing Page"].map(
            (cmd) => (
              <div
                key={cmd}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-white/60"
              >
                {cmd}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

function SearchInterface() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-4">
      <div className="w-full max-w-xs space-y-2">
        <div className="mb-2 text-[10px] tracking-wider text-white/40 uppercase">
          Search Commands
        </div>
        {/* Search bar */}
        <div className="flex items-center justify-between rounded-lg border border-white/20 bg-white/5 px-3 py-2">
          <span className="text-xs text-white/60">What&apos;s up?</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-white/40"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        {/* Command list */}
        <div className="space-y-1 rounded-lg border border-white/10 bg-white/5 p-2">
          {[
            { name: "Book tickets", tag: "Operator", shortcut: "⌘K" },
            { name: "Summarize", tag: "gpt-4o", shortcut: "⌘cmd+p" },
            { name: "Screen Studio", tag: "gpt-4o", shortcut: "App" },
            { name: "Talk to Jarvis", tag: "gpt-4o voice", shortcut: "Active" },
            { name: "Translate", tag: "gpt-4o", shortcut: "Command" },
          ].map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between py-1 text-[10px]"
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-blue-500/30" />
                <span className="text-white/70">{item.name}</span>
                <span className="text-white/30">{item.tag}</span>
              </div>
              <span className="text-white/40">{item.shortcut}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-1 text-[10px] text-white/30">
          <span>Press ⌘K to open commands</span>
          <span>ESC to cancel</span>
        </div>
      </div>
    </div>
  )
}

function HeroContent() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-bold text-white">Background Paths</h2>
      <button className="mt-4 flex items-center gap-2 rounded-full border border-white/30 bg-black/50 px-4 py-2 text-xs text-white transition-colors hover:bg-white/10">
        Discover Excellence
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

export function SkillCard({ variant, className }: SkillCardProps) {
  const theme = previewThemes[variant]

  const renderContent = () => {
    switch (theme.content) {
      case "pattern":
        return <DotMatrixPattern />
      case "command":
        return <CommandPalette />
      case "search":
        return <SearchInterface />
      case "hero":
        return <HeroContent />
      default:
        return (
          <>
            <PatternBackground />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-semibold tracking-tight text-white/80 capitalize">
                {variant}
              </span>
            </div>
          </>
        )
    }
  }

  return (
    <div
      className={cn(
        "relative aspect-[4/3] overflow-hidden",
        theme.bg,
        className
      )}
    >
      {renderContent()}
    </div>
  )
}
