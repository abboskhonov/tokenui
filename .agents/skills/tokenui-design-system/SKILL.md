---
name: tokenui-design-system
description: TokenUI Design System guidelines for the TanStack Start + Hono monorepo. Use when creating new UI components, modifying existing components, or building interfaces with shadcn/ui, Base UI, Tailwind CSS, and Hugeicons. Always follow these patterns for Button, Card, Input, Badge, Dialog, Sidebar, Select, DropdownMenu, Tooltip, and Sheet components.
---

# TokenUI Design System

This skill provides comprehensive guidelines for building UI components in the TokenUI monorepo (TanStack Start frontend + Hono API backend).

## Tech Stack Overview

- **Frontend**: TanStack Start (React + Vite + SSR), TanStack Router, TanStack Query
- **UI Components**: shadcn/ui with Base UI primitives (NOT Radix)
- **Styling**: Tailwind CSS v4 with OKLCH color space
- **Icons**: Hugeicons (@hugeicons/react)
- **Font**: Geist Variable
- **Component Style**: base-nova (from shadcn registry)

## Design Tokens

### CSS Variables (styles.css)

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --brand: oklch(0.58 0.14 245);
  --brand-foreground: oklch(0.985 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --surface-elevated: oklch(0.985 0.004 255);
  --surface-strong: oklch(0.945 0.01 255);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --grid: oklch(0.84 0.01 255 / 0.55);
  --radius: 0.45rem;
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: #000000;
  --foreground: oklch(0.985 0 0);
  --brand: oklch(0.72 0.12 240);
  --brand-foreground: oklch(0.165 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --surface-elevated: oklch(0.235 0.01 255);
  --surface-strong: oklch(0.285 0.012 255);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --grid: oklch(0.34 0.01 255 / 0.5);
}
```

### Theme Configuration

- **Base Color**: neutral
- **CSS Variables**: enabled
- **Style**: base-nova
- **Icon Library**: hugeicons
- **Menu Color**: inverted-translucent
- **Menu Accent**: subtle

## Component Patterns

### Naming Conventions

- **Components**: PascalCase function exports (e.g., `export function Button()`)
- **Hooks**: camelCase starting with `use` (e.g., `useSidebar`)
- **Types/Interfaces**: PascalCase nouns
- **Files**: kebab-case for components
- **Variants**: Use cva (class-variance-authority)

### Base Imports Pattern

Every component should import from `@base-ui/react` primitives:

```typescript
// Button uses ButtonPrimitive
import { Button as ButtonPrimitive } from "@base-ui/react/button"

// Dialog uses DialogPrimitive
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

// Select uses SelectPrimitive
import { Select as SelectPrimitive } from "@base-ui/react/select"
```

### Standard Component Structure

```typescript
import { X as XPrimitive } from "@base-ui/react/x"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Define variants using cva
const componentVariants = cva("base-classes", {
  variants: {
    variant: {
      default: "...",
      secondary: "...",
      // ...
    },
    size: {
      default: "...",
      sm: "...",
      lg: "...",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

// Component function
function ComponentName({
  className,
  variant = "default",
  size = "default",
  ...props
}: XPrimitive.Props & VariantProps<typeof componentVariants>) {
  return (
    <XPrimitive
      data-slot="component-name"
      className={cn(componentVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { ComponentName, componentVariants }
```

### Client Components

Add "use client" directive when using React hooks:

```typescript
"use client"

import * as React from "react"
// ... rest of imports
```

### Icons Pattern

Always use Hugeicons:

```typescript
import { HugeiconsIcon } from "@hugeicons/react"
import { IconNameIcon } from "@hugeicons/core-free-icons"

// Usage
<HugeiconsIcon icon={IconNameIcon} strokeWidth={2} />
```

Common icons used:
- `Cancel01Icon` - Close buttons
- `Tick02Icon` - Checkmarks
- `ArrowRight01Icon` - Navigation arrows
- `UnfoldMoreIcon` - Select dropdown
- `ArrowUp01Icon` / `ArrowDown01Icon` - Scroll buttons
- `SidebarLeftIcon` - Sidebar toggle

## Component Specifications

### Button

**File**: `button.tsx`

```typescript
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        outline: "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs": "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

### Card

**File**: `card.tsx`

Key features:
- Uses `data-slot="card"` and `data-size` attributes
- Supports `size?: "default" | "sm"` prop
- Has compound components: CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter
- Border ring: `ring-1 ring-foreground/10`
- Rounded: `rounded-xl`

### Input

**File**: `input.tsx`

Key classes:
```
h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40
```

### Badge

**File**: `badge.tsx`

Uses `useRender` from `@base-ui/react/use-render` and `mergeProps`.
Variants: default, secondary, destructive, outline, ghost, link

### Dialog

**File**: `dialog.tsx`

Key features:
- Uses `DialogPrimitive` from `@base-ui/react/dialog`
- Has animation classes: `data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95`
- Backdrop blur: `supports-backdrop-filter:backdrop-blur-xs`
- Close button uses `variant="ghost"` and `size="icon-sm"`
- Uses `Cancel01Icon` from Hugeicons

### Sheet

**File**: `sheet.tsx`

Key features:
- Uses `Dialog as SheetPrimitive` from `@base-ui/react/dialog`
- Supports `side?: "top" | "right" | "bottom" | "left"`
- Transitions: `transition duration-200 ease-in-out`

### Select

**File**: `select.tsx`

Key features:
- Uses `SelectPrimitive` from `@base-ui/react/select`
- Content has frosted glass effect: `bg-popover/70` with `backdrop-blur-2xl backdrop-saturate-150`
- Uses `UnfoldMoreIcon`, `Tick02Icon`, `ArrowUp01Icon`, `ArrowDown01Icon`

### Dropdown Menu

**File**: `dropdown-menu.tsx`

Key features:
- Uses `Menu as MenuPrimitive` from `@base-ui/react/menu`
- Content has frosted glass effect like Select
- Supports `variant?: "default" | "destructive"` on items
- Uses `Tick02Icon` and `ArrowRight01Icon`

### Tooltip

**File**: `tooltip.tsx`

Key features:
- Provider with `delay = 0` default
- Content has arrow: `TooltipPrimitive.Arrow`
- Background: `bg-foreground text-background` (inverted)

### Sidebar

**File**: `sidebar.tsx`

Key features:
- Complex component with context provider
- Uses `useIsMobile` hook
- Supports collapsible states: "expanded" | "collapsed"
- Has cookie persistence for state
- Keyboard shortcut: Ctrl/Cmd + B

## Utility Classes Reference

### Common Patterns

```
// Container
rounded-xl ring-1 ring-foreground/10

// Frosted glass effect
bg-popover/70 backdrop-blur-2xl backdrop-saturate-150

// Focus states
focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50

// Invalid states
aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20

// Dark mode invalid
dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40

// Transitions
transition-all duration-100
transition-colors duration-200 ease-linear

// Animation
data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95
data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95

// Icon sizing
[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4
```

### Custom Classes (styles.css)

```
.tokenui-shell - Background with radial gradient
.tokenui-preview - Preview container with gradient
.tokenui-wordmark - Text with shadow effect
```

## File Structure

```
apps/web/src/
├── components/
│   ├── ui/               # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── sheet.tsx
│   │   ├── select.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── tooltip.tsx
│   │   ├── sidebar.tsx
│   │   └── ...
│   ├── sidebar-01/       # Sidebar implementation
│   └── ...
├── hooks/
│   └── use-mobile.tsx    # useIsMobile hook
└── lib/
    └── utils.ts          # cn() utility
```

## Usage Guidelines

### Adding a New Component

1. Use Base UI primitives (e.g., `@base-ui/react/x`)
2. Define variants with cva if needed
3. Use `cn()` for class merging
4. Add `data-slot` attribute for debugging
5. Export named functions (not arrow functions)
6. Use Hugeicons for icons
7. Follow existing component patterns

### Import Patterns

```typescript
// React
import * as React from "react"

// Base UI
import { X as XPrimitive } from "@base-ui/react/x"

// Utilities
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

// Icons
import { HugeiconsIcon } from "@hugeicons/react"
import { IconNameIcon } from "@hugeicons/core-free-icons"

// Other components
import { Button } from "@/components/ui/button"
```

### Path Aliases

- `@/components/*` → `src/components/*`
- `@/lib/*` → `src/lib/*`
- `@/hooks/*` → `src/hooks/*`

## Common Mistakes to Avoid

1. **DON'T use Radix UI** - Use Base UI from `@base-ui/react`
2. **DON'T use arrow functions** for components - Use named function declarations
3. **DON'T use lucide-react** - Use `@hugeicons/react` instead
4. **DON'T forget data-slot** - Add to all components for debugging
5. **DON'T use arbitrary values** - Use CSS variables and theme tokens
6. **DON'T forget dark mode** - Always test both light and dark themes
