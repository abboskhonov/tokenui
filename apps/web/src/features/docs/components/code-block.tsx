"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Copy01Icon, Tick02Icon, ComputerTerminal01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
  className?: string
}

export function CodeBlock({
  code,
  filename,
  showLineNumbers = false,
  className
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const lines = code.split("\n")

  return (
    <div className={cn("rounded-lg border border-border bg-muted/50 overflow-hidden", className)}>
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted">
          <span className="text-xs font-medium text-muted-foreground font-mono">{filename}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <HugeiconsIcon
              icon={copied ? Tick02Icon : Copy01Icon}
              className="size-3.5"
            />
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      )}
      <div className="relative group">
        {!filename && (
          <button
            onClick={handleCopy}
            className="absolute right-3 top-3 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
          >
            <HugeiconsIcon
              icon={copied ? Tick02Icon : Copy01Icon}
              className="size-3.5"
            />
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        )}
        <div className="p-4 overflow-x-auto">
          <pre className="text-sm font-mono leading-relaxed">
            {showLineNumbers ? (
              <code className="flex flex-col">
                {lines.map((line, i) => (
                  <span key={i} className="flex">
                    <span className="select-none text-muted-foreground/50 w-8 text-right mr-4">
                      {i + 1}
                    </span>
                    <span>{line || " "}</span>
                  </span>
                ))}
              </code>
            ) : (
              <code>{code}</code>
            )}
          </pre>
        </div>
      </div>
    </div>
  )
}

// Minimalist command block - dark theme, single command, copy button
interface CommandBlockProps {
  command: string
  className?: string
}

export function CommandBlock({ command, className }: CommandBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className={cn(
      "rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden",
      className
    )}>
      <div className="flex items-center gap-3 px-3 py-2.5">
        <HugeiconsIcon
          icon={ComputerTerminal01Icon}
          className="size-3.5 text-[#666] shrink-0"
        />
        <code className="text-sm font-mono text-[#e4e4e4] whitespace-pre overflow-x-auto flex-1 min-w-0">
          {command}
        </code>
        <button
          onClick={handleCopy}
          className="text-[#888] hover:text-[#ccc] transition-colors shrink-0"
          aria-label={copied ? "Copied" : "Copy command"}
        >
          <HugeiconsIcon
            icon={copied ? Tick02Icon : Copy01Icon}
            className="size-3.5"
          />
        </button>
      </div>
    </div>
  )
}
