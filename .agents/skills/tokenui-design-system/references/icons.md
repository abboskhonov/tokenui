# Icons Reference

TokenUI uses Hugeicons (@hugeicons/react) as its icon library. Never use lucide-react.

## Import Pattern

```typescript
import { HugeiconsIcon } from "@hugeicons/react"
import { IconNameIcon } from "@hugeicons/core-free-icons"

// Usage
<HugeiconsIcon icon={IconNameIcon} strokeWidth={2} />
```

## Common Icons by Use Case

### Navigation

| Icon | Import | Usage |
|------|--------|-------|
| Menu | `SidebarLeftIcon` | Sidebar toggle |
| Back | `ArrowLeft01Icon` | Navigation back |
| Forward | `ArrowRight01Icon` | Navigation forward |
| Up | `ArrowUp01Icon` | Scroll up |
| Down | `ArrowDown01Icon` | Scroll down |
| Chevron Right | `ArrowRight01Icon` | Submenu indicator |
| Expand | `UnfoldMoreIcon` | Select dropdown |

### Actions

| Icon | Import | Usage |
|------|--------|-------|
| Close | `Cancel01Icon` | Close button, dismiss |
| Check | `Tick02Icon` | Checkmark, selected item |
| Delete | `Delete01Icon` | Delete action |
| Edit | `PencilEdit01Icon` | Edit action |
| Add | `Add01Icon` | Add new item |
| Remove | `Minus01Icon` | Remove item |
| Search | `Search01Icon` | Search input |
| Filter | `FilterHorizontalIcon` | Filter action |
| Sort | `SortByDown01Icon` | Sort action |
| More | `MoreHorizontalIcon` | More options |
| Settings | `Settings01Icon` | Settings page |
| Logout | `Logout01Icon` | Sign out |

### Status

| Icon | Import | Usage |
|------|--------|-------|
| Info | `InformationCircleIcon` | Information |
| Warning | `Alert01Icon` | Warning state |
| Error | `Alert02Icon` | Error state |
| Success | `CheckmarkCircle02Icon` | Success state |
| Loading | `Loading02Icon` | Loading spinner |
| Help | `HelpCircleIcon` | Help tooltip |

### Files & Content

| Icon | Import | Usage |
|------|--------|-------|
| File | `File01Icon` | Generic file |
| Folder | `Folder01Icon` | Directory |
| Image | `Image01Icon` | Image file |
| Download | `Download01Icon` | Download action |
| Upload | `Upload01Icon` | Upload action |
| Link | `Link01Icon` | External link |
| Copy | `Copy01Icon` | Copy to clipboard |
| Share | `Share01Icon` | Share action |

### User

| Icon | Import | Usage |
|------|--------|-------|
| User | `UserIcon` | Profile |
| Users | `UsersIcon` | Group |
| Account | `UserAccountIcon` | Account settings |
| Avatar | `UserCircleIcon` | User avatar |

### Layout

| Icon | Import | Usage |
|------|--------|-------|
| Grid | `GridIcon` | Grid view |
| List | `ListViewIcon` | List view |
| Layout | `Layout01Icon` | Layout options |
| Fullscreen | `FullscreenIcon` | Expand |
| Collapse | `CollapseIcon` | Collapse |

## Icon Sizing

Always use the standard size classes:

```
// Small (buttons, inputs)
[&_svg:not([class*='size-'])]:size-3      // xs size
[&_svg:not([class*='size-'])]:size-3.5    // sm size
[&_svg:not([class*='size-'])]:size-4      // default

// Medium (cards, headers)
size-4

// Large (feature icons, empty states)
size-5
size-6
```

## Complete Button with Icon

```typescript
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon } from "@hugeicons/core-free-icons"

<Button>
  <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
  Add Item
</Button>
```

## Icon Button

```typescript
<Button variant="ghost" size="icon-sm">
  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
  <span className="sr-only">Close</span>
</Button>
```

## Icon in Input

```typescript
<div className="relative">
  <HugeiconsIcon 
    icon={Search01Icon} 
    strokeWidth={2}
    className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" 
  />
  <Input className="pl-9" placeholder="Search..." />
</div>
```

## Dropdown Menu with Icons

```typescript
<DropdownMenuItem>
  <HugeiconsIcon icon={Edit01Icon} strokeWidth={2} />
  Edit
</DropdownMenuItem>
<DropdownMenuItem>
  <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} />
  Copy
</DropdownMenuItem>
<DropdownMenuSeparator />
<DropdownMenuItem variant="destructive">
  <HugeiconsIcon icon={Delete01Icon} strokeWidth={2} />
  Delete
</DropdownMenuItem>
```

## Available Icon Packages

- `@hugeicons/core-free-icons` - Free core icons (most common)
- `@hugeicons/core-duotone-icons` - Duotone style
- `@hugeicons/core-filled-icons` - Filled style

Always prefer the free core icons unless specifically needing another style.

## Icon Naming Convention

Hugeicons uses descriptive names with suffixes:
- `01`, `02`, `03` - Different variations
- `Icon` suffix on imports (e.g., `Search01Icon`)
- Kebab-case in URL, PascalCase in imports
