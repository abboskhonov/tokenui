"use client"

import { useState } from "react"

const designs = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and minimal design system",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
    likes: 128,
    downloads: 3420,
  },
  {
    id: "glass",
    name: "Glass",
    description: "Frosted glass morphism aesthetics",
    image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1000&auto=format&fit=crop",
    likes: 256,
    downloads: 5890,
  },
  {
    id: "neo",
    name: "Neo",
    description: "Bold neo-brutalist components",
    image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1000&auto=format&fit=crop",
    likes: 89,
    downloads: 2100,
  },
  {
    id: "cyber",
    name: "Cyber",
    description: "Cyberpunk futuristic interface",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop",
    likes: 412,
    downloads: 8900,
  },
  {
    id: "organic",
    name: "Organic",
    description: "Soft organic shapes and gradients",
    image: "https://images.unsplash.com/photo-1614851099518-94c8c7f1fa00?q=80&w=1000&auto=format&fit=crop",
    likes: 167,
    downloads: 4560,
  },
  {
    id: "mono",
    name: "Mono",
    description: "Monochromatic professional system",
    image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=1000&auto=format&fit=crop",
    likes: 203,
    downloads: 6780,
  },
]

function DesignCard({ design }: { design: typeof designs[0] }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(`npx tasteui add ${design.id}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-foreground/20 transition-all">
      {/* Preview Image */}
      <div className="aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={design.image}
          alt={design.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground">{design.name}</h3>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
              </svg>
              {design.likes}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {design.downloads}
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{design.description}</p>

        {/* CLI */}
        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-between px-3 py-2 bg-muted rounded-lg font-mono text-xs hover:bg-muted/80 transition-colors"
        >
          <span className="flex items-center gap-2">
            <span className="text-muted-foreground">$</span>
            <span className="text-foreground">npx tasteui add {design.id}</span>
          </span>
          <span className="text-muted-foreground">
            {copied ? "✓" : "Copy"}
          </span>
        </button>
      </div>
    </div>
  )
}

export function Hero() {
  const [searchQuery, setSearchQuery] = useState("")
  const [copied, setCopied] = useState(false)

  const handleCopyMain = () => {
    navigator.clipboard.writeText("npx tasteui add <design>")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const filteredDesigns = designs.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="relative">
      {/* Vertical Side Lines */}
      <div className="fixed top-0 bottom-0 left-4 md:left-8 lg:left-12 w-px bg-border z-50" />
      <div className="fixed top-0 bottom-0 right-4 md:right-8 lg:right-12 w-px bg-border z-50" />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6">
            Design Components
            <br />
            <span className="text-muted-foreground">for AI agents</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
            Explore our curated collection of UI designs. Use the CLI to install 
            them directly into your projects as ready-to-use components.
          </p>

          {/* CLI Command */}
          <button
            onClick={handleCopyMain}
            className="group inline-flex items-center gap-3 px-5 py-3 bg-muted rounded-xl font-mono text-sm mb-12 hover:bg-muted/80 transition-colors"
          >
            <span className="text-muted-foreground">$</span>
            <span className="text-foreground">npx tasteui add &lt;design&gt;</span>
            <span className="w-px h-4 bg-border mx-1" />
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
              {copied ? "Copied!" : "Copy"}
            </span>
          </button>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card border border-border rounded-2xl">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search designs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Most viewed
              </button>
              <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Most liked
              </button>
              <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Newest
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Design Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDesigns.map((design) => (
              <DesignCard key={design.id} design={design} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
