import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon } from "@hugeicons/core-free-icons"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchInput({ value, onChange, placeholder = "Search..." }: SearchInputProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 border border-border/50">
        <HugeiconsIcon icon={Search01Icon} className="size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground w-48"
        />
      </div>
      <kbd className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground border border-border/50">
        /
      </kbd>
    </div>
  )
}
