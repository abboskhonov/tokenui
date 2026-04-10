"use client";

import { useState, useCallback, memo } from "react";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";

interface CLICopyProps {
  command?: string;
  className?: string;
}

/**
 * CLICopy - Terminal-style input field for CLI commands
 * Matches the supermemory.ai hero style: defined border, rounded-lg, input-like
 * Width stays consistent between states - no flickering on theme change
 *
 * @example
 * <CLICopy command="npx tokenui.sh add button" />
 */
export const CLICopy = memo(function CLICopy({
  command = "npx tokenui.sh add <skill>",
  className
}: CLICopyProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);

      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [command]);

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "group relative inline-flex items-center justify-center rounded-lg",
        "border border-input bg-background",
        "px-4 py-3 font-mono text-sm",
        "hover:border-foreground/20 hover:bg-muted/30",
        "focus:outline-none",
        "transition-colors duration-150",
        className
      )}
      aria-label={`Copy command: ${command}`}
    >
      {/* Default state */}
      <span 
        className={cn(
          "flex items-center gap-2 transition-opacity duration-150",
          copied ? "opacity-0" : "opacity-100"
        )}
        aria-hidden={copied}
      >
        <span className="text-muted-foreground/60 select-none">$</span>
        <span className="text-foreground/90 tracking-tight">{command}</span>
        <span className="ml-2 flex items-center">
          <HugeiconsIcon
            icon={Copy01Icon}
            className="size-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors"
            aria-hidden="true"
          />
        </span>
      </span>

      {/* Copied state - left aligned to match command position */}
      <span 
        className={cn(
          "absolute inset-0 flex items-center gap-1.5 px-4",
          "transition-opacity duration-150",
          copied ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!copied}
      >
        <HugeiconsIcon icon={Tick02Icon} className="size-3.5 text-green-500" />
        <span className="text-sm text-foreground/70">Copied!</span>
      </span>
    </button>
  );
});
