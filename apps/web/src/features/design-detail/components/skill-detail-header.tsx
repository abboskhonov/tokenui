import { Link } from "@tanstack/react-router"

interface SkillDetailHeaderProps {
  username: string
  designSlug: string
}

export function SkillDetailHeader({
  username,
  designSlug,
}: SkillDetailHeaderProps) {
  return (
    <header className="sticky top-0 z-50 h-12 border-b border-border bg-background/95 backdrop-blur-xl">
      <div className="mx-auto h-full max-w-[1800px] px-4 flex items-center justify-between">
        {/* Left: Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Skills
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">{username}</span>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium truncate max-w-[200px]">{designSlug}</span>
        </div>

        {/* Right: Empty for minimal look */}
        <div />
      </div>
    </header>
  )
}
