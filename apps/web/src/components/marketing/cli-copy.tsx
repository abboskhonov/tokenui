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
 * CLICopy - A CLI command copy button with visual feedback
 * 
 * @example
 * <CLICopy command="npx tokenui add button" />
 */
export const CLICopy = memo(function CLICopy({ 
  command = "npx tokenui add <skill>", 
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
        "group inline-flex items-center gap-2.5 rounded-lg border border-border",
        "bg-muted/50 px-4 py-2.5 font-mono text-sm text-muted-foreground",
        "transition-all hover:border-foreground/30 hover:bg-muted hover:text-foreground",
        className
      )}
      aria-label={`Copy command: ${command}`}
    >
      <span className="text-muted-foreground/60">$</span>
      <span>{command}</span>
      <HugeiconsIcon
        icon={copied ? Tick02Icon : Copy01Icon}
        className={cn("ml-1 size-4", copied && "text-green-500")}
        aria-hidden="true"
      />
    </button>
  );
});
