# Color Tokens Reference

Complete reference of all CSS color variables used in the TokenUI design system.

## Semantic Colors

### Background & Surface

| Variable | Light Mode | Dark Mode | Usage |
|----------|------------|-----------|-------|
| `--background` | `oklch(1 0 0)` (white) | `#000000` (black) | Page background |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | Primary text |
| `--card` | `oklch(1 0 0)` | `oklch(0.205 0 0)` | Card background |
| `--card-foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | Card text |
| `--popover` | `oklch(1 0 0)` | `oklch(0.205 0 0)` | Popover/dropdown bg |
| `--popover-foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | Popover text |
| `--surface-elevated` | `oklch(0.985 0.004 255)` | `oklch(0.235 0.01 255)` | Elevated surfaces |
| `--surface-strong` | `oklch(0.945 0.01 255)` | `oklch(0.285 0.012 255)` | Strong surfaces |

### Brand & Actions

| Variable | Light Mode | Dark Mode | Usage |
|----------|------------|-----------|-------|
| `--brand` | `oklch(0.58 0.14 245)` | `oklch(0.72 0.12 240)` | Brand accent |
| `--brand-foreground` | `oklch(0.985 0 0)` | `oklch(0.165 0 0)` | Brand text |
| `--primary` | `oklch(0.205 0 0)` | `oklch(0.922 0 0)` | Primary buttons |
| `--primary-foreground` | `oklch(0.985 0 0)` | `oklch(0.205 0 0)` | Primary text |
| `--secondary` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | Secondary buttons |
| `--secondary-foreground` | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` | Secondary text |

### State Colors

| Variable | Light Mode | Dark Mode | Usage |
|----------|------------|-----------|-------|
| `--muted` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | Muted backgrounds |
| `--muted-foreground` | `oklch(0.556 0 0)` | `oklch(0.708 0 0)` | Secondary text |
| `--accent` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | Accent backgrounds |
| `--accent-foreground` | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` | Accent text |
| `--destructive` | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` | Error states |

### UI Elements

| Variable | Light Mode | Dark Mode | Usage |
|----------|------------|-----------|-------|
| `--border` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` | Borders |
| `--input` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 15%)` | Input backgrounds |
| `--ring` | `oklch(0.708 0 0)` | `oklch(0.556 0 0)` | Focus rings |
| `--grid` | `oklch(0.84 0.01 255 / 0.55)` | `oklch(0.34 0.01 255 / 0.5)` | Grid lines |

### Sidebar Colors

| Variable | Light Mode | Dark Mode | Usage |
|----------|------------|-----------|-------|
| `--sidebar` | `oklch(0.985 0 0)` | `oklch(0.205 0 0)` | Sidebar bg |
| `--sidebar-foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | Sidebar text |
| `--sidebar-primary` | `oklch(0.205 0 0)` | `oklch(0.488 0.243 264.376)` | Primary accent |
| `--sidebar-primary-foreground` | `oklch(0.985 0 0)` | `oklch(0.985 0 0)` | Primary text |
| `--sidebar-accent` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | Hover/active bg |
| `--sidebar-accent-foreground` | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` | Hover/active text |
| `--sidebar-border` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` | Sidebar borders |
| `--sidebar-ring` | `oklch(0.708 0 0)` | `oklch(0.556 0 0)` | Focus rings |

### Chart Colors

| Variable | Value |
|----------|-------|
| `--chart-1` | `oklch(0.87 0 0)` |
| `--chart-2` | `oklch(0.556 0 0)` |
| `--chart-3` | `oklch(0.439 0 0)` |
| `--chart-4` | `oklch(0.371 0 0)` |
| `--chart-5` | `oklch(0.269 0 0)` |

## Radius Tokens

| Variable | Formula | Value (at 0.45rem base) |
|----------|---------|------------------------|
| `--radius` | Base | 0.45rem |
| `--radius-sm` | `calc(var(--radius) * 0.6)` | 0.27rem |
| `--radius-md` | `calc(var(--radius) * 0.8)` | 0.36rem |
| `--radius-lg` | `var(--radius)` | 0.45rem |
| `--radius-xl` | `calc(var(--radius) * 1.4)` | 0.63rem |
| `--radius-2xl` | `calc(var(--radius) * 1.8)` | 0.81rem |
| `--radius-3xl` | `calc(var(--radius) * 2.2)` | 0.99rem |
| `--radius-4xl` | `calc(var(--radius) * 2.6)` | 1.17rem |

## Tailwind Class Mapping

### Background Colors

```
bg-background          → var(--background)
bg-foreground          → var(--foreground)
bg-card                → var(--card)
bg-popover             → var(--popover)
bg-primary             → var(--primary)
bg-secondary           → var(--secondary)
bg-muted               → var(--muted)
bg-accent              → var(--accent)
bg-destructive         → var(--destructive)
bg-brand               → var(--brand)
bg-surface-elevated    → var(--surface-elevated)
bg-surface-strong      → var(--surface-strong)
```

### Text Colors

```
text-background          → var(--background)
text-foreground          → var(--foreground)
text-card-foreground     → var(--card-foreground)
text-popover-foreground  → var(--popover-foreground)
text-primary-foreground  → var(--primary-foreground)
text-secondary-foreground→ var(--secondary-foreground)
text-muted-foreground    → var(--muted-foreground)
text-accent-foreground   → var(--accent-foreground)
text-destructive         → var(--destructive)
text-brand-foreground    → var(--brand-foreground)
```

### Border Colors

```
border-border           → var(--border)
border-input            → var(--input)
border-ring             → var(--ring)
```

### Radius

```
rounded-sm              → var(--radius-sm)
rounded-md              → var(--radius-md)
rounded-lg              → var(--radius-lg)
rounded-xl              → var(--radius-xl)
rounded-2xl             → var(--radius-2xl)
rounded-3xl             → var(--radius-3xl)
rounded-4xl             → var(--radius-4xl)
```

## Common Color Patterns

### Card Container
```
bg-card text-card-foreground rounded-xl ring-1 ring-foreground/10
```

### Elevated Surface
```
bg-surface-elevated border border-foreground/5
```

### Frosted Glass Effect
```
bg-popover/70 backdrop-blur-2xl backdrop-saturate-150
```

### Destructive State
```
bg-destructive/10 text-destructive
// Dark mode:
dark:bg-destructive/20
```

### Focus Ring
```
focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50
```

### Invalid State
```
aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20
dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40
```
