# Component Templates

Copy these templates when creating new UI components.

## Simple Component (No Variants)

```typescript
import * as React from "react"
import { X as XPrimitive } from "@base-ui/react/x"
import { cn } from "@/lib/utils"

function ComponentName({
  className,
  ...props
}: XPrimitive.Props) {
  return (
    <XPrimitive
      data-slot="component-name"
      className={cn(
        "base-classes",
        className
      )}
      {...props}
    />
  )
}

export { ComponentName }
```

## Component with Variants (cva)

```typescript
import { X as XPrimitive } from "@base-ui/react/x"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const componentVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "variant-classes",
        secondary: "secondary-classes",
      },
      size: {
        default: "size-default",
        sm: "size-sm",
        lg: "size-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

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

## Client Component with State

```typescript
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ComponentNameProps {
  className?: string
  // ... other props
}

function ComponentName({
  className,
  ...props
}: ComponentNameProps) {
  const [state, setState] = React.useState(defaultValue)

  return (
    <div
      data-slot="component-name"
      className={cn("base-classes", className)}
      {...props}
    >
      {/* Component content */}
    </div>
  )
}

export { ComponentName }
```

## Component with Icons

```typescript
import * as React from "react"
import { X as XPrimitive } from "@base-ui/react/x"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { IconNameIcon } from "@hugeicons/core-free-icons"

function ComponentName({
  className,
  children,
  ...props
}: XPrimitive.Props) {
  return (
    <XPrimitive
      data-slot="component-name"
      className={cn("base-classes", className)}
      {...props}
    >
      <HugeiconsIcon icon={IconNameIcon} strokeWidth={2} />
      {children}
    </XPrimitive>
  )
}

export { ComponentName }
```

## Compound Component Pattern

```typescript
import * as React from "react"
import { cn } from "@/lib/utils"

// Root component
function Card({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10",
        className
      )}
      {...props}
    />
  )
}

// Child component
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("font-heading text-base font-medium", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("p-4", className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardTitle, CardContent }
```

## Dialog/Modal Pattern

```typescript
"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-2 right-2"
                size="icon-sm"
              />
            }
          >
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  )
}

export { Dialog, DialogTrigger, DialogContent, DialogOverlay }
```

## Menu/Dropdown Pattern

```typescript
"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"

function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

function DropdownMenuContent({
  className,
  ...props
}: MenuPrimitive.Popup.Props) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner className="isolate z-50 outline-none">
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "dark z-50 max-h-(--available-height) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 animate-none! relative bg-popover/70 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150",
            className
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent }
```

## Form Input Pattern

```typescript
import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
```
