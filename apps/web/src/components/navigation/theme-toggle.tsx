"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { HugeiconsIcon } from "@hugeicons/react";
import { Moon02Icon, Sun01Icon } from "@hugeicons/core-free-icons";

/**
 * ThemeToggle - A reusable theme toggle button
 * Uses useTheme context to toggle between light/dark modes
 */
export const ThemeToggle = memo(function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-8 w-8" 
      onClick={toggleTheme}
      aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      <HugeiconsIcon
        icon={resolvedTheme === "dark" ? Sun01Icon : Moon02Icon}
        className="size-4"
      />
    </Button>
  );
});
